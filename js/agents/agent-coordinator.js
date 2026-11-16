/**
 * Coderia.dev — Scroll-Driven Multi-Agent Swarm Coordinator
 * Drives real-time collaborative construction section-by-section as the user scrolls
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
  }

  async start() {
    if (this.isReducedMotion) {
      this.skipToFinalState();
      return;
    }

    // 1. Build initial Viewport (Header + Hero)
    await this.buildHeroSection();

    // 2. Attach Scroll Observers for remaining sections
    this.initScrollObservers();
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
    const boxes = this.hero.getTargetBoxes();
    const targets = this.hero.getTargetPositions();
    const gsap = window.gsap;

    const activeAgents = this.engine.getActiveAgents();
    this.tasks.setAgentsCount(activeAgents.length);
    this.tasks.updateHUD(5, 'HERO');

    // Radial deployment of all 14 agents
    activeAgents.forEach((ag, idx) => {
      const el = ag.element;
      if (!el || !gsap) return;

      const angle = (idx / activeAgents.length) * Math.PI * 2;
      const dist = 80 + (idx % 3) * 35;
      const targetX = ag.x + Math.cos(angle) * dist;
      const targetY = ag.y + Math.sin(angle) * dist;

      ag.setAction('DEPLOYING', 'is-selecting');
      gsap.fromTo(el,
        { scale: 0, opacity: 0 },
        { 
          scale: 1, 
          opacity: 1, 
          duration: 0.7, 
          delay: idx * 0.04, 
          ease: 'back.out(2.2)',
          onStart: () => ag.setPosition(targetX, targetY)
        }
      );
    });

    await this.delay(600);
    this.tasks.completeTask('hero-init', 'HERO');

    // Header Construction (Grid + Ícones + Texto + UI)
    const grid = this.agent('grid');
    const icones = this.agent('icones');
    const texto = this.agent('texto');
    const ui = this.agent('ui');
    const foto = this.agent('foto');
    const tipo = this.agent('tipo');
    const cor = this.agent('cor');
    const motion = this.agent('motion');

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

    // Hero Symbol (Foto mounts V-symbol)
    if (foto) {
      foto.setAction('MOUNT SYMBOL', 'is-selecting');
      const symPos = targets.heroSymbol();
      await new Promise(r => this.movement.moveTo(foto, symPos.x, symPos.y, { duration: 0.55, onComplete: r }));
      this.heroAnimation.revealHeroSymbol();
      this.tasks.completeTask('hero-symbol', 'HERO');
    } else {
      this.heroAnimation.revealHeroSymbol();
      this.tasks.completeTask('hero-symbol', 'HERO');
    }

    // Headline Construction (Grid + Texto + Tipo + Cor)
    const promiseHeadline = (async () => {
      if (grid) {
        await this.boxDrawer.drawBox({
          agent: grid,
          box: boxes.headline(),
          tagName: '<h1.hero-headline>',
          duration: 0.9,
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
      await this.delay(150);
      if (texto) {
        texto.setAction('WRITE HEADLINE', 'is-typing');
        const headPos = targets.headlineStart();
        await new Promise(r => this.movement.moveTo(texto, headPos.x + 50, headPos.y + 10, { duration: 0.6, onComplete: r }));
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
        duration: 0.75,
        onMaterialize: () => {
          this.heroAnimation.revealShowcaseFrame();
          this.tasks.completeTask('hero-showcase', 'HERO');
        }
      });
    }

    // Settle into ambient idle while user explores Hero
    this.ambientSwarmCluster(window.innerHeight * 0.45);
  }

  /**
   * ATTACH INTERSECTION OBSERVERS FOR SCROLL-DRIVEN SECTIONS
   */
  initScrollObservers() {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -15% 0px',
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          if (!this.builtSections.has(sectionId)) {
            this.onSectionEnter(sectionId);
          }
        }
      });
    }, observerOptions);

    ['potencialize', 'servicos', 'contato', 'site-footer'].forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }

  async onSectionEnter(sectionId) {
    this.builtSections.add(sectionId);
    this.activeSection = sectionId;

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
  }

  /**
   * SECTION 2: WORKFLOW (#potencialize)
   * Swarm descends to frame the 4 project cards and mount images
   */
  async buildWorkflowSection() {
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
        duration: 0.7,
        onMaterialize: () => this.heroAnimation.revealWorkflowHeader()
      });
    } else {
      this.heroAnimation.revealWorkflowHeader();
    }

    // 2. Concurrent Cards Construction (Card 1 & 2 in parallel, then 3 & 4)
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

    this.ambientSwarmCluster(window.innerHeight * 0.5);
  }

  /**
   * SECTION 3: SERVICES (#servicos)
   * Swarm descends to frame the 3 service cards and mount SVGs
   */
  async buildServicesSection() {
    this.tasks.updateHUD(this.tasks.completeTask('srv-header', 'SERVICES'), 'SERVICES');
    const boxes = this.hero.getTargetBoxes();

    const grid = this.agent('grid');
    const icones = this.agent('icones');
    const ui = this.agent('ui');
    const texto = this.agent('texto');

    if (grid) {
      await this.boxDrawer.drawBox({
        agent: grid,
        box: boxes.servicesHeader(),
        tagName: '<section.services>',
        duration: 0.7,
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
          duration: 0.7,
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
    this.ambientSwarmCluster(window.innerHeight * 0.5);
  }

  /**
   * SECTION 4: CALL TO ACTION (#contato)
   * Swarm frames the contact proposal and rigs email copy trigger
   */
  async buildCtaSection() {
    this.tasks.updateHUD(this.tasks.completeTask('cta-frame', 'CTA'), 'CTA');
    const boxes = this.hero.getTargetBoxes();

    const grid = this.agent('grid');
    const texto = this.agent('texto');
    const form = this.agent('form');
    const motion = this.agent('motion');

    if (grid) {
      await this.boxDrawer.drawBox({
        agent: grid,
        box: boxes.ctaContainer(),
        tagName: '<section.cta>',
        duration: 0.8,
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
      this.movement.moveTo(form, btnBox.left + 50, btnBox.top + 15, { duration: 0.5 });
      this.tasks.completeTask('cta-button', 'CTA');
    }

    if (motion) {
      motion.setAction('CALIBRATE TOOLTIP', 'is-selecting');
      this.tasks.completeTask('cta-motion', 'CTA');
    }

    this.ambientSwarmCluster(window.innerHeight * 0.5);
  }

  /**
   * SECTION 5: FOOTER (#site-footer)
   * Swarm frames footer, mounts branding and verifies social links
   */
  async buildFooterSection() {
    this.tasks.updateHUD(this.tasks.completeTask('ft-frame', 'FOOTER'), 'FOOTER');
    const boxes = this.hero.getTargetBoxes();

    const icones = this.agent('icones');
    const teste = this.agent('teste');
    const qa = this.agent('qa');

    if (icones) {
      await this.boxDrawer.drawBox({
        agent: icones,
        box: boxes.footerBrand(),
        tagName: '<footer.brand>',
        duration: 0.65,
        onMaterialize: () => {
          this.heroAnimation.revealFooter();
          this.tasks.completeTask('ft-brand', 'FOOTER');
        }
      });
    } else {
      this.heroAnimation.revealFooter();
      this.tasks.completeTask('ft-brand', 'FOOTER');
    }

    if (teste) {
      teste.setAction('TEST SOCIALS', 'is-validating');
      this.tasks.completeTask('ft-social', 'FOOTER');
    }

    // 100% Full Site Ready!
    this.tasks.completeTask('site-ready', 'READY');

    if (qa) {
      qa.setAction('SITE VERIFIED', 'is-validating');
    }

    this.ambientSwarmCluster(window.innerHeight * 0.6);
  }

  /**
   * Places agents into a soft floating cluster around the visible viewport center
   */
  ambientSwarmCluster(centerY = window.innerHeight * 0.5) {
    const activeAgents = this.engine.getActiveAgents();
    const total = activeAgents.length;

    activeAgents.forEach((ag, i) => {
      ag.setAction('IDLE');
      const angle = (i / total) * Math.PI * 2;
      const rx = window.innerWidth * 0.42;
      const ry = window.innerHeight * 0.32;
      const targetX = window.innerWidth * 0.5 + Math.cos(angle) * rx;
      const targetY = centerY + Math.sin(angle) * ry;

      this.movement.moveTo(ag, targetX, targetY, {
        duration: 1.2 + (i % 3) * 0.2,
        ease: 'power2.out',
        onComplete: () => {
          this.movement.startAmbientDrift(ag, 18);
        }
      });
    });
  }

  skipToFinalState() {
    this.heroAnimation.showFinalStateImmediate();
    this.tasks.tasks.forEach(t => t.completed = true);
    this.tasks.updateHUD(100, 'READY');
    this.engine.hideAll();
  }
}
