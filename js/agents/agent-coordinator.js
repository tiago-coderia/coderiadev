/**
 * Coderia.dev — Scroll-Driven Multi-Agent Swarm Coordinator
 * Orchestrates 7 Core Builder Specialists:
 * Grid, Layout, Texto, Cor, Foto, UI, Motion
 * 
 * Implements:
 * 1. Wireframe FIRST, content materialization/typing AFTER (strict zero pre-appearance)
 * 2. Word-by-word realistic typing effect with live cursor tracking
 * 3. Dynamic Alt+Drag clone animations:
 *    - Workflow: Build Card 1 -> Type text -> Clone to Card 2 -> Type text -> Clone 2 more -> Edit texts
 *    - Services: One card at a time -> Build Card 1 -> Mount icon -> Type text -> Clone to Card 2 -> Mount icon -> Type text -> Clone to Card 3 -> Mount icon -> Type text
 * 4. 100% completion scatter across screen margins (no mouse-following, non-intrusive)
 * 5. Full replay restart with smooth scroll to top and center reassembly
 */

export class AgentCoordinator {
  constructor(engine, hero, heroAnimation, taskEngine) {
    this.engine = engine;
    this.hero = hero;
    this.heroAnimation = heroAnimation;
    this.tasks = taskEngine;
    this.movement = engine.movement;
    this.boxDrawer = engine.boxDrawer;
    // Core brand experience: Swarm choreography runs across all devices/OS settings
    this.isReducedMotion = false;

    this.builtSections = new Set();
    this.activeSection = null;
    this.isBuildingSection = false;
    this.shouldSwitchSection = false;
    this.agentsDeployed = false;
    this.isCompleted = false;
    this.observer = null;

    this.initRestartButton();
  }

  async start() {
    if (this.isReducedMotion) {
      this.skipToFinalState();
      return;
    }

    // 1. Attach strict In-View Scroll Observers immediately so ANY scroll is detected
    this.initScrollObservers();

    // 2. Identify which section is currently in focus (top of page = hero, bottom = footer)
    const currentFocus = this.getSectionInFocus();
    await this.buildSection(currentFocus);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  agent(id) {
    return this.engine.getAgent(id);
  }

  /**
   * Ensures the 7 builder agents emerge smoothly in the current viewport
   */
  ensureAgentsDeployed() {
    if (this.agentsDeployed) return;
    this.agentsDeployed = true;

    const activeAgents = this.engine.getActiveAgents();
    this.tasks.setAgentsCount(activeAgents.length);
    const gsap = window.gsap;

    const scrollY = window.scrollY || window.pageYOffset || 0;
    const centerY = scrollY + window.innerHeight * 0.45;
    const centerX = window.innerWidth * 0.5;

    activeAgents.forEach((ag, idx) => {
      ag.setVisible(true);
      ag.setIdle(false);
      ag.setPosition(centerX, centerY);
      const el = ag.element;
      if (!el || !gsap) return;

      const angle = (idx / activeAgents.length) * Math.PI * 2;
      const dist = 75 + (idx % 3) * 30;
      const targetX = centerX + Math.cos(angle) * dist;
      const targetY = centerY + Math.sin(angle) * dist;

      ag.setAction('DEPLOYING', 'is-selecting');
      gsap.fromTo(el,
        { scale: 0, opacity: 0 },
        { 
          scale: 1, 
          opacity: 1, 
          duration: 0.65, 
          delay: idx * 0.03, 
          ease: 'back.out(2.0)',
          onStart: () => ag.setPosition(targetX, targetY)
        }
      );
    });

    this.enterIdleMouseOrbit();
  }

  /**
   * Dynamically resolves which section is currently in the visitor's focus
   */
  getSectionInFocus() {
    const sectionIds = ['hero', 'potencialize', 'servicos', 'contato', 'site-footer'];
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const viewportHeight = window.innerHeight;
    const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);

    // If near the bottom of the page, site-footer is definitely in view
    if (scrollY + viewportHeight >= docHeight - 80) {
      return 'site-footer';
    }

    // If at the top of the page, hero is in focus
    if (scrollY <= 60) {
      return 'hero';
    }

    const viewportCenter = viewportHeight * 0.5;
    let bestSection = null;
    let maxVisibleHeight = -1;

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (!el) continue;

      const rect = el.getBoundingClientRect();
      if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
        return id;
      }

      const visibleTop = Math.max(0, rect.top);
      const visibleBottom = Math.min(viewportHeight, rect.bottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);

