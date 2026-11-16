/**
 * Coderia.dev — UI Microinteractions with Motion
 * Handles high-fidelity button microinteractions, nav hover transitions, and tactile feedback
 */

export class Transitions {
  constructor() {
    this.primaryCta = document.getElementById('hero-primary-cta');
    this.secondaryCta = document.getElementById('hero-secondary-cta');
    this.headerCta = document.getElementById('header-cta-btn');
    this.navLinks = document.querySelectorAll('.nav-link');
    
    this.initMicroInteractions();
  }

  initMicroInteractions() {
    this.bindButtonMicroInteractions(this.primaryCta);
    this.bindButtonMicroInteractions(this.secondaryCta);
    this.bindButtonMicroInteractions(this.headerCta);
    this.bindNavLinks();
  }

  /**
   * Applies Motion-driven spring physics to buttons on hover and press
   * @param {HTMLElement} btn 
   */
  bindButtonMicroInteractions(btn) {
    if (!btn) return;

    const animate = window.Motion?.animate;

    btn.addEventListener('mouseenter', () => {
      if (animate) {
        animate(btn, { scale: 1.03, y: -2 }, { duration: 0.25, easing: [0.34, 1.56, 0.64, 1] });
      } else {
        btn.style.transform = 'translateY(-2px) scale(1.03)';
      }
    });

    btn.addEventListener('mouseleave', () => {
      if (animate) {
        animate(btn, { scale: 1, y: 0 }, { duration: 0.2, easing: [0.16, 1, 0.3, 1] });
      } else {
        btn.style.transform = 'translateY(0) scale(1)';
      }
    });

    btn.addEventListener('mousedown', () => {
      if (animate) {
        animate(btn, { scale: 0.97 }, { duration: 0.1 });
      } else {
        btn.style.transform = 'scale(0.97)';
      }
    });

    btn.addEventListener('mouseup', () => {
      if (animate) {
        animate(btn, { scale: 1.03 }, { duration: 0.15 });
      }
    });
  }

  bindNavLinks() {
    const animate = window.Motion?.animate;
    if (!animate) return;

    this.navLinks.forEach(link => {
      link.addEventListener('mouseenter', () => {
        animate(link, { y: -1 }, { duration: 0.18 });
      });

      link.addEventListener('mouseleave', () => {
        animate(link, { y: 0 }, { duration: 0.18 });
      });
    });
  }
}
