/**
 * Coderia.dev — Scroll-Driven Multi-Agent Swarm Coordinator
 * Orchestrates 7 Core Builder Specialists:
 * Grid, Layout, Texto, Cor, Foto, UI, Motion
 * 
 * Implements:
 * 1. Strict in-view triggering (zero pre-execution off-screen)
 * 2. Cursors start invisible, appearing right as they execute
 * 3. Dynamic idle mouse-following inward orbital ring (hiding tags)
 * 4. Cursors smoothly depart from the circle to build elements and glide smoothly back (no teleporting)
 * 5. 100% completion cleanup (hiding HUD & cursors, showing floating restart button)
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

    // Make cursors visible right as execution begins with back-out scale
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

    // Immediately start the signature mouse-following orbital ring!
    this.enterIdleMouseOrbit();
    await this.delay(200);

    // 7 Builder Agents
    const grid = this.agent('grid');
    const layout = this.agent('layout');
    const texto = this.agent('texto');
    const cor = this.agent('cor');
    const foto = this.agent('foto');
    const ui = this.agent('ui');
    const motion = this.agent('motion');

    // 1. Header & Logo Construction
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

    // 2. Hero Symbol (foto agent mounts the V-symbol)
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

    // 3. Headline & Copy Construction
    const promiseHeadline = (async () => {
      if (grid) {
        await this.boxDrawer.drawBox({
          agent: grid,
          box: boxes.headline(),
          tagName: '<h1.hero-headline>',
          duration: 0.8,
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
      await this.delay(100);
      if (texto) {
        await this.boxDrawer.drawBox({
          agent: texto,
          box: boxes.description(),
          tagName: '<p.hero-description>',
          duration: 0.7,
          onMaterialize: () => {
            this.heroAnimation.revealDescription();
            this.tasks.completeTask('hero-copy', 'HERO');
          }
        });
      } else {
        this.heroAnimation.revealDescription();
        this.tasks.completeTask('hero-copy', 'HERO');
      }

      if (cor) {
        await this.boxDrawer.drawBox({
          agent: cor,
          box: boxes.headlineHighlight(),
          tagName: '<span.highlight>',
          duration: 0.55,
          onMaterialize: () => {
            this.heroAnimation.glowHeadlineHighlight();
            this.tasks.completeTask('hero-gradient', 'HERO');
          }
        });
      } else {
        this.tasks.completeTask('hero-gradient', 'HERO');
      }
    })();

    await Promise.all([promiseHeadline, promiseCopy]);

    // 4. CTA & Showcase Workspace
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

    // Fallback bottom of page scroll check for footer
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
        onMaterialize: () => this.heroAnimation.revealWorkflowHeader()
      });
    } else {
      this.heroAnimation.revealWorkflowHeader();
    }

    // 2. Build Card Helper
    const buildCard = async (agent, boxFn, tag, cardIdx, taskId) => {
      if (agent) {
        await this.boxDrawer.drawBox({
          agent: agent,
          box: boxFn(),
          tagName: tag,
          duration: 0.65,
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
      buildCard(foto, boxes.workflowCard1, '<card.ai-workflow>', 1, 'wf-card-1'),
      buildCard(ui, boxes.workflowCard2, '<card.crm-n8n>', 2, 'wf-card-2')
    ]);

    // Parallel pair 2: Cards 3 & 4
    await Promise.all([
      buildCard(cor, boxes.workflowCard3, '<card.analytics-dash>', 3, 'wf-card-3'),
      buildCard(layout, boxes.workflowCard4, '<card.ecommerce-ai>', 4, 'wf-card-4')
    ]);
  }

  /**
   * SECTION 3: SERVICES (#servicos)
   */
  async buildServicesSection() {
    this.engine.updateContainerHeight();
    this.tasks.updateHUD(this.tasks.completeTask('srv-header', 'SERVICES'), 'SERVICES');
    const boxes = this.hero.getTargetBoxes();

    const grid = this.agent('grid');
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
        onMaterialize: () => this.heroAnimation.revealServicesHeader()
      });
    } else {
      this.heroAnimation.revealServicesHeader();
    }

    // 2. Construct 3 service cards in parallel
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
      buildService(layout, boxes.serviceCard1, '<card.ai-ml>', 1, 'srv-card-1'),
      buildService(ui, boxes.serviceCard2, '<card.n8n-auto>', 2, 'srv-card-2'),
      buildService(cor, boxes.serviceCard3, '<card.fullstack>', 3, 'srv-card-3')
    ]);
  }

  /**
   * SECTION 4: CALL TO ACTION (#contato)
   */
  async buildCtaSection() {
    this.engine.updateContainerHeight();
    const boxes = this.hero.getTargetBoxes();

    const grid = this.agent('grid');
    const texto = this.agent('texto');
    const motion = this.agent('motion');

    if (grid) {
      await this.boxDrawer.drawBox({
        agent: grid,
        box: boxes.ctaContainer(),
        tagName: '<section.cta>',
        duration: 0.75,
        onMaterialize: () => {
          this.heroAnimation.revealCta();
          this.tasks.completeTask('cta-frame', 'CTA');
        }
      });
    } else {
      this.heroAnimation.revealCta();
      this.tasks.completeTask('cta-frame', 'CTA');
    }

    if (texto) {
      await this.boxDrawer.drawBox({
        agent: texto,
        box: boxes.ctaContainer(),
        tagName: '<p.cta-proposal>',
        duration: 0.55,
        onMaterialize: () => {
          this.tasks.completeTask('cta-copy', 'CTA');
        }
      });
    } else {
      this.tasks.completeTask('cta-copy', 'CTA');
    }

    if (motion) {
      await this.boxDrawer.drawBox({
        agent: motion,
        box: boxes.ctaContactBtn(),
        tagName: '<button.contact-action>',
        duration: 0.6,
        onMaterialize: () => {
          this.tasks.completeTask('cta-button', 'CTA');
        }
      });
    } else {
      this.tasks.completeTask('cta-button', 'CTA');
    }
  }

  /**
   * SECTION 5: FOOTER (#site-footer) & 100% COMPLETION
   */
  async buildFooterSection() {
    this.engine.updateContainerHeight();
    const boxes = this.hero.getTargetBoxes();

    const grid = this.agent('grid');
    const layout = this.agent('layout');
    const foto = this.agent('foto');

    // 1. Grid frames whole footer container
    if (grid) {
      await this.boxDrawer.drawBox({
        agent: grid,
        box: boxes.footer(),
        tagName: '<footer.site-footer>',
        duration: 0.65,
        onMaterialize: () => {
          this.heroAnimation.revealFooter();
          this.tasks.completeTask('ft-frame', 'FOOTER');
        }
      });
    } else {
      this.heroAnimation.revealFooter();
      this.tasks.completeTask('ft-frame', 'FOOTER');
    }

    // 2. Layout frames footer brand logo
    if (layout) {
      await this.boxDrawer.drawBox({
        agent: layout,
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

    // 3. Foto frames footer symbol & completes site
    if (foto) {
      await this.boxDrawer.drawBox({
        agent: foto,
        box: boxes.footerSymbol(),
        tagName: '<footer.symbol>',
        duration: 0.5,
        onMaterialize: () => {
          this.tasks.completeTask('site-ready', 'READY');
        }
      });
    } else {
      this.tasks.completeTask('site-ready', 'READY');
    }

    // Full Site Ready (100%)!
    await this.delay(650);

    // Complete cleanup: hide HUD and cursors, reveal replay button
    this.finishAndEnableRestart();
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
