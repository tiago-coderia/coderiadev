/**
 * Coderia.dev — Agent Movement & Mouse Orbit System
 * Integrates GSAP for linear movements and real-time mouse-following inward orbital ring (Swarm Idle)
 */

export class AgentMovement {
  constructor() {
    this.activeTweens = new Map();
    this.orbitRafId = null;
    this.isOrbiting = false;
    this.orbitAngle = 0;

    // Track mouse position in document coordinates
    const scrollY = window.scrollY || window.pageYOffset || 0;
    this.mouseX = window.innerWidth * 0.5;
    this.mouseY = scrollY + window.innerHeight * 0.45;

    this.initMouseListener();
  }

  initMouseListener() {
    window.addEventListener('mousemove', (e) => {
      const scrollX = window.scrollX || window.pageXOffset || 0;
      const scrollY = window.scrollY || window.pageYOffset || 0;
      this.mouseX = e.clientX + scrollX;
      this.mouseY = e.clientY + scrollY;
    }, { passive: true });
  }

  /**
   * Animates an agent cursor to target coordinates using GSAP
   */
  moveTo(cursor, targetX, targetY, options = {}) {
    if (!window.gsap || !cursor || !cursor.element) {
      cursor.setPosition(targetX, targetY);
      return null;
    }

    const duration = (options.duration || 1.1) / (cursor.profile.speed || 1);
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
   * 2. Forms a circular inward-pointing ring around the visitor's mouse
   * 3. Follows the cursor smoothly across scroll and movements
   * 
   * @param {AgentCursor[]} agents 
   * @param {number} radius 
   */
  startMouseOrbit(agents, radius = 48) {
    this.stopAll();
    this.stopMouseOrbit();

    this.isOrbiting = true;
    const total = agents.length;

    // Put all agents into idle state (hides pill tags)
    agents.forEach(agent => {
      agent.setIdle(true);
      agent.setVisible(true);
    });

    const animateOrbit = () => {
      if (!this.isOrbiting) return;

      this.orbitAngle += 0.008;

      agents.forEach((agent, i) => {
        const baseAngle = (i / total) * Math.PI * 2 + this.orbitAngle;
        const targetX = this.mouseX + Math.cos(baseAngle) * radius - 10;
        const targetY = this.mouseY + Math.sin(baseAngle) * radius - 10;

        // Smooth spring interpolation towards mouse orbit
        agent.x += (targetX - agent.x) * 0.16;
        agent.y += (targetY - agent.y) * 0.16;
        agent.setPosition(agent.x, agent.y);

        // Calculate inward rotation pointing straight at mouse center
        const dx = this.mouseX - (agent.x + 10);
        const dy = this.mouseY - (agent.y + 10);
        const rad = Math.atan2(dy, dx);
        const deg = (rad * 180 / Math.PI) + 135;
        agent.setRotation(deg);
      });

      this.orbitRafId = requestAnimationFrame(animateOrbit);
    };

    this.orbitRafId = requestAnimationFrame(animateOrbit);
  }

  stopMouseOrbit(agents = []) {
    this.isOrbiting = false;
    if (this.orbitRafId) {
      cancelAnimationFrame(this.orbitRafId);
      this.orbitRafId = null;
    }

    if (agents && agents.length > 0) {
      agents.forEach(agent => {
        agent.setIdle(false);
        agent.resetRotation();
      });
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
