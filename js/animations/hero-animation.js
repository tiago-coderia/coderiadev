/**
 * Coderia.dev — Section Elements Reveal & Word-by-Word / Letter-by-Letter Typing Animations
 * Guarantees content ONLY appears AFTER the wireframe box or clone is drawn.
 * Implements realistic letter-by-letter writing effect for the main headline,
 * word-by-word typing for text elements, and card image/icon mounting.
 */

export class HeroAnimation {
  constructor(heroInstance) {
    this.hero = heroInstance;
    this.initElementStates();
  }

  /**
   * Prepares the main headline by wrapping individual characters into spans
   * Enables authentic character-by-character typewriter writing effect
   */
  prepareHeadlineForTyping(element) {
    if (!element) return [];

    const existingChars = element.querySelectorAll('.type-char');
    if (existingChars.length > 0) {
      existingChars.forEach(c => {
        c.style.opacity = '0';
        c.style.display = 'inline';
      });
      return Array.from(existingChars);
    }

    function wrapChars(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        if (!text) return null;

        const frag = document.createDocumentFragment();
        for (let i = 0; i < text.length; i++) {
          const ch = text[i];
          if (ch === '\n' || ch === '\r') continue;

          const span = document.createElement('span');
          span.className = 'type-char';
          span.style.opacity = '0';
          span.style.display = 'inline';
          span.style.willChange = 'opacity';
          span.textContent = ch;
          frag.appendChild(span);
        }
        return frag;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const children = Array.from(node.childNodes);
        children.forEach(child => {
          const replacement = wrapChars(child);
          if (replacement) {
            node.replaceChild(replacement, child);
          }
        });
        return null;
      }
      return null;
    }

