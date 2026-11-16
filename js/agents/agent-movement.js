/**
 * Coderia.dev — Agent Movement & Mouse Orbit System
 * Integrates GSAP for smooth curved trajectories and dynamic mouse-following inward orbital ring.
 * Continuously samples scroll offsets on every frame so cursors never freeze during scroll.
 * Supports smooth departure from orbit to build elements, and smooth return back into orbit.
 */

export class AgentMovement {
  constructor() {
    this.activeTweens = new Map();
    this.orbitRafId = null;
    this.isOrbiting = false;
    this.orbitAngle = 0;
    this.orbitRadius = 44;
    this.orbitingAgents = new Set();

    // Viewport client coordinates of mouse (default to center)
    this.clientMouseX = window.innerWidth * 0.5;
    this.clientMouseY = window.innerHeight * 0.45;

    this.initMouseListener();
  }

  initMouseListener() {
    const updateMouse = (e) => {
      this.clientMouseX = e.clientX;
      this.clientMouseY = e.clientY;
    };

    window.addEventListener('mousemove', updateMouse, { passive: true });
    window.addEventListener('pointermove', updateMouse, { passive: true });
  }

  /**
   * Samples live document coordinates of the mouse on each animation frame
   * (guarantees seamless tracking even when scrolling without moving the mouse)
   */
  getLiveMousePosition() {
    const scrollX = window.scrollX || window.pageXOffset || 0;
    const scrollY = window.scrollY || window.pageYOffset || 0;
    return {
      x: this.clientMouseX + scrollX,
      y: this.clientMouseY + scrollY
    };
  }

  /**
   * Animates an agent cursor to target coordinates using GSAP
   */
  moveTo(cursor, targetX, targetY, options = {}) {
    if (!window.gsap || !cursor || !cursor.element) {
      cursor.setPosition(targetX, targetY);
      return null;
    }

    const duration = (options.duration || 0.8) / (cursor.profile.speed || 1);
    const ease = options.ease || 'power3.out';

    this.stopMovement(cursor.profile.id);

    const tween = window.gsap.to(cursor, {
      x: targetX,
      y: targetY,
      duration: duration,
      ease: ease,
      onUpdate: () => {
        cursor.setPosition(cursor.x, cursor.y);
      },
      onComplete: () => {
        this.activeTweens.delete(cursor.profile.id);
        if (options.onComplete) options.onComplete();
      }
    });

    this.activeTweens.set(cursor.profile.id, tween);
    return tween;
  }

  /**
   * Activates the signature idle state:
   * 1. Hides all text labels (.is-idle)
   * 2. Forms an inward-pointing circular ring around the visitor's mouse
   * 3. Seamlessly follows mouse movements and scroll at 60 FPS
   * 
   * @param {AgentCursor[]} agents 
   * @param {number} radius 
   */
  startMouseOrbit(agents, radius = 44) {
    this.orbitRadius = radius;
    agents.forEach(agent => {
      this.orbitingAgents.add(agent);
      agent.setIdle(true);
      agent.setVisible(true);
    });

    if (!this.isOrbiting) {
      this.isOrbiting = true;
      this.runOrbitLoop();
    }
  }

  runOrbitLoop() {
    const animateOrbit = () => {
      if (!this.isOrbiting) return;

      const count = this.orbitingAgents.size;
      if (count > 0) {
        const { x: liveMouseX, y: liveMouseY } = this.getLiveMousePosition();
        this.orbitAngle += 0.007;

        let i = 0;
        this.orbitingAgents.forEach((agent) => {
          // If this agent has an active return flight tween, let GSAP control its position
          if (this.activeTweens.has(agent.profile.id)) {
            i++;
            return;
          }

          const baseAngle = (i / count) * Math.PI * 2 + this.orbitAngle;
          const targetX = liveMouseX + Math.cos(baseAngle) * this.orbitRadius - 10;
          const targetY = liveMouseY + Math.sin(baseAngle) * this.orbitRadius - 10;

          // Smooth spring interpolation towards mouse orbit
          agent.x += (targetX - agent.x) * 0.22;
          agent.y += (targetY - agent.y) * 0.22;
          agent.setPosition(agent.x, agent.y);

          // Calculate inward rotation pointing straight at mouse center
          const dx = liveMouseX - (agent.x + 10);
          const dy = liveMouseY - (agent.y + 10);
          const rad = Math.atan2(dy, dx);
          const deg = (rad * 180 / Math.PI) + 135;
          agent.setRotation(deg);

          i++;
        });
      }

      this.orbitRafId = requestAnimationFrame(animateOrbit);
    };

    this.orbitRafId = requestAnimationFrame(animateOrbit);
  }

  /**
   * Smoothly releases an agent from the mouse orbit to execute a construction task
   */
  leaveOrbit(agent) {
    if (!agent) return;
    this.orbitingAgents.delete(agent);
    this.stopMovement(agent.profile.id);
    agent.setIdle(false);

    // Smoothly restore arrow pointer rotation to neutral
    if (window.gsap && agent.svgPointer) {
      window.gsap.to(agent.svgPointer, {
        rotation: 0,
        duration: 0.25,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    } else {
      agent.resetRotation();
    }
  }

  /**
   * Smoothly returns an agent from an element back into the mouse orbit
   */
  returnToOrbit(agent, duration = 0.48) {
    if (!agent) return;
    const gsap = window.gsap;
    this.stopMovement(agent.profile.id);

    // Re-add to orbit set so other cursors accommodate its arrival
    this.orbitingAgents.add(agent);

    if (!gsap) {
      agent.setIdle(true);
      return;
    }

    agent.setAction('JOINING', 'is-selecting');

    const startX = agent.x;
    const startY = agent.y;
    const progress = { p: 0 };

    const tween = gsap.to(progress, {
      p: 1,
      duration: duration / (agent.profile.speed || 1),
      ease: 'power2.inOut',
      onUpdate: () => {
        const { x: curMouseX, y: curMouseY } = this.getLiveMousePosition();
        agent.x = startX + (curMouseX - startX) * progress.p;
        agent.y = startY + (curMouseY - startY) * progress.p;
        agent.setPosition(agent.x, agent.y);
      },
      onComplete: () => {
        this.activeTweens.delete(agent.profile.id);
        agent.setIdle(true);
      }
    });

    this.activeTweens.set(agent.profile.id, tween);
  }

  stopMouseOrbit(agents = []) {
    if (agents && agents.length > 0) {
      agents.forEach(agent => {
        this.orbitingAgents.delete(agent);
        agent.setIdle(false);
        agent.resetRotation();
      });
      return;
    }

    this.isOrbiting = false;
    this.orbitingAgents.clear();
    if (this.orbitRafId) {
      cancelAnimationFrame(this.orbitRafId);
      this.orbitRafId = null;
    }
  }

  stopMovement(agentId) {
    if (this.activeTweens.has(agentId)) {
      const tween = this.activeTweens.get(agentId);
      if (tween && tween.kill) tween.kill();
      this.activeTweens.delete(agentId);
    }
  }

  stopAll() {
    this.activeTweens.forEach(tween => {
      if (tween && tween.kill) tween.kill();
    });
    this.activeTweens.clear();
  }
}
