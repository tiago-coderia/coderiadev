/**
 * Coderia.dev — Agent Movement System
 * Integrates GSAP for organic curved motion, velocity, and ambient wandering
 */

export class AgentMovement {
  constructor() {
    this.activeTweens = new Map();
  }

  /**
   * Animates an agent cursor to target coordinates using GSAP
   * @param {AgentCursor} cursor 
   * @param {number} targetX 
   * @param {number} targetY 
   * @param {object} options 
   * @returns {gsap.core.Tween}
   */
  moveTo(cursor, targetX, targetY, options = {}) {
    if (!window.gsap || !cursor || !cursor.element) {
      cursor.setPosition(targetX, targetY);
      return null;
    }

    const duration = (options.duration || 1.2) / (cursor.profile.speed || 1);
    const ease = options.ease || 'power3.out';

    // Stop previous movement tween if active
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
   * Begins a gentle ambient floating drift around an anchor point
   * @param {AgentCursor} cursor 
   * @param {number} radius Drift radius in px
   */
  startAmbientDrift(cursor, radius = 25) {
    if (!window.gsap || !cursor || !cursor.element) return;

    this.stopMovement(cursor.profile.id);

    const baseX = cursor.x;
    const baseY = cursor.y;

    const driftTimeline = window.gsap.timeline({ repeat: -1, yoyo: true });
    
    driftTimeline.to(cursor, {
      x: baseX + (Math.random() * radius * 2 - radius),
      y: baseY + (Math.random() * radius * 2 - radius),
      duration: 3 + Math.random() * 2,
      ease: 'sine.inOut',
      onUpdate: () => cursor.setPosition(cursor.x, cursor.y)
    }).to(cursor, {
      x: baseX + (Math.random() * radius * 2 - radius),
      y: baseY + (Math.random() * radius * 2 - radius),
      duration: 3.5 + Math.random() * 2,
      ease: 'sine.inOut',
      onUpdate: () => cursor.setPosition(cursor.x, cursor.y)
    });

    this.activeTweens.set(cursor.profile.id, driftTimeline);
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
