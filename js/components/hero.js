/**
 * Coderia.dev — Hero Component
 * Manages hero element targets, coordinates, and text splitting preparation
 */

export class Hero {
  constructor() {
    this.section = document.getElementById('hero');
    this.eyebrow = document.getElementById('hero-eyebrow');
    this.headline = document.getElementById('hero-headline');
    this.headlineHighlight = document.getElementById('headline-highlight');
    this.description = document.getElementById('hero-description');
    this.actions = document.getElementById('hero-actions');
    this.primaryCta = document.getElementById('hero-primary-cta');
    this.secondaryCta = document.getElementById('hero-secondary-cta');
    this.complementary = document.getElementById('hero-complementary');
    this.blueprintLineH = document.getElementById('blueprint-line-h');
    this.blueprintLineV = document.getElementById('blueprint-line-v');

    this.prepareElements();
  }

  prepareElements() {
    // Hide blueprint lines initially
    if (this.blueprintLineH) {
      this.blueprintLineH.style.transform = 'scaleX(0)';
      this.blueprintLineH.style.transformOrigin = 'left center';
    }
    if (this.blueprintLineV) {
      this.blueprintLineV.style.transform = 'scaleY(0)';
      this.blueprintLineV.style.transformOrigin = 'center top';
    }
  }

  /**
   * Retrieves the current viewport position of a target element
   * @param {HTMLElement} element 
   * @param {number} offsetX Normalized offset inside the element [0..1]
   * @param {number} offsetY Normalized offset inside the element [0..1]
   * @returns {{x: number, y: number}}
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
   * @param {HTMLElement} element 
   * @param {number} padding 
   * @returns {{left: number, top: number, width: number, height: number, right: number, bottom: number}}
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
      header: () => {
        const header = document.querySelector('.site-header');
        return this.getElementBox(header, 0);
      },
      headerLogo: () => {
        const logo = document.querySelector('.brand-logo');
        return this.getElementBox(logo, 6);
      },
      headerNav: () => {
        const nav = document.querySelector('.nav-list');
        return this.getElementBox(nav, 6);
      },
      headerCta: () => {
        const btn = document.getElementById('header-cta-btn');
        return this.getElementBox(btn, 4);
      },
      eyebrow: () => this.getElementBox(this.eyebrow, 4),
      headline: () => this.getElementBox(this.headline, 8),
      headlineHighlight: () => this.getElementBox(this.headlineHighlight, 4),
      description: () => this.getElementBox(this.description, 6),
      primaryCta: () => this.getElementBox(this.primaryCta, 4),
      secondaryCta: () => this.getElementBox(this.secondaryCta, 4),
      complementary: () => this.getElementBox(this.complementary, 4)
    };
  }

  getTargetPositions() {
    return {
      headerLogo: () => {
        const logo = document.querySelector('.brand-logo');
        return this.getElementAnchor(logo, 0.5, 0.5);
      },
      headerNav: () => {
        const nav = document.querySelector('.nav-list');
        return this.getElementAnchor(nav, 0.5, 0.5);
      },
      headerCta: () => {
        const btn = document.getElementById('header-cta-btn');
        return this.getElementAnchor(btn, 0.5, 0.5);
      },
      eyebrow: () => this.getElementAnchor(this.eyebrow, 0.1, 0.5),
      headlineStart: () => this.getElementAnchor(this.headline, 0.15, 0.3),
      headlineHighlight: () => this.getElementAnchor(this.headlineHighlight, 0.5, 0.5),
      description: () => this.getElementAnchor(this.description, 0.3, 0.5),
      primaryCta: () => this.getElementAnchor(this.primaryCta, 0.5, 0.5),
      secondaryCta: () => this.getElementAnchor(this.secondaryCta, 0.5, 0.5),
      complementary: () => this.getElementAnchor(this.complementary, 0.5, 0.5),
      blueprintLineH: () => this.getElementAnchor(this.blueprintLineH, 0.5, 0.5)
    };
  }
}
