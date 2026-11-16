/**
 * Coderia.dev — Scroll-Driven Multi-Agent Swarm Coordinator
 * 
 * Implements:
 * 1. Strict in-view triggering (zero pre-execution off-screen)
 * 2. Cursors start invisible, appearing right as they execute
 * 3. Idle mouse-following inward orbital ring (hiding tags, matching spec screenshot)
 * 4. 100% completion cleanup (hiding HUD & cursors, showing floating replay icon)
 */

export class AgentCoordinator {
  constructor(engine, hero, heroAnimation, taskEngine) {
    this.engine = engine;
    this.hero = hero;
    this.heroAnimation = heroAnimation;
    this.tasks = taskEngine;
    this.movement = engine.movement;
    this.boxDrawer = engine.boxDrawer;
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.builtSections = new Set();
    this.activeSection = null;
    this.isBuildingSection = false;
    this.sectionQueue = [];
    this.observer = null;

    this.initRestartButton();
  }

  async start() {
    if (this.isReducedMotion) {
      this.skipToFinalState();
      return;
    }

    // 1. Build initial Viewport (Header + Hero)
    await this.buildHeroSection();

    // 2. Attach strict In-View Scroll Observers for remaining sections
    this.initScrollObservers();

    // 3. Check if any section is already in view (e.g. page refresh midway)
    this.checkVisibleSections();
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  agent(id) {
    return this.engine.getAgent(id);
  }

  /**
   * SECTION 1: HEADER & HERO CONSTRUCTION
   */
  async buildHeroSection() {
    this.builtSections.add('hero');
    this.engine.updateContainerHeight();

    const boxes = this.hero.getTargetBoxes();
    const targets = this.hero.getTargetPositions();
    const gsap = window.gsap;

    const activeAgents = this.engine.getActiveAgents();
    this.tasks.setAgentsCount(activeAgents.length);
    this.tasks.updateHUD(5, 'HERO');

    // Make cursors visible right as execution begins
    activeAgents.forEach((ag, idx) => {
      ag.setVisible(true);
      ag.setIdle(false);
      const el = ag.element;
      if (!el || !gsap) return;

      const angle = (idx / activeAgents.length) * Math.PI * 2;
      const dist = 75 + (idx % 3) * 30;
      const targetX = ag.x + Math.cos(angle) * dist;
      const targetY = ag.y + Math.sin(angle) * dist;

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

    await this.delay(550);
    this.tasks.completeTask('hero-init', 'HERO');

    // Header Construction
    const grid = this.agent('grid');
    const icones = this.agent('icones');
    const texto = this.agent('texto');
    const ui = this.agent('ui');
    const foto = this.agent('foto');
    const tipo = this.agent('tipo');
    const cor = this.agent('cor');

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
      await this.delay(100);
      if (icones) {
        icones.setAction('MOUNT LOGO', 'is-typing');
        const logoPos = targets.headerLogo();
        await new Promise(r => this.movement.moveTo(icones, logoPos.x, logoPos.y, { duration: 0.6, onComplete: r }));
        this.heroAnimation.revealLogo();
        this.tasks.completeTask('hero-logo', 'HERO');
      } else {
        this.heroAnimation.revealLogo();
        this.tasks.completeTask('hero-logo', 'HERO');
      }
    })();

    await Promise.all([promiseHeader, promiseLogo]);

    // Hero Symbol
    if (foto) {
      foto.setAction('MOUNT SYMBOL', 'is-selecting');
      const symPos = targets.heroSymbol();
      await new Promise(r => this.movement.moveTo(foto, symPos.x, symPos.y, { duration: 0.5, onComplete: r }));
      this.heroAnimation.revealHeroSymbol();
      this.tasks.completeTask('hero-symbol', 'HERO');
    } else {
      this.heroAnimation.revealHeroSymbol();
      this.tasks.completeTask('hero-symbol', 'HERO');
    }

    // Headline Construction
    const promiseHeadline = (async () => {
      if (grid) {
        await this.boxDrawer.drawBox({
          agent: grid,
          box: boxes.headline(),
          tagName: '<h1.hero-headline>',
          duration: 0.85,
          onMaterialize: () => {
            this.heroAnimation.revealHeadline();
            this.tasks.completeTask('hero-headline', 'HERO');
          }
        });
      } else {
        this.heroAnimation.revealHeadline();
        this.tasks.completeTask('hero-headline', 'HERO');
      }
    })();

    const promiseCopy = (async () => {
      await this.delay(120);
      if (texto) {
        texto.setAction('WRITE HEADLINE', 'is-typing');
        const headPos = targets.headlineStart();
        await new Promise(r => this.movement.moveTo(texto, headPos.x + 50, headPos.y + 10, { duration: 0.55, onComplete: r }));
      }
      if (tipo) {
        tipo.setAction('SCALE 7xl', 'is-selecting');
      }
      if (cor) {
        cor.setAction('PAINT GRADIENT', 'is-selecting');
        const hlBox = boxes.headlineHighlight();
        await this.boxDrawer.drawBox({
          agent: cor,
          box: hlBox,
          tagName: '<span.highlight>',
          duration: 0.6,
          onMaterialize: () => {
            this.heroAnimation.glowHeadlineHighlight();
            this.heroAnimation.revealDescription();
            this.tasks.completeTask('hero-gradient', 'HERO');
            this.tasks.completeTask('hero-copy', 'HERO');
          }
        });
      }
    })();

    await Promise.all([promiseHeadline, promiseCopy]);

    // CTA & Showcase Workspace
    if (ui) {
      ui.setAction('SHAPE CTA', 'is-selecting');
      const ctaBox = boxes.primaryCta();
      await this.boxDrawer.drawBox({
        agent: ui,
        box: ctaBox,
        tagName: '<button.projects>',
        duration: 0.6,
        onMaterialize: () => {
          this.heroAnimation.revealPrimaryCta();
          this.tasks.completeTask('hero-cta', 'HERO');
        }
      });
    }

    if (grid) {
      grid.setAction('WORKSPACE FRAME', 'is-selecting');
      const scBox = boxes.showcaseFrame();
      await this.boxDrawer.drawBox({
        agent: grid,
        box: scBox,
        tagName: '<div.n8n-showcase>',
        duration: 0.7,
        onMaterialize: () => {
          this.heroAnimation.revealShowcaseFrame();
          this.tasks.completeTask('hero-showcase', 'HERO');
        }
      });
    }

    // Enter idle mode: hide tags, form circular ring following visitor mouse!
    this.enterIdleMouseOrbit();
  }

  /**
   * ATTACH STRICT IN-VIEW SCROLL OBSERVERS
   * Only triggers when section enters the user's field of view (rootMargin: 0px)
   */
  initScrollObservers() {
    if (this.observer) {
      this.observer.disconnect();
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px 0px 0px', // Strict in-view only!
      threshold: [0.15, 0.2]
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
          const sectionId = entry.target.id;
          if (!this.builtSections.has(sectionId)) {
            this.queueSection(sectionId);
          }
        }
      });
    }, observerOptions);

    ['potencialize', 'servicos', 'contato', 'site-footer'].forEach(id => {
      const el = document.getElementById(id);
      if (el) this.observer.observe(el);
    });

    // Bottom of page scroll check for footer
    this.scrollCheckFn = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const scrollPos = scrollY + window.innerHeight;
      const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);

      if (scrollPos >= docHeight - 80) {
        if (!this.builtSections.has('site-footer')) {
          this.queueSection('site-footer');
        }
      }
    };

    window.addEventListener('scroll', this.scrollCheckFn, { passive: true });
  }

  checkVisibleSections() {
    ['potencialize', 'servicos', 'contato', 'site-footer'].forEach(id => {
      const el = document.getElementById(id);
      if (el && !this.builtSections.has(id)) {
        const rect = el.getBoundingClientRect();
        // Only trigger if at least 15% of the section is strictly visible inside viewport
        if (rect.top < window.innerHeight - 80 && rect.bottom > 80) {
          this.queueSection(id);
        }
      }
    });
  }

  queueSection(sectionId) {
    if (this.builtSections.has(sectionId)) return;
    this.builtSections.add(sectionId);

    if (this.isBuildingSection) {
      this.sectionQueue.push(sectionId);
      return;
    }

    this.processSection(sectionId);
  }

  async processSection(sectionId) {
    this.isBuildingSection = true;
    this.activeSection = sectionId;

    // Wake agents up from mouse orbit to execute
    this.exitIdleMouseOrbit();

    try {
      switch (sectionId) {
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
    } catch (err) {
      console.warn(`Error building section ${sectionId}:`, err);
    } finally {
      this.isBuildingSection = false;
      if (this.sectionQueue.length > 0) {
        const nextId = this.sectionQueue.shift();
        this.processSection(nextId);
      }
    }
  }

  /**
   * SECTION 2: WORKFLOW (#potencialize)
   */
  async buildWorkflowSection() {
    this.engine.updateContainerHeight();
    this.tasks.updateHUD(this.tasks.completeTask('wf-header', 'WORKFLOW'), 'WORKFLOW');
    const boxes = this.hero.getTargetBoxes();

    const grid = this.agent('grid');
    const foto = this.agent('foto');
    const texto = this.agent('texto');
    const ui = this.agent('ui');
    const qa = this.agent('qa');

    // 1. Frame Workflow Header
    if (grid) {
      await this.boxDrawer.drawBox({
        agent: grid,
        box: boxes.workflowHeader(),
        tagName: '<section.workflow>',
        duration: 0.65,
        onMaterialize: () => this.heroAnimation.revealWorkflowHeader()
      });
    } else {
      this.heroAnimation.revealWorkflowHeader();
    }

    // 2. Concurrent Cards Construction
    const buildCard = async (agent, boxFn, tag, cardIdx, taskId) => {
      if (agent) {
        await this.boxDrawer.drawBox({
          agent: agent,
          box: boxFn(),
          tagName: tag,
          duration: 0.6,
          onMaterialize: () => {
            this.heroAnimation.revealWorkflowCard(cardIdx);
            this.tasks.completeTask(taskId, 'WORKFLOW');
          }
        });
      } else {
        this.heroAnimation.revealWorkflowCard(cardIdx);
        this.tasks.completeTask(taskId, 'WORKFLOW');
      }
    };

    // Parallel pair 1: Cards 1 & 2
    await Promise.all([
      buildCard(grid, boxes.workflowCard1, '<card.ai-workflow>', 1, 'wf-card-1'),
      buildCard(foto, boxes.workflowCard2, '<card.crm-n8n>', 2, 'wf-card-2')
    ]);

    // Parallel pair 2: Cards 3 & 4
    await Promise.all([
      buildCard(ui, boxes.workflowCard3, '<card.analytics-dash>', 3, 'wf-card-3'),
      buildCard(texto, boxes.workflowCard4, '<card.ecommerce-ai>', 4, 'wf-card-4')
    ]);

    if (qa) {
      qa.setAction('AUDIT WORKFLOW', 'is-validating');
      this.tasks.completeTask('wf-audit', 'WORKFLOW');
    }

    // Return to mouse-following idle orbit
    this.enterIdleMouseOrbit();
  }

  /**
   * SECTION 3: SERVICES (#servicos)
   */
  async buildServicesSection() {
    this.engine.updateContainerHeight();
    this.tasks.updateHUD(this.tasks.completeTask('srv-header', 'SERVICES'), 'SERVICES');
    const boxes = this.hero.getTargetBoxes();

    const grid = this.agent('grid');
    const icones = this.agent('icones');
    const ui = this.agent('ui');

    if (grid) {
      await this.boxDrawer.drawBox({
        agent: grid,
        box: boxes.servicesHeader(),
        tagName: '<section.services>',
        duration: 0.65,
        onMaterialize: () => this.heroAnimation.revealServicesHeader()
      });
    } else {
      this.heroAnimation.revealServicesHeader();
    }

    // Construct 3 service cards in parallel
    const buildService = async (agent, boxFn, tag, idx, taskId) => {
      if (agent) {
        await this.boxDrawer.drawBox({
          agent: agent,
          box: boxFn(),
          tagName: tag,
          duration: 0.65,
          onMaterialize: () => {
            this.heroAnimation.revealServiceCard(idx);
            this.tasks.completeTask(taskId, 'SERVICES');
          }
        });
      } else {
        this.heroAnimation.revealServiceCard(idx);
        this.tasks.completeTask(taskId, 'SERVICES');
      }
    };

    await Promise.all([
      buildService(icones, boxes.serviceCard1, '<card.ai-ml>', 1, 'srv-card-1'),
      buildService(grid, boxes.serviceCard2, '<card.n8n-auto>', 2, 'srv-card-2'),
      buildService(ui, boxes.serviceCard3, '<card.fullstack>', 3, 'srv-card-3')
    ]);

    this.tasks.completeTask('srv-style', 'SERVICES');
    this.enterIdleMouseOrbit();
  }

  /**
   * SECTION 4: CALL TO ACTION (#contato)
   */
  async buildCtaSection() {
    this.engine.updateContainerHeight();
    this.tasks.updateHUD(this.tasks.completeTask('cta-frame', 'CTA'), 'CTA');
    const boxes = this.hero.getTargetBoxes();

    const grid = this.agent('grid');
    const form = this.agent('form');
    const motion = this.agent('motion');

    if (grid) {
      await this.boxDrawer.drawBox({
        agent: grid,
        box: boxes.ctaContainer(),
        tagName: '<section.cta>',
        duration: 0.75,
        onMaterialize: () => {
          this.heroAnimation.revealCta();
          this.tasks.completeTask('cta-copy', 'CTA');
        }
      });
    } else {
      this.heroAnimation.revealCta();
      this.tasks.completeTask('cta-copy', 'CTA');
    }

    if (form) {
      form.setAction('RIG CLIPBOARD', 'is-selecting');
      const btnBox = boxes.ctaContactBtn();
      this.movement.moveTo(form, btnBox.left + 50, btnBox.top + 15, { duration: 0.45 });
      this.tasks.completeTask('cta-button', 'CTA');
    }

    if (motion) {
      motion.setAction('CALIBRATE TOOLTIP', 'is-selecting');
      this.tasks.completeTask('cta-motion', 'CTA');
    }

    this.enterIdleMouseOrbit();
  }

  /**
   * SECTION 5: FOOTER (#site-footer) & 100% COMPLETION
   */
  async buildFooterSection() {
    this.engine.updateContainerHeight();
    this.tasks.updateHUD(this.tasks.completeTask('ft-frame', 'FOOTER'), 'FOOTER');
    const boxes = this.hero.getTargetBoxes();

    const grid = this.agent('grid');
    const icones = this.agent('icones');
    const foto = this.agent('foto');
    const teste = this.agent('teste');
    const qa = this.agent('qa');

    // 1. Grid frames whole footer container
    if (grid) {
      await this.boxDrawer.drawBox({
        agent: grid,
        box: boxes.footer(),
        tagName: '<footer.site-footer>',
        duration: 0.65,
        onMaterialize: () => {
          this.heroAnimation.revealFooter();
        }
      });
    } else {
      this.heroAnimation.revealFooter();
    }

    // 2. Ícones frames footer brand logo
    if (icones) {
      await this.boxDrawer.drawBox({
        agent: icones,
        box: boxes.footerBrand(),
        tagName: '<footer.brand>',
        duration: 0.55,
        onMaterialize: () => {
          this.tasks.completeTask('ft-brand', 'FOOTER');
        }
      });
    } else {
      this.tasks.completeTask('ft-brand', 'FOOTER');
    }

    // 3. Foto frames footer symbol
    if (foto) {
      foto.setAction('LOGO V', 'is-selecting');
      const symBox = boxes.footerSymbol();
      this.movement.moveTo(foto, symBox.left + 15, symBox.top + 10, { duration: 0.45 });
    }

    // 4. Teste tests social links
    if (teste) {
      teste.setAction('TEST SOCIALS', 'is-validating');
      const socBox = boxes.footerSocial();
      await new Promise(r => this.movement.moveTo(teste, socBox.left + 20, socBox.top + 10, { duration: 0.45, onComplete: r }));
      this.tasks.completeTask('ft-social', 'FOOTER');
      teste.setAction('TEST PASSED');
    }

    // 100% Full Site Ready!
    this.tasks.completeTask('site-ready', 'READY');

    if (qa) {
      qa.setAction('SITE VERIFIED', 'is-validating');
    }

    await this.delay(600);

    // 4. Complete cleanup: hide HUD and cursors, reveal replay button
    this.finishAndEnableRestart();
  }

  /**
   * Enter Idle Mode: Cursors hide labels and form an inward-pointing orbital ring
   * that follows the visitor's mouse pointer
   */
  enterIdleMouseOrbit() {
    const agents = this.engine.getActiveAgents();
    this.movement.startMouseOrbit(agents, 46);
  }

  /**
   * Exit Idle Mode: Cursors leave the mouse ring and return to active construction
   */
  exitIdleMouseOrbit() {
    const agents = this.engine.getActiveAgents();
    this.movement.stopMouseOrbit(agents);
  }

  /**
   * On 100% completion: hides build bar and cursors, reveals floating restart button
   */
  finishAndEnableRestart() {
    this.movement.stopMouseOrbit();
    this.engine.hideAll();

    // Hide HUD build bar
    const hud = document.getElementById('construction-hud');
    if (hud) hud.classList.add('is-hidden');

    // Show Restart Replay Button
    const restartBtn = document.getElementById('restart-experience-btn');
    if (restartBtn) restartBtn.classList.add('is-visible');
  }

  /**
   * Initializes Restart Button Click: resets state, scrolls smoothly to top, and restarts Swarm
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
      this.sectionQueue = [];

      this.heroAnimation.initElementStates();
      this.tasks.reset();

      // 5. Restore HUD
      const hud = document.getElementById('construction-hud');
      if (hud) {
        hud.classList.remove('is-hidden', 'is-completed');
      }

      // 6. Restart Swarm construction from beginning
      await this.start();
    });
  }

  skipToFinalState() {
    this.heroAnimation.showFinalStateImmediate();
    this.tasks.tasks.forEach(t => t.completed = true);
    this.tasks.updateHUD(100, 'READY');
    this.engine.hideAll();
  }
}
