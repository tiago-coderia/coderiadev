/**
 * Coderia.dev — Section Targets & Coordinate Resolver
 * Resolves live viewport bounding boxes and coordinates for all sections (Header, Hero, Workflow, Services, CTA, Footer)
 */

export class Hero {
  constructor() {
    this.section = document.getElementById('hero');
    this.symbol = document.getElementById('hero-symbol');
    this.headline = document.getElementById('hero-headline');
    this.headlineHighlight = document.getElementById('headline-highlight');
    this.description = document.getElementById('hero-description');
    this.actions = document.getElementById('hero-actions');
    this.primaryCta = document.getElementById('hero-primary-cta');
    this.showcaseFrame = document.getElementById('hero-showcase-frame');
  }

  /**
   * Retrieves the current viewport position of a target element
   */
  getElementAnchor(element, offsetX = 0.5, offsetY = 0.5) {
    if (!element) {
      return { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 };
    }
    const rect = element.getBoundingClientRect();
    return {
      x: rect.left + rect.width * offsetX,
      y: rect.top + rect.height * offsetY
    };
  }

  /**
   * Retrieves the exact bounding box of a target element in viewport coordinates
   */
  getElementBox(element, padding = 4) {
    if (!element) {
      return { left: 0, top: 0, width: 100, height: 40, right: 100, bottom: 40 };
    }
    const rect = element.getBoundingClientRect();
    const left = Math.max(0, rect.left - padding);
    const top = Math.max(0, rect.top - padding);
    const width = Math.max(20, rect.width + padding * 2);
    const height = Math.max(16, rect.height + padding * 2);
    return {
      left,
      top,
      width,
      height,
      right: left + width,
      bottom: top + height
    };
  }

  getTargetBoxes() {
    return {
      // Header
      header: () => this.getElementBox(document.getElementById('site-header'), 0),
      headerLogo: () => this.getElementBox(document.querySelector('.brand-logo'), 6),
      headerNav: () => this.getElementBox(document.querySelector('.nav-list'), 6),
      headerCta: () => this.getElementBox(document.getElementById('header-contact-btn'), 4),

      // Hero
      heroSymbol: () => this.getElementBox(this.symbol, 6),
      headline: () => this.getElementBox(this.headline, 8),
      headlineHighlight: () => this.getElementBox(this.headlineHighlight, 4),
      description: () => this.getElementBox(this.description, 6),
      primaryCta: () => this.getElementBox(this.primaryCta, 4),
      showcaseFrame: () => this.getElementBox(this.showcaseFrame, 8),

      // Workflow (#potencialize)
      workflowHeader: () => this.getElementBox(document.getElementById('workflow-header'), 6),
      workflowCard1: () => this.getElementBox(document.getElementById('card-tec-1'), 6),
      workflowCard2: () => this.getElementBox(document.getElementById('card-tec-2'), 6),
      workflowCard3: () => this.getElementBox(document.getElementById('card-tec-3'), 6),
      workflowCard4: () => this.getElementBox(document.getElementById('card-tec-4'), 6),

      // Services (#servicos)
      servicesHeader: () => this.getElementBox(document.getElementById('services-header'), 6),
      serviceCard1: () => this.getElementBox(document.getElementById('service-card-1'), 6),
      serviceCard2: () => this.getElementBox(document.getElementById('service-card-2'), 6),
      serviceCard3: () => this.getElementBox(document.getElementById('service-card-3'), 6),

      // CTA (#contato)
      ctaContainer: () => this.getElementBox(document.getElementById('cta-container'), 8),
      ctaContactBtn: () => this.getElementBox(document.getElementById('cta-contact-btn'), 4),

      // Footer
      footerBrand: () => this.getElementBox(document.getElementById('footer-brand'), 6),
      footerSymbol: () => this.getElementBox(document.getElementById('footer-symbol'), 4),
      footerSocial: () => this.getElementBox(document.getElementById('footer-social-links'), 6)
    };
  }

  getTargetPositions() {
    return {
      headerLogo: () => this.getElementAnchor(document.querySelector('.brand-logo'), 0.5, 0.5),
      headerNav: () => this.getElementAnchor(document.querySelector('.nav-list'), 0.5, 0.5),
      headerCta: () => this.getElementAnchor(document.getElementById('header-contact-btn'), 0.5, 0.5),
      heroSymbol: () => this.getElementAnchor(this.symbol, 0.5, 0.5),
      headlineStart: () => this.getElementAnchor(this.headline, 0.15, 0.3),
      headlineHighlight: () => this.getElementAnchor(this.headlineHighlight, 0.5, 0.5),
      description: () => this.getElementAnchor(this.description, 0.3, 0.5),
      primaryCta: () => this.getElementAnchor(this.primaryCta, 0.5, 0.5),
      showcaseFrame: () => this.getElementAnchor(this.showcaseFrame, 0.5, 0.5)
    };
  }
}
