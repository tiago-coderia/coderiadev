/**
 * Coderia.dev — Navigation Component
 * Handles header scroll states, mobile menu toggle, and accessible interactions
 */

export class Navigation {
  constructor() {
    this.header = document.getElementById('site-header');
    this.mobileToggle = document.getElementById('mobile-menu-toggle');
    this.mobileNav = document.getElementById('mobile-nav');
    this.mobileLinks = document.querySelectorAll('.mobile-nav-link');
    this.desktopLinks = document.querySelectorAll('.nav-link');
    
    this.init();
  }

  init() {
    this.bindScroll();
    this.bindMobileToggle();
    this.bindLinks();
  }

  bindScroll() {
    if (!this.header) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 20) {
            this.header.classList.add('is-scrolled');
          } else {
            this.header.classList.remove('is-scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  bindMobileToggle() {
    if (!this.mobileToggle || !this.mobileNav) return;

    this.mobileToggle.addEventListener('click', () => {
      const isExpanded = this.mobileToggle.getAttribute('aria-expanded') === 'true';
      this.setMobileMenuState(!isExpanded);
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.mobileNav.classList.contains('is-open')) {
        this.setMobileMenuState(false);
      }
    });
  }

  setMobileMenuState(isOpen) {
    this.mobileToggle.setAttribute('aria-expanded', String(isOpen));
    this.mobileNav.setAttribute('aria-hidden', String(!isOpen));
    
    if (isOpen) {
      this.mobileNav.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    } else {
      this.mobileNav.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  }

  bindLinks() {
    // Close mobile nav when clicking a link
    this.mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.setMobileMenuState(false);
      });
    });

    // Active state highlighting for desktop links
    this.desktopLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        this.desktopLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      });
    });
  }
}
