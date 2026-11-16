/**
 * Coderia.dev — Hero Elements Reveal Animation
 * Synchronizes DOM element entrance with coordinated agent actions
 */

export class HeroAnimation {
  constructor(heroInstance) {
    this.hero = heroInstance;
    this.initElementStates();
  }

  initElementStates() {
    const gsap = window.gsap;
    if (!gsap) return;

    // Initially hide elements for sequential agent construction
    gsap.set('.brand-logo', { opacity: 0, y: -10 });
    gsap.set('.nav-item', { opacity: 0, y: -8 });
    gsap.set('#header-cta-btn', { opacity: 0, scale: 0.95 });
    
    gsap.set(this.hero.eyebrow, { opacity: 0, y: 15 });
    gsap.set(this.hero.headline, { opacity: 0, y: 20 });
    gsap.set(this.hero.description, { opacity: 0, y: 15 });
    gsap.set(this.hero.actions, { opacity: 0, y: 15 });
    gsap.set(this.hero.complementary, { opacity: 0, scale: 0.95 });
  }

  revealBlueprintLines() {
    const gsap = window.gsap;
    if (!gsap) return;

    if (this.hero.blueprintLineH) {
      gsap.to(this.hero.blueprintLineH, { scaleX: 1, duration: 1.2, ease: 'power2.inOut' });
    }
    if (this.hero.blueprintLineV) {
      gsap.to(this.hero.blueprintLineV, { scaleY: 1, duration: 1.4, ease: 'power2.inOut', delay: 0.2 });
    }
  }

  revealLogo() {
    const gsap = window.gsap;
    if (!gsap) return;
    gsap.to('.brand-logo', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
  }

  revealNav() {
    const gsap = window.gsap;
    if (!gsap) return;
    gsap.to('.nav-item', { opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: 'power2.out' });
    gsap.to('#header-cta-btn', { opacity: 1, scale: 1, duration: 0.5, delay: 0.2, ease: 'back.out(1.5)' });
  }

  revealEyebrow() {
    const gsap = window.gsap;
    if (!gsap) return;
    gsap.to(this.hero.eyebrow, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
  }

  revealHeadline() {
    const gsap = window.gsap;
    if (!gsap) return;
    return gsap.to(this.hero.headline, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
  }

  glowHeadlineHighlight() {
    const gsap = window.gsap;
    if (!gsap || !this.hero.headlineHighlight) return;
    gsap.fromTo(this.hero.headlineHighlight, 
      { filter: 'brightness(1)' },
      { filter: 'brightness(1.4) drop-shadow(0 0 16px rgba(56, 189, 248, 0.4))', duration: 0.5, yoyo: true, repeat: 1 }
    );
  }

  revealDescription() {
    const gsap = window.gsap;
    if (!gsap) return;
    gsap.to(this.hero.description, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' });
  }

  revealCtas() {
    const gsap = window.gsap;
    if (!gsap) return;
    gsap.to(this.hero.actions, { opacity: 1, y: 0, duration: 0.7, ease: 'back.out(1.4)' });
  }

  revealComplementary() {
    const gsap = window.gsap;
    if (!gsap) return;
    gsap.to(this.hero.complementary, { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' });
  }

  showFinalStateImmediate() {
    const gsap = window.gsap;
    const elements = [
      '.brand-logo', '.nav-item', '#header-cta-btn',
      this.hero.eyebrow, this.hero.headline, this.hero.description,
      this.hero.actions, this.hero.complementary
    ];
    if (gsap) {
      gsap.set(elements, { opacity: 1, y: 0, scale: 1, clearProps: 'transform' });
      if (this.hero.blueprintLineH) gsap.set(this.hero.blueprintLineH, { scaleX: 1 });
      if (this.hero.blueprintLineV) gsap.set(this.hero.blueprintLineV, { scaleY: 1 });
    } else {
      elements.forEach(sel => {
        if (typeof sel === 'string') {
          document.querySelectorAll(sel).forEach(el => el.style.opacity = '1');
        } else if (sel) {
          sel.style.opacity = '1';
        }
      });
    }
  }
}
