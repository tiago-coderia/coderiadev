/**
 * Coderia.dev — Navigation & Interactive Triggers
 * Handles header scroll, mobile drawer, and clipboard email copying (from Header.tsx and Cta.tsx)
 */

export class Navigation {
  constructor() {
    this.header = document.getElementById('site-header');
    this.mobileToggle = document.getElementById('mobile-menu-toggle');
    this.mobileNav = document.getElementById('mobile-nav');
    this.mobileLinks = document.querySelectorAll('.mobile-nav-link');
    this.desktopLinks = document.querySelectorAll('.nav-link');
    this.contactButtons = document.querySelectorAll('[data-email]');
    
    this.init();
  }

  init() {
    this.bindScroll();
    this.bindMobileToggle();
    this.bindLinks();
    this.bindEmailCopy();
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
    this.mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.setMobileMenuState(false);
      });
    });

    this.desktopLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.desktopLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      });
    });
  }

  bindEmailCopy() {
    this.contactButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const email = btn.getAttribute('data-email') || 'hello@coderia.dev';
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
          window.location.href = `mailto:${email}`;
          return;
        }

        navigator.clipboard.writeText(email).then(() => {
          const textSpan = btn.querySelector('.btn-text') || btn;
          const originalText = textSpan.textContent;
          textSpan.textContent = 'Email Copiado!';

          setTimeout(() => {
            textSpan.textContent = originalText;
          }, 2000);
        }).catch(() => {
          window.location.href = `mailto:${email}`;
        });
      });
    });
  }
}
