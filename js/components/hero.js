/**
 * Coderia.dev — Section Targets & Coordinate Resolver
 * Resolves exact page/document coordinates (accounting for scroll) for all sections:
 * Header, Hero, Workflow, Services, CTA, and Footer
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
   * Retrieves the document position (accounting for window scroll) of a target element
   */
  getElementAnchor(element, offsetX = 0.5, offsetY = 0.5) {
    const scrollX = window.scrollX || window.pageXOffset || 0;
    const scrollY = window.scrollY || window.pageYOffset || 0;

    if (!element) {
      return { x: window.innerWidth * 0.5, y: scrollY + window.innerHeight * 0.5 };
    }
    const rect = element.getBoundingClientRect();
    return {
      x: Math.round(rect.left + scrollX + rect.width * offsetX),
      y: Math.round(rect.top + scrollY + rect.height * offsetY)
    };
  }

  /**
   * Retrieves the exact bounding box of a target element in document coordinates
   * (anchored to the document flow so it never floats on scroll)
   */
  getElementBox(element, padding = 4) {
    const scrollX = window.scrollX || window.pageXOffset || 0;
    const scrollY = window.scrollY || window.pageYOffset || 0;

    if (!element) {
      return { 
        left: 0, 
        top: scrollY, 
        width: 100, 
        height: 40, 
        right: 100, 
        bottom: scrollY + 40 
      };
    }
    const rect = element.getBoundingClientRect();
    const left = Math.round(rect.left + scrollX - padding);
    const top = Math.round(rect.top + scrollY - padding);
    const width = Math.round(rect.width + padding * 2);
    const height = Math.round(rect.height + padding * 2);
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
      footer: () => this.getElementBox(document.getElementById('site-footer'), 0),
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
      showcaseFrame: () => this.getElementAnchor(this.showcaseFrame, 0.5, 0.5),
      
      // Footer anchors
      footerBrand: () => this.getElementAnchor(document.getElementById('footer-brand'), 0.5, 0.5),
      footerSymbol: () => this.getElementAnchor(document.getElementById('footer-symbol'), 0.5, 0.5),
      footerSocial: () => this.getElementAnchor(document.getElementById('footer-social-links'), 0.5, 0.5)
    };
  }
}