    wrapChars(element);
    return Array.from(element.querySelectorAll('.type-char'));
  }

  /**
   * Writes out the headline letter-by-letter with live cursor tracking
   */
  async typeHeadlineCharacters(element, agent = null, options = {}) {
    if (!element) return;
    const shouldAbort = options.shouldAbort;
    if (shouldAbort && shouldAbort()) return;

    const chars = this.prepareHeadlineForTyping(element);
    const charDelay = options.charDelay || 36; // 36ms per letter

    element.style.opacity = '1';
    element.style.visibility = 'visible';

    const parentHeadline = document.getElementById('hero-headline');
    if (parentHeadline) {
      parentHeadline.style.opacity = '1';
      parentHeadline.style.visibility = 'visible';
    }

    if (agent) {
      agent.setAction('WRITING...', 'is-typing');
    }

    for (let i = 0; i < chars.length; i++) {
      if (shouldAbort && shouldAbort()) return;

      const charSpan = chars[i];
      charSpan.style.opacity = '1';

      if (agent && (i % 2 === 0 || i === chars.length - 1)) {
        const rect = charSpan.getBoundingClientRect();
        const scrollX = window.scrollX || window.pageXOffset || 0;
        const scrollY = window.scrollY || window.pageYOffset || 0;
        agent.setPosition(rect.right + scrollX + 3, rect.top + scrollY + 4);
      }

      await new Promise(r => setTimeout(r, charDelay));
    }

    if (shouldAbort && shouldAbort()) return;

    if (agent) {
      agent.setAction('WRITTEN', 'is-selecting');
    }
  }

  /**
   * Prepares a text container by wrapping text nodes into word spans
   * Preserves inner HTML tags, line breaks, whitespace, and text-clip gradients
   */
  prepareTextForTyping(element) {
    if (!element) return [];

    const existingWords = element.querySelectorAll('.type-word');
    if (existingWords.length > 0) {
      existingWords.forEach(w => {
        w.style.opacity = '0';
        if (!w.closest('.headline-highlight')) {
          w.style.display = 'inline-block';
        } else {
          w.style.display = 'inline';
        }
      });
      return Array.from(existingWords);
    }

    function wrapWords(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        if (!text.trim()) return null;

        const isHighlight = node.parentElement && node.parentElement.closest('.headline-highlight');
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
            span.style.display = isHighlight ? 'inline' : 'inline-block';
            span.style.willChange = 'opacity';
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
    const shouldAbort = options.shouldAbort;
    if (shouldAbort && shouldAbort()) return;

    const words = this.prepareTextForTyping(element);
    const wordDelay = options.wordDelay || 45;
    const gsap = window.gsap;

    element.style.opacity = '1';
    element.style.visibility = 'visible';

    if (agent) {
      agent.setAction('TYPING...', 'is-typing');
    }

    for (let i = 0; i < words.length; i++) {
      if (shouldAbort && shouldAbort()) return;

      const wordSpan = words[i];
      const isHighlight = wordSpan.closest('.headline-highlight');

      if (gsap) {
        if (isHighlight) {
          gsap.fromTo(wordSpan,
            { opacity: 0 },
            { opacity: 1, duration: 0.12, ease: 'power1.out' }
          );
        } else {
          gsap.fromTo(wordSpan,
            { opacity: 0, y: 3 },
            { opacity: 1, y: 0, duration: 0.1, ease: 'power1.out' }
          );
        }
      } else {
        wordSpan.style.opacity = '1';
      }

      if (agent && i % 2 === 0) {
        const rect = wordSpan.getBoundingClientRect();
        const scrollX = window.scrollX || window.pageXOffset || 0;
        const scrollY = window.scrollY || window.pageYOffset || 0;
        agent.setPosition(rect.right + scrollX + 4, rect.top + scrollY + 4);
      }

      await new Promise(r => setTimeout(r, wordDelay));
    }

    if (shouldAbort && shouldAbort()) return;

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
    gsap.set('#hero-headline', { opacity: 1 }); // Container visible so elements have layout, but child chars are opacity: 0
    gsap.set('#hero-description', { opacity: 0 });
    gsap.set('#hero-primary-cta', { opacity: 0, y: 15, scale: 0.95 });
    gsap.set('#hero-showcase-frame', { opacity: 0, y: 30, scale: 0.96 });

    // Prepare Hero headline parts (main & highlight)
    const headlineMain = document.getElementById('headline-main');
    if (headlineMain) this.prepareHeadlineForTyping(headlineMain);
    const headlineHighlight = document.getElementById('headline-highlight');
    if (headlineHighlight) {
      headlineHighlight.classList.remove('has-glow');
      this.prepareHeadlineForTyping(headlineHighlight);
    }
    const headline = document.getElementById('hero-headline');
    if (headline && !headlineMain && !headlineHighlight) this.prepareHeadlineForTyping(headline);

    const desc = document.getElementById('hero-description');
    if (desc) this.prepareTextForTyping(desc);

    // Workflow initial states
    gsap.set('#workflow-title', { opacity: 0 });
    gsap.set('#workflow-subtitle', { opacity: 0 });
    const wfTitle = document.getElementById('workflow-title');
    if (wfTitle) this.prepareTextForTyping(wfTitle);
    const wfSub = document.getElementById('workflow-subtitle');
    if (wfSub) this.prepareTextForTyping(wfSub);

    // 4 Workflow Cards: containers, images, titles, and descriptions all start hidden!
    for (let i = 1; i <= 4; i++) {
      gsap.set(`#card-tec-${i}`, { opacity: 0, scale: 0.96, y: 20 });
      gsap.set(`#card-tec-img-${i}`, { opacity: 0, scale: 0.9 });
      const t = document.getElementById(`card-tec-title-${i}`);
      if (t) this.prepareTextForTyping(t);
      const d = document.getElementById(`card-tec-desc-${i}`);
      if (d) this.prepareTextForTyping(d);
    }

    // Services initial states
    gsap.set('#services-title', { opacity: 0 });
    gsap.set('#services-subtitle', { opacity: 0 });
    const srvTitle = document.getElementById('services-title');
    if (srvTitle) this.prepareTextForTyping(srvTitle);
    const srvSub = document.getElementById('services-subtitle');
    if (srvSub) this.prepareTextForTyping(srvSub);

    // 3 Service Cards: containers, icons, titles, and descriptions all start hidden!
    for (let i = 1; i <= 3; i++) {
      gsap.set(`#service-card-${i}`, { opacity: 0, scale: 0.96, y: 20 });
      gsap.set(`#service-icon-${i}`, { opacity: 0, scale: 0.7 });
      const t = document.getElementById(`service-title-${i}`);
      if (t) this.prepareTextForTyping(t);
      const d = document.getElementById(`service-desc-${i}`);
      if (d) this.prepareTextForTyping(d);
    }

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
    return this.applyHeadlineGlow();
  }

  applyHeadlineGlow() {
    const gsap = window.gsap;
    const highlight = document.getElementById('headline-highlight');
    if (!highlight) return Promise.resolve();

    highlight.classList.add('has-glow');

    if (gsap) {
      return new Promise(resolve => {
        gsap.fromTo(highlight, 
          { filter: 'brightness(1) drop-shadow(0 0 4px rgba(56, 189, 248, 0.3))' },
          { 
            filter: 'brightness(1.55) drop-shadow(0 0 24px rgba(56, 189, 248, 0.85))', 
            duration: 0.5, 
            yoyo: true, 
            repeat: 1, 
            clearProps: 'filter',
            onComplete: resolve
          }
        );
      });
    }
    return Promise.resolve();
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
    gsap.to(card, { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'back.out(1.3)' });
  }

  revealWorkflowCardImage(index) {
    const gsap = window.gsap;
    const img = document.getElementById(`card-tec-img-${index}`);
    if (!gsap || !img) return;
    gsap.to(img, { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' });
  }

  // Section 3: Services reveals
  revealServiceCard(index) {
    const gsap = window.gsap;
    const card = document.getElementById(`service-card-${index}`);
    if (!gsap || !card) return;
    gsap.to(card, { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'back.out(1.3)' });
  }

  revealServiceIcon(index) {
    const gsap = window.gsap;
    const icon = document.getElementById(`service-icon-${index}`);
    if (!gsap || !icon) return;
    gsap.to(icon, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.8)' });
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
      '#site-header', '.brand-logo', '.nav-item', '#header-contact-btn',
      '#hero-symbol', '#hero-headline', '#headline-main', '#headline-highlight',
      '#hero-description', '#hero-actions', '#hero-primary-cta', '#hero-showcase-frame',
      '#workflow-header', '#workflow-title', '#workflow-subtitle', '.card-tec', '.card-tec-img',
      '#services-header', '#services-title', '#services-subtitle', '.service-card', '.service-icon-box',
      '#cta-container', '#cta-title', '#cta-subtitle', '#cta-contact-btn',
      '#site-footer', '#footer-brand', '#footer-symbol', '#footer-social-links'
    ];
    const selectorStr = selectors.join(',');

    if (gsap) {
      gsap.killTweensOf(selectorStr);
      gsap.killTweensOf('.type-word, .type-char');
      gsap.set(selectorStr, { opacity: 1, visibility: 'visible', y: 0, scale: 1, clearProps: 'transform,filter' });
      gsap.set('.type-word, .type-char', { opacity: 1, y: 0, clearProps: 'transform' });
    } else {
      document.querySelectorAll(selectorStr).forEach(el => {
        el.style.opacity = '1';
        el.style.visibility = 'visible';
        el.style.transform = '';
      });
      document.querySelectorAll('.type-word, .type-char').forEach(w => {
        w.style.opacity = '1';
        w.style.transform = '';
      });
    }

    const highlight = document.getElementById('headline-highlight');
    if (highlight) {
      highlight.style.filter = '';
      highlight.classList.add('has-glow');
    }
  }

  /**
   * Fast-completes all visual elements of a specific section
   * Used when user scrolls away to immediately materialize any pending elements
   */
  quickCompleteSection(sectionId) {
    const gsap = window.gsap;
    if (!gsap) return;

    switch (sectionId) {
      case 'hero':
        gsap.to('#site-header', { opacity: 1, y: 0, duration: 0.3 });
        this.revealLogo();
        this.revealNav();
        this.revealHeroSymbol();
        this.revealPrimaryCta();
        this.revealShowcaseFrame();
        document.querySelectorAll('#hero .type-char, #hero .type-word').forEach(el => el.style.opacity = '1');
        gsap.set('#hero-headline, #hero-description, #hero-actions', { opacity: 1, y: 0, scale: 1 });
        this.applyHeadlineGlow();
        break;

      case 'potencialize':
        gsap.set('#workflow-header, #workflow-title, #workflow-subtitle', { opacity: 1, y: 0 });
        document.querySelectorAll('#potencialize .type-word').forEach(el => el.style.opacity = '1');
        for (let i = 1; i <= 4; i++) {
          this.revealWorkflowCard(i);
          this.revealWorkflowCardImage(i);
        }
        break;

      case 'servicos':
        gsap.set('#services-header, #services-title, #services-subtitle', { opacity: 1, y: 0 });
        document.querySelectorAll('#servicos .type-word').forEach(el => el.style.opacity = '1');
        for (let i = 1; i <= 3; i++) {
          this.revealServiceCard(i);
          this.revealServiceIcon(i);
        }
        break;

      case 'contato':
        gsap.set('#cta-container, #cta-title, #cta-subtitle', { opacity: 1, y: 0 });
        document.querySelectorAll('#contato .type-word').forEach(el => el.style.opacity = '1');
        this.revealCtaButton();
        break;

      case 'site-footer':
        gsap.set('#site-footer', { opacity: 1 });
        this.revealFooterBrand();
        this.revealFooterSymbol();
        this.revealFooterSocials();
        break;
    }
  }
}
