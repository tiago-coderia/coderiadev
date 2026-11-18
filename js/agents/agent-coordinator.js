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
 * 5. Skip animation option in the HUD bar (hides all agents and immediately reveals full site)
 * 6. Full replay restart with smooth scroll to top and center reassembly
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
    this.isSkipped = false;
    this.runId = 0;
    this.observer = null;
    this.scrollCheckFn = null;

    this.initRestartButton();
    this.initSkipButton();
  }

  isAborted(runId) {
    return this.isSkipped || runId !== this.runId;
  }

  async start() {
    if (this.isReducedMotion) {
      this.skipAnimation();
      return;
    }

    const currentRunId = this.runId;
    this.isSkipped = false;
    this.engine.setLayerHidden(false);

    // 1. Attach strict In-View Scroll Observers immediately so ANY scroll is detected
    this.initScrollObservers();

    // 2. Identify which section is currently in focus (top of page = hero, bottom = footer)
    const currentFocus = this.getSectionInFocus();
    await this.buildSection(currentFocus, currentRunId);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  agent(id) {
    return this.engine.getAgent(id);
  }

  /**
   * Ensures the 7 builder agents emerge smoothly in the current viewport
   * without GSAP transform/opacity conflicts on the cursor container
   */
  ensureAgentsDeployed() {
    if (this.agentsDeployed || this.isSkipped) return;
    this.agentsDeployed = true;

    this.engine.setLayerHidden(false);
    this.engine.updateContainerHeight();

    const activeAgents = this.engine.getActiveAgents();
    this.tasks.setAgentsCount(activeAgents.length);

    const scrollY = window.scrollY || window.pageYOffset || 0;
    const viewportW = document.documentElement.clientWidth || window.innerWidth;
    const centerY = scrollY + window.innerHeight * 0.42;
    const centerX = viewportW * 0.5;
    const spreadScale = viewportW <= 768 ? 0.55 : 1;

    activeAgents.forEach((ag, idx) => {
      if (window.gsap) {
        window.gsap.killTweensOf(ag);
        if (ag.element) window.gsap.killTweensOf(ag.element);
      }

      const angle = (idx / activeAgents.length) * Math.PI * 2;
      const dist = (75 + (idx % 3) * 30) * spreadScale;
      const targetX = centerX + Math.cos(angle) * dist;
      const targetY = centerY + Math.sin(angle) * dist;

      ag.setPosition(targetX, targetY);
      ag.setIdle(false);
      ag.setAction('DEPLOYING', 'is-selecting');
      ag.setVisible(true);
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
  async buildSection(sectionId, runId = this.runId) {
    if (this.isAborted(runId) || this.builtSections.has(sectionId) || this.isBuildingSection) return;

    this.ensureAgentsDeployed();
    this.isBuildingSection = true;
    this.activeSection = sectionId;
    this.shouldSwitchSection = false;

    try {
      switch (sectionId) {
        case 'hero':
          await this.buildHeroSection(runId);
          break;
        case 'potencialize':
          await this.buildWorkflowSection(runId);
          break;
        case 'servicos':
          await this.buildServicesSection(runId);
          break;
        case 'contato':
          await this.buildCtaSection(runId);
          break;
        case 'site-footer':
          await this.buildFooterSection(runId);
          break;
      }
      if (!this.isAborted(runId)) {
        this.builtSections.add(sectionId);
      }
    } catch (err) {
      console.warn(`Error building section ${sectionId}:`, err);
      if (!this.isAborted(runId)) {
        this.quickCompleteSection(sectionId);
      }
    } finally {
      if (this.isAborted(runId)) {
        this.isBuildingSection = false;
        this.activeSection = null;
        return;
      }

      this.isBuildingSection = false;
      this.activeSection = null;
      this.checkAllSectionsComplete();

      // Check if user has scrolled to another unbuilt section while this was building
      if (!this.isCompleted) {
        const focus = this.getSectionInFocus();
        if (!this.builtSections.has(focus)) {
          this.buildSection(focus, runId);
        }
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
    if (this.isSkipped) return;
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
  async buildHeroSection(runId) {
    const shouldAbort = () => this.isAborted(runId);
    if (shouldAbort()) return;

    this.engine.updateContainerHeight();
    const boxes = this.hero.getTargetBoxes();

    this.ensureAgentsDeployed();
    this.tasks.completeTask('hero-init', 'HERO');
    await this.delay(200);
    if (shouldAbort()) return;

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
          shouldAbort,
          onMaterialize: () => {
            if (shouldAbort()) return;
            this.heroAnimation.revealNav();
            this.tasks.completeTask('hero-header', 'HERO');
          }
        });
      } else if (!shouldAbort()) {
        this.heroAnimation.revealNav();
        this.tasks.completeTask('hero-header', 'HERO');
      }
    })();

    const promiseLogo = (async () => {
      await this.delay(120);
      if (shouldAbort()) return;
      if (layout) {
        await this.boxDrawer.drawBox({
          agent: layout,
          box: boxes.headerLogo(),
          tagName: '<a.brand-logo>',
          duration: 0.6,
          shouldAbort,
          onMaterialize: () => {
            if (shouldAbort()) return;
            this.heroAnimation.revealLogo();
            this.tasks.completeTask('hero-logo', 'HERO');
          }
        });
      } else if (!shouldAbort()) {
        this.heroAnimation.revealLogo();
        this.tasks.completeTask('hero-logo', 'HERO');
      }
    })();

    await Promise.all([promiseHeader, promiseLogo]);
    if (shouldAbort()) return;
    if (this.shouldSwitchSection) { this.quickCompleteSection('hero'); return; }

    // 2. Hero Symbol (Wireframe first -> then symbol appears)
    if (foto) {
      await this.boxDrawer.drawBox({
        agent: foto,
        box: boxes.heroSymbol(),
        tagName: '<div.hero-symbol>',
        duration: 0.6,
        shouldAbort,
        onMaterialize: () => {
          if (shouldAbort()) return;
          this.heroAnimation.revealHeroSymbol();
          this.tasks.completeTask('hero-symbol', 'HERO');
        }
      });
    } else {
      this.heroAnimation.revealHeroSymbol();
      this.tasks.completeTask('hero-symbol', 'HERO');
    }
    if (shouldAbort()) return;
    if (this.shouldSwitchSection) { this.quickCompleteSection('hero'); return; }

    // 3. Headline Part 1: "Construindo Aplicações" (Wireframe first -> then typed letter-by-letter)
    if (grid) {
      await this.boxDrawer.drawBox({
        agent: grid,
        box: boxes.headlineMain ? boxes.headlineMain() : boxes.headline(),
        tagName: '<h1.headline-main>',
        duration: 0.7,
        shouldAbort,
        onMaterialize: () => {
          if (shouldAbort()) return;
          this.tasks.completeTask('hero-headline', 'HERO');
        }
      });
    } else {
      this.tasks.completeTask('hero-headline', 'HERO');
    }
    if (shouldAbort()) return;

    // Type "Construindo Aplicações" letter-by-letter with authentic typewriter effect
    const headlineMainEl = document.getElementById('headline-main');
    if (texto && headlineMainEl) {
      this.movement.leaveOrbit(texto);
      await this.heroAnimation.typeHeadlineCharacters(headlineMainEl, texto, { charDelay: 34, shouldAbort });
    } else if (headlineMainEl) {
      headlineMainEl.querySelectorAll('.type-char').forEach(w => w.style.opacity = '1');
    }
    if (shouldAbort()) return;
    if (this.shouldSwitchSection) { this.quickCompleteSection('hero'); return; }

    // Headline Part 2: Selection box for "Web Inteligentes" BEFORE typing
    if (grid) {
      await this.boxDrawer.drawBox({
        agent: grid,
        box: boxes.headlineHighlight(),
        tagName: '<span.highlight>',
        duration: 0.58,
        shouldAbort
      });
    }
    if (shouldAbort()) return;

    // Type "Web Inteligentes" letter-by-letter
    const headlineHighlightEl = document.getElementById('headline-highlight');
    if (texto && headlineHighlightEl) {
      await this.heroAnimation.typeHeadlineCharacters(headlineHighlightEl, texto, { charDelay: 36, shouldAbort });
      if (!shouldAbort()) this.movement.returnToOrbit(texto);
    } else if (headlineHighlightEl) {
      headlineHighlightEl.querySelectorAll('.type-char').forEach(w => w.style.opacity = '1');
    }
    if (shouldAbort()) return;
    if (this.shouldSwitchSection) { this.quickCompleteSection('hero'); return; }

    // Apply glow effect at the end
    if (cor) {
      await this.boxDrawer.drawBox({
        agent: cor,
        box: boxes.headlineHighlight(),
        tagName: '<span.glow>',
        duration: 0.5,
        shouldAbort,
        onMaterialize: () => {
          if (shouldAbort()) return;
          this.heroAnimation.applyHeadlineGlow();
          this.tasks.completeTask('hero-gradient', 'HERO');
        }
      });
    } else {
      await this.heroAnimation.applyHeadlineGlow();
      this.tasks.completeTask('hero-gradient', 'HERO');
    }
    if (shouldAbort()) return;
    if (this.shouldSwitchSection) { this.quickCompleteSection('hero'); return; }

    // Description (Wireframe first -> then typed word-by-word!)
    if (texto) {
      await this.boxDrawer.drawBox({
        agent: texto,
        box: boxes.description(),
        tagName: '<p.hero-description>',
        duration: 0.65,
        returnToOrbit: false,
        shouldAbort
      });
      if (shouldAbort()) return;

      await this.heroAnimation.typeTextWords(document.getElementById('hero-description'), texto, { wordDelay: 38, shouldAbort });
      if (shouldAbort()) return;
      this.tasks.completeTask('hero-copy', 'HERO');
      this.movement.returnToOrbit(texto);
    } else {
      document.querySelectorAll('#hero-description .type-word').forEach(w => w.style.opacity = '1');
      this.tasks.completeTask('hero-copy', 'HERO');
    }
    if (shouldAbort()) return;
    if (this.shouldSwitchSection) { this.quickCompleteSection('hero'); return; }

    // 4. Primary CTA & Showcase Frame
    if (ui) {
      await this.boxDrawer.drawBox({
        agent: ui,
        box: boxes.primaryCta(),
        tagName: '<button.projects>',
        duration: 0.6,
        shouldAbort,
        onMaterialize: () => {
          if (shouldAbort()) return;
          this.heroAnimation.revealPrimaryCta();
          this.tasks.completeTask('hero-cta', 'HERO');
        }
      });
    } else {
      this.heroAnimation.revealPrimaryCta();
      this.tasks.completeTask('hero-cta', 'HERO');
    }
    if (shouldAbort()) return;

    if (grid) {
      await this.boxDrawer.drawBox({
        agent: grid,
        box: boxes.showcaseFrame(),
        tagName: '<div.n8n-showcase>',
        duration: 0.75,
        shouldAbort,
        onMaterialize: () => {
          if (shouldAbort()) return;
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
   * Disconnects scroll observers & scroll listener cleanly
   */
  disconnectScrollObservers() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    if (this.scrollCheckFn) {
      window.removeEventListener('scroll', this.scrollCheckFn);
      this.scrollCheckFn = null;
    }
  }

  /**
   * ATTACH STRICT IN-VIEW SCROLL OBSERVERS
   * Replaces static sequential queue with live focus targeting:
   * As soon as any section is observed or scrolled into focus, the swarm immediately builds that section!
   */
  initScrollObservers() {
    this.disconnectScrollObservers();

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: [0.1, 0.25, 0.5]
    };

    const runId = this.runId;

    this.observer = new IntersectionObserver(() => {
      if (this.isAborted(runId) || this.isCompleted) return;
      const focus = this.getSectionInFocus();
      if (!this.builtSections.has(focus)) {
        if (this.isBuildingSection && this.activeSection !== focus) {
          this.shouldSwitchSection = true;
        } else if (!this.isBuildingSection) {
          this.buildSection(focus, runId);
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
      if (this.isAborted(runId) || this.isCompleted) return;
      if (!scrollTicking) {
        requestAnimationFrame(() => {
          if (!this.isAborted(runId) && !this.isCompleted) {
            const focus = this.getSectionInFocus();
            if (!this.builtSections.has(focus)) {
              if (this.isBuildingSection && this.activeSection !== focus) {
                this.shouldSwitchSection = true;
              } else if (!this.isBuildingSection) {
                this.buildSection(focus, runId);
              }
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
   */
  async buildWorkflowSection(runId) {
    const shouldAbort = () => this.isAborted(runId);
    if (shouldAbort()) return;

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
        duration: 0.65,
        shouldAbort
      });
    }
    if (shouldAbort()) return;

    // 2. Type Workflow Title and Subtitle word-by-word
    if (texto) {
      this.movement.leaveOrbit(texto);
      await this.heroAnimation.typeTextWords(document.getElementById('workflow-title'), texto, { wordDelay: 45, shouldAbort });
      if (shouldAbort()) return;
      await this.heroAnimation.typeTextWords(document.getElementById('workflow-subtitle'), texto, { wordDelay: 32, shouldAbort });
      if (shouldAbort()) return;
      this.tasks.completeTask('wf-header', 'WORKFLOW');
      this.movement.returnToOrbit(texto);
    } else {
      document.querySelectorAll('#workflow-title .type-word, #workflow-subtitle .type-word').forEach(w => w.style.opacity = '1');
      this.tasks.completeTask('wf-header', 'WORKFLOW');
    }
    if (shouldAbort()) return;
    if (this.shouldSwitchSection) { this.quickCompleteSection('potencialize'); return; }

    // 3. Card 1: Build from scratch
    if (foto) {
      await this.boxDrawer.drawBox({
        agent: foto,
        box: boxes.workflowCard1(),
        tagName: '<card.ai-workflow [Master]>',
        duration: 0.65,
        shouldAbort,
        onMaterialize: () => {
          if (shouldAbort()) return;
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
    if (shouldAbort()) return;

    // Type Card 1 title & description word-by-word
    if (texto) {
      this.movement.leaveOrbit(texto);
      await this.heroAnimation.typeTextWords(document.getElementById('card-tec-title-1'), texto, { wordDelay: 38, shouldAbort });
      if (shouldAbort()) return;
      await this.heroAnimation.typeTextWords(document.getElementById('card-tec-desc-1'), texto, { wordDelay: 26, shouldAbort });
      if (shouldAbort()) return;
      this.movement.returnToOrbit(texto);
    } else {
      document.querySelectorAll('#card-tec-title-1 .type-word, #card-tec-desc-1 .type-word').forEach(w => w.style.opacity = '1');
    }
    if (shouldAbort()) return;
    if (this.shouldSwitchSection) { this.quickCompleteSection('potencialize'); return; }

    // 4. Card 2: Clone to the side (Card 1 -> Card 2)
    if (ui) {
      await this.boxDrawer.cloneAndDrag({
        agent: ui,
        fromBox: boxes.workflowCard1(),
        toBox: boxes.workflowCard2(),
        tagName: '<card.crm-n8n [Clone]>',
        duration: 0.65,
        shouldAbort,
        onLand: () => {
          if (shouldAbort()) return;
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
    if (shouldAbort()) return;

    // Edit/type Card 2 title & description word-by-word
    if (texto) {
      this.movement.leaveOrbit(texto);
      await this.heroAnimation.typeTextWords(document.getElementById('card-tec-title-2'), texto, { wordDelay: 38, shouldAbort });
      if (shouldAbort()) return;
      await this.heroAnimation.typeTextWords(document.getElementById('card-tec-desc-2'), texto, { wordDelay: 26, shouldAbort });
      if (shouldAbort()) return;
      this.movement.returnToOrbit(texto);
    } else {
      document.querySelectorAll('#card-tec-title-2 .type-word, #card-tec-desc-2 .type-word').forEach(w => w.style.opacity = '1');
    }
    if (shouldAbort()) return;
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
          shouldAbort,
          onLand: () => {
            if (shouldAbort()) return;
            this.heroAnimation.revealWorkflowCard(3);
            this.heroAnimation.revealWorkflowCardImage(3);
            this.tasks.completeTask('wf-card-3', 'WORKFLOW');
          }
        });
      } else if (!shouldAbort()) {
        this.heroAnimation.revealWorkflowCard(3);
        this.heroAnimation.revealWorkflowCardImage(3);
        this.tasks.completeTask('wf-card-3', 'WORKFLOW');
      }
    };

    const cloneCard4 = async () => {
      await this.delay(120);
      if (shouldAbort()) return;
      if (layout) {
        await this.boxDrawer.cloneAndDrag({
          agent: layout,
          fromBox: boxes.workflowCard2(),
          toBox: boxes.workflowCard4(),
          tagName: '<card.ecommerce [Clone]>',
          duration: 0.65,
          shouldAbort,
          onLand: () => {
            if (shouldAbort()) return;
            this.heroAnimation.revealWorkflowCard(4);
            this.heroAnimation.revealWorkflowCardImage(4);
            this.tasks.completeTask('wf-card-4', 'WORKFLOW');
          }
        });
      } else if (!shouldAbort()) {
        this.heroAnimation.revealWorkflowCard(4);
        this.heroAnimation.revealWorkflowCardImage(4);
        this.tasks.completeTask('wf-card-4', 'WORKFLOW');
      }
    };

    await Promise.all([cloneCard3(), cloneCard4()]);
    if (shouldAbort()) return;
    if (this.shouldSwitchSection) { this.quickCompleteSection('potencialize'); return; }

    // Edit/type Card 3 and Card 4 texts word-by-word
    if (texto) {
      this.movement.leaveOrbit(texto);
      await this.heroAnimation.typeTextWords(document.getElementById('card-tec-title-3'), texto, { wordDelay: 36, shouldAbort });
      if (shouldAbort()) return;
      await this.heroAnimation.typeTextWords(document.getElementById('card-tec-desc-3'), texto, { wordDelay: 25, shouldAbort });
      if (shouldAbort()) return;
      await this.heroAnimation.typeTextWords(document.getElementById('card-tec-title-4'), texto, { wordDelay: 36, shouldAbort });
      if (shouldAbort()) return;
      await this.heroAnimation.typeTextWords(document.getElementById('card-tec-desc-4'), texto, { wordDelay: 25, shouldAbort });
      if (shouldAbort()) return;
      this.movement.returnToOrbit(texto);
    } else {
      document.querySelectorAll('#card-tec-title-3 .type-word, #card-tec-desc-3 .type-word, #card-tec-title-4 .type-word, #card-tec-desc-4 .type-word').forEach(w => w.style.opacity = '1');
    }
  }

  /**
   * SECTION 3: SERVICES (#servicos)
   */
  async buildServicesSection(runId) {
    const shouldAbort = () => this.isAborted(runId);
    if (shouldAbort()) return;

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
        duration: 0.65,
        shouldAbort
      });
    }
    if (shouldAbort()) return;

    // 2. Type Services Title and Subtitle word-by-word
    if (texto) {
      this.movement.leaveOrbit(texto);
      await this.heroAnimation.typeTextWords(document.getElementById('services-title'), texto, { wordDelay: 45, shouldAbort });
      if (shouldAbort()) return;
      await this.heroAnimation.typeTextWords(document.getElementById('services-subtitle'), texto, { wordDelay: 32, shouldAbort });
      if (shouldAbort()) return;
      this.tasks.completeTask('srv-header', 'SERVICES');
      this.movement.returnToOrbit(texto);
    } else {
      document.querySelectorAll('#services-title .type-word, #services-subtitle .type-word').forEach(w => w.style.opacity = '1');
      this.tasks.completeTask('srv-header', 'SERVICES');
    }
    if (shouldAbort()) return;
    if (this.shouldSwitchSection) { this.quickCompleteSection('servicos'); return; }

    // 3. Card 1: Build first card from scratch
    if (layout) {
      await this.boxDrawer.drawBox({
        agent: layout,
        box: boxes.serviceCard1(),
        tagName: '<card.ai-ml [Master]>',
        duration: 0.65,
        shouldAbort,
        onMaterialize: () => {
          if (shouldAbort()) return;
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
    if (shouldAbort()) return;

    // Type Card 1 title & description word-by-word
    if (texto) {
      this.movement.leaveOrbit(texto);
      await this.heroAnimation.typeTextWords(document.getElementById('service-title-1'), texto, { wordDelay: 38, shouldAbort });
      if (shouldAbort()) return;
      await this.heroAnimation.typeTextWords(document.getElementById('service-desc-1'), texto, { wordDelay: 26, shouldAbort });
      if (shouldAbort()) return;
      this.movement.returnToOrbit(texto);
    } else {
      document.querySelectorAll('#service-title-1 .type-word, #service-desc-1 .type-word').forEach(w => w.style.opacity = '1');
    }
    if (shouldAbort()) return;
    if (this.shouldSwitchSection) { this.quickCompleteSection('servicos'); return; }

    // 4. Card 2: Clone from Card 1 (Alt+Drag)
    if (ui) {
      await this.boxDrawer.cloneAndDrag({
        agent: ui,
        fromBox: boxes.serviceCard1(),
        toBox: boxes.serviceCard2(),
        tagName: '<card.n8n-auto [Clone]>',
        duration: 0.65,
        shouldAbort,
        onLand: () => {
          if (shouldAbort()) return;
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
    if (shouldAbort()) return;

    // Edit/type Card 2 title & description word-by-word
    if (texto) {
      this.movement.leaveOrbit(texto);
      await this.heroAnimation.typeTextWords(document.getElementById('service-title-2'), texto, { wordDelay: 38, shouldAbort });
      if (shouldAbort()) return;
      await this.heroAnimation.typeTextWords(document.getElementById('service-desc-2'), texto, { wordDelay: 26, shouldAbort });
      if (shouldAbort()) return;
      this.movement.returnToOrbit(texto);
    } else {
      document.querySelectorAll('#service-title-2 .type-word, #service-desc-2 .type-word').forEach(w => w.style.opacity = '1');
    }
    if (shouldAbort()) return;
    if (this.shouldSwitchSection) { this.quickCompleteSection('servicos'); return; }

    // 5. Card 3: Clone from Card 2 (Alt+Drag)
    if (cor) {
      await this.boxDrawer.cloneAndDrag({
        agent: cor,
        fromBox: boxes.serviceCard2(),
        toBox: boxes.serviceCard3(),
        tagName: '<card.fullstack [Clone]>',
        duration: 0.65,
        shouldAbort,
        onLand: () => {
          if (shouldAbort()) return;
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
    if (shouldAbort()) return;

    // Edit/type Card 3 title & description word-by-word
    if (texto) {
      this.movement.leaveOrbit(texto);
      await this.heroAnimation.typeTextWords(document.getElementById('service-title-3'), texto, { wordDelay: 38, shouldAbort });
      if (shouldAbort()) return;
      await this.heroAnimation.typeTextWords(document.getElementById('service-desc-3'), texto, { wordDelay: 26, shouldAbort });
      if (shouldAbort()) return;
      this.movement.returnToOrbit(texto);
    } else {
      document.querySelectorAll('#service-title-3 .type-word, #service-desc-3 .type-word').forEach(w => w.style.opacity = '1');
    }
  }

  /**
   * SECTION 4: CALL TO ACTION (#contato)
   */
  async buildCtaSection(runId) {
    const shouldAbort = () => this.isAborted(runId);
    if (shouldAbort()) return;

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
        shouldAbort,
        onMaterialize: () => {
          if (shouldAbort()) return;
          this.tasks.completeTask('cta-frame', 'CTA');
        }
      });
    } else {
      this.tasks.completeTask('cta-frame', 'CTA');
    }
    if (shouldAbort()) return;
    if (this.shouldSwitchSection) { this.quickCompleteSection('contato'); return; }

    // 2. Title & Subtitle: Wireframe first, then typed word-by-word!
    if (texto) {
      // Wireframe title
      await this.boxDrawer.drawBox({
        agent: texto,
        box: boxes.ctaTitle(),
        tagName: '<h2.cta-title>',
        duration: 0.55,
        returnToOrbit: false,
        shouldAbort
      });
      if (shouldAbort()) return;
      await this.heroAnimation.typeTextWords(document.getElementById('cta-title'), texto, { wordDelay: 45, shouldAbort });
      if (shouldAbort()) return;

      // Wireframe subtitle
      await this.boxDrawer.drawBox({
        agent: texto,
        box: boxes.ctaSubtitle(),
        tagName: '<p.cta-subtitle>',
        duration: 0.6,
        returnToOrbit: false,
        shouldAbort
      });
      if (shouldAbort()) return;
      await this.heroAnimation.typeTextWords(document.getElementById('cta-subtitle'), texto, { wordDelay: 32, shouldAbort });
      if (shouldAbort()) return;

      this.tasks.completeTask('cta-copy', 'CTA');
      this.movement.returnToOrbit(texto);
    } else {
      document.querySelectorAll('#cta-title .type-word, #cta-subtitle .type-word').forEach(w => w.style.opacity = '1');
      this.tasks.completeTask('cta-copy', 'CTA');
    }
    if (shouldAbort()) return;
    if (this.shouldSwitchSection) { this.quickCompleteSection('contato'); return; }

    // 3. Contact Button: Wireframe first, then button materializes!
    if (motion) {
      await this.boxDrawer.drawBox({
        agent: motion,
        box: boxes.ctaContactBtn(),
        tagName: '<button.contact-action>',
        duration: 0.6,
        shouldAbort,
        onMaterialize: () => {
          if (shouldAbort()) return;
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
   */
  async buildFooterSection(runId) {
    const shouldAbort = () => this.isAborted(runId);
    if (shouldAbort()) return;

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
        shouldAbort,
        onMaterialize: () => {
          if (shouldAbort()) return;
          this.tasks.completeTask('ft-frame', 'FOOTER');
        }
      });
    } else {
      this.tasks.completeTask('ft-frame', 'FOOTER');
    }
    if (shouldAbort()) return;
    if (this.shouldSwitchSection) { this.quickCompleteSection('site-footer'); return; }

    // 2. Layout frames footer brand logo
    if (layout) {
      await this.boxDrawer.drawBox({
        agent: layout,
        box: boxes.footerBrand(),
        tagName: '<footer.brand>',
        duration: 0.55,
        shouldAbort,
        onMaterialize: () => {
          if (shouldAbort()) return;
          this.heroAnimation.revealFooterBrand();
          this.tasks.completeTask('ft-brand', 'FOOTER');
        }
      });
    } else {
      this.heroAnimation.revealFooterBrand();
      this.tasks.completeTask('ft-brand', 'FOOTER');
    }
    if (shouldAbort()) return;
    if (this.shouldSwitchSection) { this.quickCompleteSection('site-footer'); return; }

    // 3. Foto frames footer symbol & Motion frames social links
    const promiseSymbol = (async () => {
      if (foto) {
        await this.boxDrawer.drawBox({
          agent: foto,
          box: boxes.footerSymbol(),
          tagName: '<footer.symbol>',
          duration: 0.5,
          shouldAbort,
          onMaterialize: () => {
            if (shouldAbort()) return;
            this.heroAnimation.revealFooterSymbol();
          }
        });
      } else if (!shouldAbort()) {
        this.heroAnimation.revealFooterSymbol();
      }
    })();

    const promiseSocials = (async () => {
      await this.delay(100);
      if (shouldAbort()) return;
      if (motion) {
        await this.boxDrawer.drawBox({
          agent: motion,
          box: boxes.footerSocial(),
          tagName: '<footer.socials>',
          duration: 0.55,
          shouldAbort,
          onMaterialize: () => {
            if (shouldAbort()) return;
            this.heroAnimation.revealFooterSocials();
          }
        });
      } else if (!shouldAbort()) {
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
   * On 100% natural completion:
   * Smoothly scrolls back to the first section (#hero), scatters cursors
   * across the first section around "Construindo Aplicações...", hides HUD,
   * and reveals the restart replay button
   */
  async finishAndEnableRestart() {
    this.disconnectScrollObservers();

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
   * Responsively clamped for mobile and desktop viewports
   */
  scatterInFirstSection() {
    this.movement.stopMouseOrbit();
    this.boxDrawer.clearAll();

    const agents = this.engine.getActiveAgents();
    const w = document.documentElement.clientWidth || window.innerWidth;
    const isMobile = w <= 768;
    const heroEl = document.getElementById('hero');
    const heroTop = heroEl ? heroEl.offsetTop : 0;
    const gsap = window.gsap;

    const heroPositions = isMobile
      ? [
          { x: Math.max(16, w * 0.08), y: heroTop + 100, rot: -15 },
          { x: Math.min(w - 28, w * 0.86), y: heroTop + 115, rot: 15 },
          { x: Math.max(16, w * 0.06), y: heroTop + 260, rot: -8 },
          { x: Math.min(w - 28, w * 0.88), y: heroTop + 310, rot: 18 },
          { x: Math.max(16, w * 0.08), y: heroTop + 445, rot: -16 },
          { x: Math.min(w - 28, w * 0.86), y: heroTop + 470, rot: 12 },
          { x: Math.max(16, w * 0.14), y: heroTop + 590, rot: -10 }
        ]
      : [
          { x: w * 0.12, y: heroTop + 140, rot: -15 },
          { x: w * 0.88, y: heroTop + 160, rot: 15 },
          { x: w * 0.08, y: heroTop + 330, rot: -8 },
          { x: w * 0.90, y: heroTop + 400, rot: 18 },
          { x: w * 0.12, y: heroTop + 540, rot: -16 },
          { x: w * 0.86, y: heroTop + 560, rot: 12 },
          { x: w * 0.20, y: heroTop + 720, rot: -10 }
        ];

    agents.forEach((agent, i) => {
      const pos = heroPositions[i % heroPositions.length];
      if (gsap) gsap.killTweensOf(agent);
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
   * Initializes Skip Animation button in the Construction HUD bar
   */
  initSkipButton() {
    const skipBtn = document.getElementById('hud-skip-btn');
    if (!skipBtn) return;

    skipBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.skipAnimation();
    });
  }

  /**
   * Immediately skips the swarm construction animation:
   * - Halts all active agents, orbits, tweens, and wireframes
   * - Hides all agents completely
   * - Displays the complete site immediately with zero pending animations
   * - Hides the loading HUD bar and shows the Replay button
   */
  skipAnimation() {
    this.isSkipped = true;
    this.runId += 1;
    this.isCompleted = true;
    this.isBuildingSection = false;
    this.activeSection = null;
    this.shouldSwitchSection = false;

    // 1. Stop observers so scrolling won't re-trigger builds
    this.disconnectScrollObservers();

    // 2. Stop all agent movement, orbits, tweens, and clear any wireframes
    this.movement.stopMouseOrbit();
    this.movement.stopAll();
    this.boxDrawer.clearAll();

    const activeAgents = this.engine.getActiveAgents();
    if (window.gsap) {
      activeAgents.forEach(ag => {
        window.gsap.killTweensOf(ag);
        if (ag.element) window.gsap.killTweensOf(ag.element);
        if (ag.svgPointer) window.gsap.killTweensOf(ag.svgPointer);
      });
    }

    // 3. Hide all agents and the agents overlay completely
    this.engine.hideAll();
    this.engine.setLayerHidden(true);

    // 4. Mark all sections and tasks as complete
    ['hero', 'potencialize', 'servicos', 'contato', 'site-footer'].forEach(id => {
      this.builtSections.add(id);
    });
    this.tasks.tasks.forEach(t => { t.completed = true; });
    this.tasks.updateHUD(100, 'READY');

    // 5. Immediately display the entire site in its final state
    this.heroAnimation.showFinalStateImmediate();

    // 6. Hide the loading HUD bar and expose Replay button in case user wants to watch later
    const hud = document.getElementById('construction-hud');
    if (hud) hud.classList.add('is-hidden');

    const restartBtn = document.getElementById('restart-experience-btn');
    if (restartBtn) restartBtn.classList.add('is-visible');
  }

  /**
   * Initializes Restart Button Click: resets state, scrolls smoothly to top,
   * regroups cursors at the center, and restarts Swarm
   */
  initRestartButton() {
    const restartBtn = document.getElementById('restart-experience-btn');
    if (!restartBtn) return;

    restartBtn.addEventListener('click', async () => {
      // 1. Abort any previous run & clean up
      this.runId += 1;
      const restartRunId = this.runId;
      this.isSkipped = false;
      this.disconnectScrollObservers();
      this.movement.stopMouseOrbit();
      this.movement.stopAll();
      this.boxDrawer.clearAll();

      // 2. Hide restart button
      restartBtn.classList.remove('is-visible');

      // 3. Smoothly scroll to the very top
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // 4. Wait for scroll to reach top
      await this.delay(650);
      if (this.isAborted(restartRunId)) return;

      // 5. Reset section states and tasks
      this.builtSections.clear();
      this.isBuildingSection = false;
      this.activeSection = null;
      this.shouldSwitchSection = false;
      this.isCompleted = false;
      this.agentsDeployed = false;

      this.heroAnimation.initElementStates();
      this.tasks.reset();

      // 6. Restore HUD & agents layer
      const hud = document.getElementById('construction-hud');
      if (hud) {
        hud.classList.remove('is-hidden', 'is-completed');
      }
      this.engine.setLayerHidden(false);

      // 7. Regroup cursors at hero center before restarting
      const activeAgents = this.engine.getActiveAgents();
      const viewportW = document.documentElement.clientWidth || window.innerWidth;
      const centerX = viewportW * 0.5;
      const centerY = window.innerHeight * 0.42;
      const spread = viewportW <= 768 ? 42 : 60;
      const gsap = window.gsap;

      activeAgents.forEach((ag, idx) => {
        ag.setVisible(true);
        ag.setIdle(false);
        const angle = (idx / activeAgents.length) * Math.PI * 2;
        const targetX = centerX + Math.cos(angle) * spread;
        const targetY = centerY + Math.sin(angle) * spread;
        if (gsap) {
          gsap.killTweensOf(ag);
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
      if (this.isAborted(restartRunId)) return;

      // 8. Restart Swarm construction from beginning
      await this.start();
    });
  }

  skipToFinalState() {
    this.skipAnimation();
  }
}
