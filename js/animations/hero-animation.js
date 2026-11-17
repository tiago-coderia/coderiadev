/**
 * Coderia.dev — Section Elements Reveal & Word-by-Word Typing Animations
 * Guarantees content ONLY appears AFTER the wireframe box is drawn.
 * Implements realistic word-by-word typing for text elements.
 */

export class HeroAnimation {
  constructor(heroInstance) {
    this.hero = heroInstance;
    this.initElementStates();
  }

  /**
   * Prepares a text container by wrapping text nodes into word spans
   * Preserves inner HTML tags, line breaks, and whitespace
   */
  prepareTextForTyping(element) {
    if (!element) return [];

    const existingWords = element.querySelectorAll('.type-word');
    if (existingWords.length > 0) {
      existingWords.forEach(w => {
        w.style.opacity = '0';
        w.style.display = 'inline-block';
      });
      return Array.from(existingWords);
    }

    function wrapWords(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        if (!text.trim()) return null;

        const frag = document.createDocumentFragment();
        const tokens = text.split(/(\s+)/);
        tokens.forEach(token => {
          if (!token) return;
          if (/^\s+$/.test(token)) {
            frag.appendChild(document.createTextNode(token));
          } else {
            const span = document.createElement('span');
            span.className = 'type-word';
            span.style.opacity = '0';
            span.style.display = 'inline-block';
            span.style.willChange = 'opacity, transform';
            span.textContent = token;
            frag.appendChild(span);
          }
        });
        return frag;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const children = Array.from(node.childNodes);
        children.forEach(child => {
          const replacement = wrapWords(child);
          if (replacement) {
            node.replaceChild(replacement, child);
          }
        });
        return null;
      }
      return null;
    }

