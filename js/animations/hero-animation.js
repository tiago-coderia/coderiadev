/**
 * Coderia.dev — Section Elements Reveal Animations
 * Synchronizes element reveals with Swarm agent constructions across all 5 sections
 */

export class HeroAnimation {
  constructor(heroInstance) {
    this.hero = heroInstance;
    this.initElementStates();
  }

  initElementStates() {
    const gsap = window.gsap;
    if (!gsap) return;

    // Header & Hero initial states
    gsap.set('.brand-logo', { opacity: 0, y: -10 });
    gsap.set('.nav-item', { opacity: 0, y: -8 });
    gsap.set('#header-contact-btn', { opacity: 0, scale: 0.95 });
    
    gsap.set('#hero-symbol', { opacity: 0, scale: 0.7, y: 15 });
    gsap.set('#hero-headline', { opacity: 0, y: 20 });
    gsap.set('#hero-description', { opacity: 0, y: 15 });
    gsap.set('#hero-primary-cta', { opacity: 0, y: 15, scale: 0.95 });
    gsap.set('#hero-showcase-frame', { opacity: 0, y: 30, scale: 0.96 });

    // Workflow (#potencialize) initial states
    gsap.set('#workflow-header', { opacity: 0, y: 25 });
    gsap.set('.card-tec', { opacity: 0, y: 30, scale: 0.96 });

    // Services (#servicos) initial states
    gsap.set('#services-header', { opacity: 0, y: 25 });
    gsap.set('.service-card', { opacity: 0, y: 30, scale: 0.96 });

    // CTA (#contato) initial states
    gsap.set('#cta-container', { opacity: 0, y: 25 });

    // Footer initial states
    gsap.set('#footer-brand', { opacity: 0, y: 15 });
    gsap.set('#footer-symbol', { opacity: 0, scale: 0.8 });
    gsap.set('#footer-social-links', { opacity: 0, y: 15 });
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
    gsap.to('#header-contact-btn', { opacity: 1, scale: 1, duration: 0.5, delay: 0.2, ease: 'back.out(1.5)' });
  }

  revealHeroSymbol() {
    const gsap = window.gsap;
    if (!gsap) return;
    gsap.to('#hero-symbol', { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'back.out(1.6)' });
  }

  revealHeadline() {
    const gsap = window.gsap;
    if (!gsap) return;
    return gsap.to('#hero-headline', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
  }

  glowHeadlineHighlight() {
    const gsap = window.gsap;
    const highlight = document.getElementById('headline-highlight');
    if (!gsap || !highlight) return;
    gsap.fromTo(highlight, 
      { filter: 'brightness(1)' },
      { filter: 'brightness(1.5) drop-shadow(0 0 18px rgba(169, 149, 201, 0.45))', duration: 0.5, yoyo: true, repeat: 1 }
    );
  }

  revealDescription() {
    const gsap = window.gsap;
    if (!gsap) return;
    gsap.to('#hero-description', { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' });
  }

  revealPrimaryCta() {
    const gsap = window.gsap;
    if (!gsap) return;
    gsap.to('#hero-primary-cta', { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.5)' });
  }

  revealShowcaseFrame() {
    const gsap = window.gsap;
    if (!gsap) return;
    gsap.to('#hero-showcase-frame', { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out' });
  }

  // Section 2: Workflow
  revealWorkflowHeader() {
    const gsap = window.gsap;
    if (!gsap) return;
    gsap.to('#workflow-header', { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' });
  }

  revealWorkflowCard(index) {
    const gsap = window.gsap;
    const card = document.getElementById(`card-tec-${index}`);
    if (!gsap || !card) return;
    gsap.to(card, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.3)' });
  }

  // Section 3: Services
  revealServicesHeader() {
    const gsap = window.gsap;
    if (!gsap) return;
    gsap.to('#services-header', { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' });
  }

  revealServiceCard(index) {
    const gsap = window.gsap;
    const card = document.getElementById(`service-card-${index}`);
    if (!gsap || !card) return;
    gsap.to(card, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.3)' });
  }

  // Section 4: CTA
  revealCta() {
    const gsap = window.gsap;
    if (!gsap) return;
    gsap.to('#cta-container', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
  }

  // Section 5: Footer
  revealFooter() {
    const gsap = window.gsap;
    if (!gsap) return;
    gsap.to(['#footer-brand', '#footer-symbol', '#footer-social-links'], {
      opacity: 1,
      y: 0,
      scale: 1,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power2.out'
    });
  }

  showFinalStateImmediate() {
    const gsap = window.gsap;
    const selectors = [
      '.brand-logo', '.nav-item', '#header-contact-btn',
      '#hero-symbol', '#hero-headline', '#hero-description', '#hero-primary-cta', '#hero-showcase-frame',
      '#workflow-header', '.card-tec',
      '#services-header', '.service-card',
      '#cta-container',
      '#footer-brand', '#footer-symbol', '#footer-social-links'
    ];
    if (gsap) {
      gsap.set(selectors.join(','), { opacity: 1, y: 0, scale: 1, clearProps: 'transform' });
    }
  }
}