      if (visibleHeight > maxVisibleHeight && visibleHeight > 50) {
        maxVisibleHeight = visibleHeight;
        bestSection = id;
      }
    }

    return bestSection || 'hero';
  }

  /**
   * Builds the specified section, or fast-forwards if the user scrolls to another focus
   */
  async buildSection(sectionId) {
    if (this.builtSections.has(sectionId) || this.isBuildingSection) return;

    this.ensureAgentsDeployed();
    this.isBuildingSection = true;
    this.activeSection = sectionId;
    this.shouldSwitchSection = false;

    try {
      switch (sectionId) {
        case 'hero':
          await this.buildHeroSection();
          break;
        case 'potencialize':
          await this.buildWorkflowSection();
          break;
        case 'servicos':
          await this.buildServicesSection();
          break;
        case 'contato':
          await this.buildCtaSection();
          break;
        case 'site-footer':
          await this.buildFooterSection();
          break;
      }
      this.builtSections.add(sectionId);
    } catch (err) {
      console.warn(`Error building section ${sectionId}:`, err);
      this.quickCompleteSection(sectionId);
    } finally {
      this.isBuildingSection = false;
      this.activeSection = null;
      this.checkAllSectionsComplete();

      // Check if user has scrolled to another unbuilt section while this was building
      const focus = this.getSectionInFocus();
      if (!this.builtSections.has(focus)) {
        this.buildSection(focus);
      }
    }
  }

  quickCompleteSection(sectionId) {
    this.builtSections.add(sectionId);
    this.heroAnimation.quickCompleteSection(sectionId);

    const sectionLabels = {
      'hero': 'HERO',
      'potencialize': 'WORKFLOW',
      'servicos': 'SERVICES',
      'contato': 'CTA',
      'site-footer': 'FOOTER'
    };

    const label = sectionLabels[sectionId] || 'BUILDING';
    this.tasks.completeSectionTasks(label);
  }

  checkAllSectionsComplete() {
    const all = ['hero', 'potencialize', 'servicos', 'contato', 'site-footer'];
    const isAllDone = all.every(id => this.builtSections.has(id));
    if (isAllDone && !this.isCompleted) {
      this.isCompleted = true;
      this.tasks.completeTask('site-ready', 'READY');
      this.finishAndEnableRestart();
    }
  }

  /**
   * SECTION 1: HEADER & HERO CONSTRUCTION
   * First wireframes -> then typography typed word-by-word -> then buttons & frames
   */
  async buildHeroSection() {
    this.engine.updateContainerHeight();

    const boxes = this.hero.getTargetBoxes();
    const gsap = window.gsap;

    this.ensureAgentsDeployed();
    this.tasks.completeTask('hero-init', 'HERO');
    await this.delay(200);

    const grid = this.agent('grid');
    const layout = this.agent('layout');
    const texto = this.agent('texto');
    const cor = this.agent('cor');
    const foto = this.agent('foto');
    const ui = this.agent('ui');

    // 1. Header & Logo (Wireframe first -> then content reveals)
    const promiseHeader = (async () => {
      if (grid) {
        await this.boxDrawer.drawBox({
          agent: grid,
          box: boxes.header(),
          tagName: '<header.site-header>',
          duration: 0.75,
          onMaterialize: () => {
            this.heroAnimation.revealNav();
            this.tasks.completeTask('hero-header', 'HERO');
          }
        });
      } else {
        this.heroAnimation.revealNav();
        this.tasks.completeTask('hero-header', 'HERO');
      }
    })();

    const promiseLogo = (async () => {
      await this.delay(120);
      if (layout) {
        await this.boxDrawer.drawBox({
          agent: layout,
          box: boxes.headerLogo(),
          tagName: '<a.brand-logo>',
          duration: 0.6,
          onMaterialize: () => {
            this.heroAnimation.revealLogo();
            this.tasks.completeTask('hero-logo', 'HERO');
          }
        });
      } else {
        this.heroAnimation.revealLogo();
        this.tasks.completeTask('hero-logo', 'HERO');
      }
    })();

    await Promise.all([promiseHeader, promiseLogo]);
    if (this.shouldSwitchSection) { this.quickCompleteSection('hero'); return; }

    // 2. Hero Symbol (Wireframe first -> then symbol appears)
    if (foto) {
      await this.boxDrawer.drawBox({
        agent: foto,
        box: boxes.heroSymbol(),
        tagName: '<div.hero-symbol>',
        duration: 0.6,
        onMaterialize: () => {
          this.heroAnimation.revealHeroSymbol();
          this.tasks.completeTask('hero-symbol', 'HERO');
        }
      });
    } else {
      this.heroAnimation.revealHeroSymbol();
      this.tasks.completeTask('hero-symbol', 'HERO');
    }
    if (this.shouldSwitchSection) { this.quickCompleteSection('hero'); return; }

    // 3. Headline Part 1: "Construindo Aplicações" (Wireframe first -> then typed letter-by-letter)
    if (grid) {
      await this.boxDrawer.drawBox({
        agent: grid,
        box: boxes.headlineMain ? boxes.headlineMain() : boxes.headline(),
        tagName: '<h1.headline-main>',
        duration: 0.7,
        onMaterialize: () => {
          this.tasks.completeTask('hero-headline', 'HERO');
        }
      });
    } else {
      this.tasks.completeTask('hero-headline', 'HERO');
    }

    // Type "Construindo Aplicações" letter-by-letter with authentic typewriter effect
    const headlineMainEl = document.getElementById('headline-main');
    if (texto && headlineMainEl) {
      this.movement.leaveOrbit(texto);
      await this.heroAnimation.typeHeadlineCharacters(headlineMainEl, texto, { charDelay: 34 });
    } else if (headlineMainEl) {
      headlineMainEl.querySelectorAll('.type-char').forEach(w => w.style.opacity = '1');
    }
    if (this.shouldSwitchSection) { this.quickCompleteSection('hero'); return; }

    // Headline Part 2: Selection box for "Web Inteligentes" BEFORE typing ("antes passado a caixa de seleção")
    if (grid) {
      await this.boxDrawer.drawBox({
        agent: grid,
        box: boxes.headlineHighlight(),
        tagName: '<span.highlight>',
        duration: 0.58
      });
    }

    // Type "Web Inteligentes" letter-by-letter ("e precisa ser digitado", "ele precisa ser escrito por completo")
    const headlineHighlightEl = document.getElementById('headline-highlight');
    if (texto && headlineHighlightEl) {
      await this.heroAnimation.typeHeadlineCharacters(headlineHighlightEl, texto, { charDelay: 36 });
      this.movement.returnToOrbit(texto);
    } else if (headlineHighlightEl) {
      headlineHighlightEl.querySelectorAll('.type-char').forEach(w => w.style.opacity = '1');
    }
    if (this.shouldSwitchSection) { this.quickCompleteSection('hero'); return; }

    // Apply glow effect at the end ("e por fim o efeito de glow")
    if (cor) {
      await this.boxDrawer.drawBox({
        agent: cor,
        box: boxes.headlineHighlight(),
        tagName: '<span.glow>',
        duration: 0.5,
        onMaterialize: () => {
          this.heroAnimation.applyHeadlineGlow();
          this.tasks.completeTask('hero-gradient', 'HERO');
        }
      });
    } else {
      await this.heroAnimation.applyHeadlineGlow();
      this.tasks.completeTask('hero-gradient', 'HERO');
    }
    if (this.shouldSwitchSection) { this.quickCompleteSection('hero'); return; }

    // Description (Wireframe first -> then typed word-by-word!)
    if (texto) {
      await this.boxDrawer.drawBox({
        agent: texto,
        box: boxes.description(),
        tagName: '<p.hero-description>',
        duration: 0.65,
        returnToOrbit: false
      });

      await this.heroAnimation.typeTextWords(document.getElementById('hero-description'), texto, { wordDelay: 38 });
      this.tasks.completeTask('hero-copy', 'HERO');
      this.movement.returnToOrbit(texto);
    } else {
      document.querySelectorAll('#hero-description .type-word').forEach(w => w.style.opacity = '1');
      this.tasks.completeTask('hero-copy', 'HERO');
    }
    if (this.shouldSwitchSection) { this.quickCompleteSection('hero'); return; }

    // 4. Primary CTA & Showcase Frame
    if (ui) {
      await this.boxDrawer.drawBox({
        agent: ui,
        box: boxes.primaryCta(),
        tagName: '<button.projects>',
        duration: 0.6,
        onMaterialize: () => {
          this.heroAnimation.revealPrimaryCta();
          this.tasks.completeTask('hero-cta', 'HERO');
        }
      });
    } else {
      this.heroAnimation.revealPrimaryCta();
      this.tasks.completeTask('hero-cta', 'HERO');
    }

    if (grid) {
      await this.boxDrawer.drawBox({
        agent: grid,
        box: boxes.showcaseFrame(),
        tagName: '<div.n8n-showcase>',
        duration: 0.75,
        onMaterialize: () => {
          this.heroAnimation.revealShowcaseFrame();
          this.tasks.completeTask('hero-showcase', 'HERO');
        }
      });
    } else {
      this.heroAnimation.revealShowcaseFrame();
      this.tasks.completeTask('hero-showcase', 'HERO');
    }
  }

  /**
   * ATTACH STRICT IN-VIEW SCROLL OBSERVERS
   * Replaces static sequential queue with live focus targeting:
   * As soon as any section is observed or scrolled into focus, the swarm immediately builds that section!
   */
  initScrollObservers() {
    if (this.observer) {
      this.observer.disconnect();
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: [0.1, 0.25, 0.5]
    };

    this.observer = new IntersectionObserver((entries) => {
      const focus = this.getSectionInFocus();
      if (!this.builtSections.has(focus)) {
        if (this.isBuildingSection && this.activeSection !== focus) {
          this.shouldSwitchSection = true;
        } else if (!this.isBuildingSection) {
          this.buildSection(focus);
        }
      }
    }, observerOptions);

    ['hero', 'potencialize', 'servicos', 'contato', 'site-footer'].forEach(id => {
      const el = document.getElementById(id);
      if (el) this.observer.observe(el);
    });

    // Throttled scroll listener to guarantee instant response even during rapid scrolling
    let scrollTicking = false;
    this.scrollCheckFn = () => {
      if (!scrollTicking) {
        requestAnimationFrame(() => {
          const focus = this.getSectionInFocus();
          if (!this.builtSections.has(focus)) {
            if (this.isBuildingSection && this.activeSection !== focus) {
              this.shouldSwitchSection = true;
            } else if (!this.isBuildingSection) {
              this.buildSection(focus);
            }
          }
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    };

    window.addEventListener('scroll', this.scrollCheckFn, { passive: true });
  }

  /**
   * SECTION 2: WORKFLOW (#potencialize)
   * 1. Frame header & type title/subtitle word-by-word
   * 2. Build Card 1 from scratch -> type Card 1 texts
   * 3. Alt+Drag clone Card 1 -> Card 2 -> type Card 2 texts
   * 4. Alt+Drag clone 2 more (Card 1 -> Card 3, Card 2 -> Card 4) -> edit/type texts
   */
  async buildWorkflowSection() {
    this.engine.updateContainerHeight();
    const boxes = this.hero.getTargetBoxes();

    const grid = this.agent('grid');
    const texto = this.agent('texto');
    const foto = this.agent('foto');
    const ui = this.agent('ui');
    const cor = this.agent('cor');
    const layout = this.agent('layout');

    // 1. Frame Workflow Section Header
    if (grid) {
      await this.boxDrawer.drawBox({
        agent: grid,
        box: boxes.workflowHeader(),
        tagName: '<section.workflow>',
        duration: 0.65
      });
    }

    // 2. Type Workflow Title and Subtitle word-by-word
    if (texto) {
      this.movement.leaveOrbit(texto);
      await this.heroAnimation.typeTextWords(document.getElementById('workflow-title'), texto, { wordDelay: 45 });
      await this.heroAnimation.typeTextWords(document.getElementById('workflow-subtitle'), texto, { wordDelay: 32 });
      this.tasks.completeTask('wf-header', 'WORKFLOW');
      this.movement.returnToOrbit(texto);
    } else {
      document.querySelectorAll('#workflow-title .type-word, #workflow-subtitle .type-word').forEach(w => w.style.opacity = '1');
      this.tasks.completeTask('wf-header', 'WORKFLOW');
    }
    if (this.shouldSwitchSection) { this.quickCompleteSection('potencialize'); return; }

    // 3. Card 1: Build from scratch
    if (foto) {
      await this.boxDrawer.drawBox({
        agent: foto,
        box: boxes.workflowCard1(),
        tagName: '<card.ai-workflow [Master]>',
        duration: 0.65,
        onMaterialize: () => {
          this.heroAnimation.revealWorkflowCard(1);
          this.heroAnimation.revealWorkflowCardImage(1);
          this.tasks.completeTask('wf-card-1', 'WORKFLOW');
        }
      });
    } else {
      this.heroAnimation.revealWorkflowCard(1);
      this.heroAnimation.revealWorkflowCardImage(1);
      this.tasks.completeTask('wf-card-1', 'WORKFLOW');
    }

    // Type Card 1 title & description word-by-word
    if (texto) {
      this.movement.leaveOrbit(texto);
      await this.heroAnimation.typeTextWords(document.getElementById('card-tec-title-1'), texto, { wordDelay: 38 });
      await this.heroAnimation.typeTextWords(document.getElementById('card-tec-desc-1'), texto, { wordDelay: 26 });
      this.movement.returnToOrbit(texto);
    } else {
      document.querySelectorAll('#card-tec-title-1 .type-word, #card-tec-desc-1 .type-word').forEach(w => w.style.opacity = '1');
    }
    if (this.shouldSwitchSection) { this.quickCompleteSection('potencialize'); return; }

    // 4. Card 2: Clone to the side (Card 1 -> Card 2)
    if (ui) {
      await this.boxDrawer.cloneAndDrag({
        agent: ui,
        fromBox: boxes.workflowCard1(),
        toBox: boxes.workflowCard2(),
        tagName: '<card.crm-n8n [Clone]>',
        duration: 0.65,
        onLand: () => {
          this.heroAnimation.revealWorkflowCard(2);
          this.heroAnimation.revealWorkflowCardImage(2);
          this.tasks.completeTask('wf-card-2', 'WORKFLOW');
        }
      });
    } else {
      this.heroAnimation.revealWorkflowCard(2);
      this.heroAnimation.revealWorkflowCardImage(2);
      this.tasks.completeTask('wf-card-2', 'WORKFLOW');
    }

    // Edit/type Card 2 title & description word-by-word
    if (texto) {
      this.movement.leaveOrbit(texto);
      await this.heroAnimation.typeTextWords(document.getElementById('card-tec-title-2'), texto, { wordDelay: 38 });
      await this.heroAnimation.typeTextWords(document.getElementById('card-tec-desc-2'), texto, { wordDelay: 26 });
      this.movement.returnToOrbit(texto);
    } else {
      document.querySelectorAll('#card-tec-title-2 .type-word, #card-tec-desc-2 .type-word').forEach(w => w.style.opacity = '1');
    }
    if (this.shouldSwitchSection) { this.quickCompleteSection('potencialize'); return; }

    // 5. Clone 2 more downwards (Card 1 -> Card 3, and Card 2 -> Card 4)
    const cloneCard3 = async () => {
      if (cor) {
        await this.boxDrawer.cloneAndDrag({
          agent: cor,
          fromBox: boxes.workflowCard1(),
          toBox: boxes.workflowCard3(),
          tagName: '<card.analytics [Clone]>',
          duration: 0.65,
          onLand: () => {
            this.heroAnimation.revealWorkflowCard(3);
            this.heroAnimation.revealWorkflowCardImage(3);
            this.tasks.completeTask('wf-card-3', 'WORKFLOW');
          }
        });
      } else {
        this.heroAnimation.revealWorkflowCard(3);
        this.heroAnimation.revealWorkflowCardImage(3);
        this.tasks.completeTask('wf-card-3', 'WORKFLOW');
      }
    };

    const cloneCard4 = async () => {
      await this.delay(120);
      if (layout) {
        await this.boxDrawer.cloneAndDrag({
          agent: layout,
          fromBox: boxes.workflowCard2(),
          toBox: boxes.workflowCard4(),
          tagName: '<card.ecommerce [Clone]>',
          duration: 0.65,
          onLand: () => {
            this.heroAnimation.revealWorkflowCard(4);
            this.heroAnimation.revealWorkflowCardImage(4);
            this.tasks.completeTask('wf-card-4', 'WORKFLOW');
          }
        });
      } else {
        this.heroAnimation.revealWorkflowCard(4);
        this.heroAnimation.revealWorkflowCardImage(4);
        this.tasks.completeTask('wf-card-4', 'WORKFLOW');
      }
    };

    await Promise.all([cloneCard3(), cloneCard4()]);

    // Edit/type Card 3 and Card 4 texts word-by-word
    if (texto) {
      this.movement.leaveOrbit(texto);
      await this.heroAnimation.typeTextWords(document.getElementById('card-tec-title-3'), texto, { wordDelay: 36 });
      await this.heroAnimation.typeTextWords(document.getElementById('card-tec-desc-3'), texto, { wordDelay: 25 });
      await this.heroAnimation.typeTextWords(document.getElementById('card-tec-title-4'), texto, { wordDelay: 36 });
      await this.heroAnimation.typeTextWords(document.getElementById('card-tec-desc-4'), texto, { wordDelay: 25 });
      this.movement.returnToOrbit(texto);
    } else {
      document.querySelectorAll('#card-tec-title-3 .type-word, #card-tec-desc-3 .type-word, #card-tec-title-4 .type-word, #card-tec-desc-4 .type-word').forEach(w => w.style.opacity = '1');
    }
  }

  /**
   * SECTION 3: SERVICES (#servicos)
   * 1. Frame header & type title/subtitle word-by-word
   * 2. Build Card 1 from scratch -> mount icon -> type texts
   * 3. Alt+Drag clone Card 1 -> Card 2 -> mount icon -> edit/type texts
   * 4. Alt+Drag clone Card 2 -> Card 3 -> mount icon -> edit/type texts
   */
  async buildServicesSection() {
    this.engine.updateContainerHeight();
    const boxes = this.hero.getTargetBoxes();

    const grid = this.agent('grid');
    const texto = this.agent('texto');
    const layout = this.agent('layout');
    const ui = this.agent('ui');
    const cor = this.agent('cor');

    // 1. Frame Services Header
    if (grid) {
      await this.boxDrawer.drawBox({
        agent: grid,
        box: boxes.servicesHeader(),
        tagName: '<section.services>',
        duration: 0.65
      });
    }

    // 2. Type Services Title and Subtitle word-by-word
    if (texto) {
      this.movement.leaveOrbit(texto);
      await this.heroAnimation.typeTextWords(document.getElementById('services-title'), texto, { wordDelay: 45 });
      await this.heroAnimation.typeTextWords(document.getElementById('services-subtitle'), texto, { wordDelay: 32 });
      this.tasks.completeTask('srv-header', 'SERVICES');
      this.movement.returnToOrbit(texto);
    } else {
      document.querySelectorAll('#services-title .type-word, #services-subtitle .type-word').forEach(w => w.style.opacity = '1');
      this.tasks.completeTask('srv-header', 'SERVICES');
    }
    if (this.shouldSwitchSection) { this.quickCompleteSection('servicos'); return; }

    // 3. Card 1: Build first card from scratch
    if (layout) {
      await this.boxDrawer.drawBox({
        agent: layout,
        box: boxes.serviceCard1(),
        tagName: '<card.ai-ml [Master]>',
        duration: 0.65,
        onMaterialize: () => {
          this.heroAnimation.revealServiceCard(1);
          this.heroAnimation.revealServiceIcon(1);
          this.tasks.completeTask('srv-card-1', 'SERVICES');
        }
      });
    } else {
      this.heroAnimation.revealServiceCard(1);
      this.heroAnimation.revealServiceIcon(1);
      this.tasks.completeTask('srv-card-1', 'SERVICES');
    }

    // Type Card 1 title & description word-by-word
    if (texto) {
      this.movement.leaveOrbit(texto);
      await this.heroAnimation.typeTextWords(document.getElementById('service-title-1'), texto, { wordDelay: 38 });
      await this.heroAnimation.typeTextWords(document.getElementById('service-desc-1'), texto, { wordDelay: 26 });
      this.movement.returnToOrbit(texto);
    } else {
      document.querySelectorAll('#service-title-1 .type-word, #service-desc-1 .type-word').forEach(w => w.style.opacity = '1');
    }
    if (this.shouldSwitchSection) { this.quickCompleteSection('servicos'); return; }

    // 4. Card 2: Clone from Card 1 (Alt+Drag)
    if (ui) {
      await this.boxDrawer.cloneAndDrag({
        agent: ui,
        fromBox: boxes.serviceCard1(),
        toBox: boxes.serviceCard2(),
        tagName: '<card.n8n-auto [Clone]>',
        duration: 0.65,
        onLand: () => {
          this.heroAnimation.revealServiceCard(2);
          this.heroAnimation.revealServiceIcon(2);
          this.tasks.completeTask('srv-card-2', 'SERVICES');
        }
      });
    } else {
      this.heroAnimation.revealServiceCard(2);
      this.heroAnimation.revealServiceIcon(2);
      this.tasks.completeTask('srv-card-2', 'SERVICES');
    }

    // Edit/type Card 2 title & description word-by-word
    if (texto) {
      this.movement.leaveOrbit(texto);
      await this.heroAnimation.typeTextWords(document.getElementById('service-title-2'), texto, { wordDelay: 38 });
      await this.heroAnimation.typeTextWords(document.getElementById('service-desc-2'), texto, { wordDelay: 26 });
      this.movement.returnToOrbit(texto);
    } else {
      document.querySelectorAll('#service-title-2 .type-word, #service-desc-2 .type-word').forEach(w => w.style.opacity = '1');
    }
    if (this.shouldSwitchSection) { this.quickCompleteSection('servicos'); return; }

    // 5. Card 3: Clone from Card 2 (Alt+Drag)
    if (cor) {
      await this.boxDrawer.cloneAndDrag({
        agent: cor,
        fromBox: boxes.serviceCard2(),
        toBox: boxes.serviceCard3(),
        tagName: '<card.fullstack [Clone]>',
        duration: 0.65,
        onLand: () => {
          this.heroAnimation.revealServiceCard(3);
          this.heroAnimation.revealServiceIcon(3);
          this.tasks.completeTask('srv-card-3', 'SERVICES');
        }
      });
    } else {
      this.heroAnimation.revealServiceCard(3);
      this.heroAnimation.revealServiceIcon(3);
      this.tasks.completeTask('srv-card-3', 'SERVICES');
    }

    // Edit/type Card 3 title & description word-by-word
    if (texto) {
      this.movement.leaveOrbit(texto);
      await this.heroAnimation.typeTextWords(document.getElementById('service-title-3'), texto, { wordDelay: 38 });
      await this.heroAnimation.typeTextWords(document.getElementById('service-desc-3'), texto, { wordDelay: 26 });
      this.movement.returnToOrbit(texto);
    } else {
      document.querySelectorAll('#service-title-3 .type-word, #service-desc-3 .type-word').forEach(w => w.style.opacity = '1');
    }
  }

  /**
   * SECTION 4: CALL TO ACTION (#contato)
   * Wireframe container -> wireframe & type title -> wireframe & type subtitle -> wireframe & reveal button
   */
  async buildCtaSection() {
    this.engine.updateContainerHeight();
    const boxes = this.hero.getTargetBoxes();

    const grid = this.agent('grid');
    const texto = this.agent('texto');
    const motion = this.agent('motion');

    // 1. Frame outer CTA container (Content remains 100% hidden!)
    if (grid) {
      await this.boxDrawer.drawBox({
        agent: grid,
        box: boxes.ctaContainer(),
        tagName: '<section.cta>',
        duration: 0.75,
        onMaterialize: () => {
          this.tasks.completeTask('cta-frame', 'CTA');
        }
      });
    } else {
      this.tasks.completeTask('cta-frame', 'CTA');
    }
    if (this.shouldSwitchSection) { this.quickCompleteSection('contato'); return; }

    // 2. Title & Subtitle: Wireframe first, then typed word-by-word!
    if (texto) {
      // Wireframe title
      await this.boxDrawer.drawBox({
        agent: texto,
        box: boxes.ctaTitle(),
        tagName: '<h2.cta-title>',
        duration: 0.55,
        returnToOrbit: false
      });
      await this.heroAnimation.typeTextWords(document.getElementById('cta-title'), texto, { wordDelay: 45 });

      // Wireframe subtitle
      await this.boxDrawer.drawBox({
        agent: texto,
        box: boxes.ctaSubtitle(),
        tagName: '<p.cta-subtitle>',
        duration: 0.6,
        returnToOrbit: false
      });
      await this.heroAnimation.typeTextWords(document.getElementById('cta-subtitle'), texto, { wordDelay: 32 });

      this.tasks.completeTask('cta-copy', 'CTA');
      this.movement.returnToOrbit(texto);
    } else {
      document.querySelectorAll('#cta-title .type-word, #cta-subtitle .type-word').forEach(w => w.style.opacity = '1');
      this.tasks.completeTask('cta-copy', 'CTA');
    }
    if (this.shouldSwitchSection) { this.quickCompleteSection('contato'); return; }

    // 3. Contact Button: Wireframe first, then button materializes!
    if (motion) {
      await this.boxDrawer.drawBox({
        agent: motion,
        box: boxes.ctaContactBtn(),
        tagName: '<button.contact-action>',
        duration: 0.6,
        onMaterialize: () => {
          this.heroAnimation.revealCtaButton();
          this.tasks.completeTask('cta-button', 'CTA');
        }
      });
    } else {
      this.heroAnimation.revealCtaButton();
      this.tasks.completeTask('cta-button', 'CTA');
    }
  }

  /**
   * SECTION 5: FOOTER (#site-footer) & 100% COMPLETION
   * Wireframe container -> wireframe brand -> wireframe symbol & socials
   */
  async buildFooterSection() {
    this.engine.updateContainerHeight();
    const boxes = this.hero.getTargetBoxes();

    const grid = this.agent('grid');
    const layout = this.agent('layout');
    const foto = this.agent('foto');
    const motion = this.agent('motion');

    // 1. Grid frames footer baseline container (Children remain hidden!)
    if (grid) {
      await this.boxDrawer.drawBox({
        agent: grid,
        box: boxes.footer(),
        tagName: '<footer.site-footer>',
        duration: 0.65,
        onMaterialize: () => {
          this.tasks.completeTask('ft-frame', 'FOOTER');
        }
      });
    } else {
      this.tasks.completeTask('ft-frame', 'FOOTER');
    }
    if (this.shouldSwitchSection) { this.quickCompleteSection('site-footer'); return; }

    // 2. Layout frames footer brand logo
    if (layout) {
      await this.boxDrawer.drawBox({
        agent: layout,
        box: boxes.footerBrand(),
        tagName: '<footer.brand>',
        duration: 0.55,
        onMaterialize: () => {
          this.heroAnimation.revealFooterBrand();
          this.tasks.completeTask('ft-brand', 'FOOTER');
        }
      });
    } else {
      this.heroAnimation.revealFooterBrand();
      this.tasks.completeTask('ft-brand', 'FOOTER');
    }
    if (this.shouldSwitchSection) { this.quickCompleteSection('site-footer'); return; }

    // 3. Foto frames footer symbol & Motion frames social links
    const promiseSymbol = (async () => {
      if (foto) {
        await this.boxDrawer.drawBox({
          agent: foto,
          box: boxes.footerSymbol(),
          tagName: '<footer.symbol>',
          duration: 0.5,
          onMaterialize: () => {
            this.heroAnimation.revealFooterSymbol();
          }
        });
      } else {
        this.heroAnimation.revealFooterSymbol();
      }
    })();

    const promiseSocials = (async () => {
      await this.delay(100);
      if (motion) {
        await this.boxDrawer.drawBox({
          agent: motion,
          box: boxes.footerSocial(),
          tagName: '<footer.socials>',
          duration: 0.55,
          onMaterialize: () => {
            this.heroAnimation.revealFooterSocials();
          }
        });
      } else {
        this.heroAnimation.revealFooterSocials();
      }
    })();

    await Promise.all([promiseSymbol, promiseSocials]);
  }

  /**
   * Enter Idle Mode: Cursors hide labels and form an inward-pointing orbital ring
   * that follows the visitor's mouse pointer
   */
  enterIdleMouseOrbit() {
    const agents = this.engine.getActiveAgents();
    this.movement.startMouseOrbit(agents, 44);
  }

  /**
   * Exit Idle Mode: Cursors leave the mouse ring
   */
  exitIdleMouseOrbit() {
    const agents = this.engine.getActiveAgents();
    this.movement.stopMouseOrbit(agents);
  }

  /**
   * On 100% completion:
   * Smoothly scrolls back to the first section (#hero), scatters cursors
   * across the first section around "Construindo Aplicações...", hides HUD,
   * and reveals the restart replay button
   */
  async finishAndEnableRestart() {
    // 1. Hide HUD build bar
    const hud = document.getElementById('construction-hud');
    if (hud) hud.classList.add('is-hidden');

    // 2. Smoothly scroll back to the first section where "Construindo Aplicações" is
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 3. Scatter cursors across the first section around the headline
    this.scatterInFirstSection();

    // 4. Reveal restart replay button
    const restartBtn = document.getElementById('restart-experience-btn');
    if (restartBtn) restartBtn.classList.add('is-visible');
  }

  /**
   * Scatters the 7 cursors in aesthetic non-intrusive positions across the FIRST section (#hero)
   * around "Construindo Aplicações Web Inteligentes", the brand symbol, CTA, and showcase
   */
  scatterInFirstSection() {
    this.movement.stopMouseOrbit();

    const agents = this.engine.getActiveAgents();
    const w = window.innerWidth;
    const heroEl = document.getElementById('hero');
    const heroTop = heroEl ? heroEl.offsetTop : 0;
    const gsap = window.gsap;

    // 7 Non-intrusive positions distributed across the first section (#hero):
    // Positioned around "Construindo Aplicações...", the brand symbol, and showcase margins
    const heroPositions = [
      { x: w * 0.12, y: heroTop + 140, rot: -15 }, // GRID: upper-left of hero
      { x: w * 0.88, y: heroTop + 160, rot: 15 },  // LAYOUT: upper-right of hero
      { x: w * 0.08, y: heroTop + 330, rot: -8 },  // TEXTO: left of "Construindo Aplicações"
      { x: w * 0.90, y: heroTop + 400, rot: 18 },  // COR: right of "Web Inteligentes"
      { x: w * 0.12, y: heroTop + 540, rot: -16 }, // FOTO: left gutter near CTA
      { x: w * 0.86, y: heroTop + 560, rot: 12 },  // UI: right of CTA button
      { x: w * 0.20, y: heroTop + 720, rot: -10 }  // MOTION: lower gutter next to showcase
    ];

    agents.forEach((agent, i) => {
      const pos = heroPositions[i % heroPositions.length];
      agent.setVisible(true);
      agent.setIdle(false);
      agent.setAction('STANDBY', '');

      if (gsap) {
        gsap.to(agent, {
          x: pos.x,
          y: pos.y,
          duration: 1.5 + i * 0.08,
          ease: 'power3.out',
          onUpdate: () => agent.setPosition(agent.x, agent.y)
        });
        if (agent.svgPointer) {
          gsap.to(agent.svgPointer, {
            rotation: pos.rot,
            duration: 0.9,
            ease: 'power2.out'
          });
        }
      } else {
        agent.setPosition(pos.x, pos.y);
      }
    });
  }

  /**
   * Initializes Restart Button Click: resets state, scrolls smoothly to top,
   * regroups cursors at the center, and restarts Swarm
   */
  initRestartButton() {
    const restartBtn = document.getElementById('restart-experience-btn');
    if (!restartBtn) return;

    restartBtn.addEventListener('click', async () => {
      // 1. Hide restart button
      restartBtn.classList.remove('is-visible');

      // 2. Smoothly scroll to the very top
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // 3. Wait for scroll to reach top
      await this.delay(650);

      // 4. Reset section states and tasks
      this.builtSections.clear();
      this.isBuildingSection = false;
      this.shouldSwitchSection = false;
      this.isCompleted = false;
      this.agentsDeployed = false;

      this.heroAnimation.initElementStates();
      this.tasks.reset();

      // 5. Restore HUD
      const hud = document.getElementById('construction-hud');
      if (hud) {
        hud.classList.remove('is-hidden', 'is-completed');
      }

      // 6. Regroup cursors at hero center before restarting
      const activeAgents = this.engine.getActiveAgents();
      const centerX = window.innerWidth * 0.5;
      const centerY = window.innerHeight * 0.45;
      const gsap = window.gsap;

      activeAgents.forEach((ag, idx) => {
        const angle = (idx / activeAgents.length) * Math.PI * 2;
        const targetX = centerX + Math.cos(angle) * 60;
        const targetY = centerY + Math.sin(angle) * 60;
        if (gsap) {
          gsap.to(ag, {
            x: targetX,
            y: targetY,
            duration: 0.6,
            ease: 'power2.out',
            onUpdate: () => ag.setPosition(ag.x, ag.y)
          });
        } else {
          ag.setPosition(targetX, targetY);
        }
      });

      await this.delay(600);

      // 7. Restart Swarm construction from beginning
      await this.start();
    });
  }

  skipToFinalState() {
    this.heroAnimation.showFinalStateImmediate();
    this.tasks.tasks.forEach(t => t.completed = true);
    this.tasks.updateHUD(100, 'READY');
    this.scatterInFirstSection();
  }
}