    wrapWords(element);
    return Array.from(element.querySelectorAll('.type-word'));
  }

  /**
   * Types out an element word-by-word with live cursor following
   */
  async typeTextWords(element, agent = null, options = {}) {
    if (!element) return;
    const words = this.prepareTextForTyping(element);
    const wordDelay = options.wordDelay || 50;
    const gsap = window.gsap;

    element.style.opacity = '1';
    element.style.visibility = 'visible';

    if (agent) {
      agent.setAction('TYPING...', 'is-typing');
    }

    for (let i = 0; i < words.length; i++) {
      const wordSpan = words[i];

      if (gsap) {
        gsap.fromTo(wordSpan,
          { opacity: 0, y: 3 },
          { opacity: 1, y: 0, duration: 0.12, ease: 'power1.out' }
        );
      } else {
        wordSpan.style.opacity = '1';
      }

      // Cursor follows the typing position dynamically
      if (agent && i % 2 === 0) {
        const rect = wordSpan.getBoundingClientRect();
        const scrollX = window.scrollX || window.pageXOffset || 0;
        const scrollY = window.scrollY || window.pageYOffset || 0;
        agent.setPosition(rect.right + scrollX + 4, rect.top + scrollY + 4);
      }

      await new Promise(r => setTimeout(r, wordDelay));
    }

    if (agent) {
      agent.setAction('COMPLETED', 'is-selecting');
    }
  }

  /**
   * Strictly hides all elements initially so nothing is visible before wireframing
   */
  initElementStates() {
    const gsap = window.gsap;
    if (!gsap) return;

    // Header initial states
    gsap.set('.brand-logo', { opacity: 0, y: -10 });
    gsap.set('.nav-item', { opacity: 0, y: -8 });
    gsap.set('#header-contact-btn', { opacity: 0, scale: 0.95 });
    
    // Hero initial states
    gsap.set('#hero-symbol', { opacity: 0, scale: 0.7, y: 15 });
    gsap.set('#hero-headline', { opacity: 0 });
    gsap.set('#hero-description', { opacity: 0 });
    gsap.set('#hero-primary-cta', { opacity: 0, y: 15, scale: 0.95 });
    gsap.set('#hero-showcase-frame', { opacity: 0, y: 30, scale: 0.96 });

    // Prepare Hero text words
    const headline = document.getElementById('hero-headline');
    if (headline) this.prepareTextForTyping(headline);
    const desc = document.getElementById('hero-description');
    if (desc) this.prepareTextForTyping(desc);

    // Workflow initial states
    gsap.set('#workflow-title', { opacity: 0 });
    gsap.set('#workflow-subtitle', { opacity: 0 });
    const wfTitle = document.getElementById('workflow-title');
    if (wfTitle) this.prepareTextForTyping(wfTitle);
    const wfSub = document.getElementById('workflow-subtitle');
    if (wfSub) this.prepareTextForTyping(wfSub);
    gsap.set('.card-tec', { opacity: 0, y: 30, scale: 0.96 });

    // Services initial states
    gsap.set('#services-title', { opacity: 0 });
    gsap.set('#services-subtitle', { opacity: 0 });
    const srvTitle = document.getElementById('services-title');
    if (srvTitle) this.prepareTextForTyping(srvTitle);
    const srvSub = document.getElementById('services-subtitle');
    if (srvSub) this.prepareTextForTyping(srvSub);
    gsap.set('.service-card', { opacity: 0, y: 30, scale: 0.96 });

    // CTA initial states
    gsap.set('#cta-title', { opacity: 0 });
    gsap.set('#cta-subtitle', { opacity: 0 });
    const ctaTitle = document.getElementById('cta-title');
    if (ctaTitle) this.prepareTextForTyping(ctaTitle);
    const ctaSub = document.getElementById('cta-subtitle');
    if (ctaSub) this.prepareTextForTyping(ctaSub);
    gsap.set('#cta-contact-btn', { opacity: 0, y: 15, scale: 0.95 });

    // Footer initial states
    gsap.set('#footer-brand', { opacity: 0, y: 15 });
    gsap.set('#footer-symbol', { opacity: 0, scale: 0.8 });
    gsap.set('#footer-social-links', { opacity: 0, y: 15 });
  }

  // Header reveals
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

  // Hero reveals
  revealHeroSymbol() {
    const gsap = window.gsap;
    if (!gsap) return;
    gsap.to('#hero-symbol', { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'back.out(1.6)' });
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

  // Section 2: Workflow reveals
  revealWorkflowCard(index) {
    const gsap = window.gsap;
    const card = document.getElementById(`card-tec-${index}`);
    if (!gsap || !card) return;
    gsap.to(card, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.3)' });
  }

  // Section 3: Services reveals
  revealServiceCard(index) {
    const gsap = window.gsap;
    const card = document.getElementById(`service-card-${index}`);
    if (!gsap || !card) return;
    gsap.to(card, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.3)' });
  }

  // Section 4: CTA reveals
  revealCtaButton() {
    const gsap = window.gsap;
    const btn = document.getElementById('cta-contact-btn');
    if (!gsap || !btn) return;
    gsap.to(btn, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.5)' });
  }

  // Section 5: Footer reveals
  revealFooterBrand() {
    const gsap = window.gsap;
    if (!gsap) return;
    gsap.to('#footer-brand', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
  }

  revealFooterSymbol() {
    const gsap = window.gsap;
    if (!gsap) return;
    gsap.to('#footer-symbol', { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.6)' });
  }

  revealFooterSocials() {
    const gsap = window.gsap;
    if (!gsap) return;
    gsap.to('#footer-social-links', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
  }

  showFinalStateImmediate() {
    const gsap = window.gsap;
    const selectors = [
      '.brand-logo', '.nav-item', '#header-contact-btn',
      '#hero-symbol', '#hero-headline', '#hero-description', '#hero-primary-cta', '#hero-showcase-frame',
      '#workflow-title', '#workflow-subtitle', '.card-tec',
      '#services-title', '#services-subtitle', '.service-card',
      '#cta-title', '#cta-subtitle', '#cta-contact-btn',
      '#footer-brand', '#footer-symbol', '#footer-social-links'
    ];
    if (gsap) {
      gsap.set(selectors.join(','), { opacity: 1, y: 0, scale: 1, clearProps: 'transform' });
      document.querySelectorAll('.type-word').forEach(w => w.style.opacity = '1');
    }
  }
}
