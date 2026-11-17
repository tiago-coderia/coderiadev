/**
 * Coderia.dev — Scroll-Driven Multi-Agent Swarm Coordinator
 * Orchestrates 7 Core Builder Specialists:
 * Grid, Layout, Texto, Cor, Foto, UI, Motion
 * 
 * Implements:
 * 1. Wireframe FIRST, content materialization/typing AFTER (strict zero pre-appearance)
 * 2. Word-by-word realistic typing effect with live cursor tracking
 * 3. 100% completion scatter across screen margins (no mouse-following, non-intrusive)
 * 4. Full replay restart with smooth scroll to top and center reassembly
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
   * First wireframes -> then typography typed word-by-word -> then buttons & frames
   */
  async buildHeroSection() {
    this.builtSections.add('hero');
    this.engine.updateContainerHeight();

    const boxes = this.hero.getTargetBoxes();
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

    // Immediately start signature mouse-following orbital ring!
    this.enterIdleMouseOrbit();
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

    // 3. Headline & Copy (Wireframe first -> then typed word-by-word!)
    if (grid) {
      await this.boxDrawer.drawBox({
        agent: grid,
        box: boxes.headline(),
        tagName: '<h1.hero-headline>',
        duration: 0.8,
        onMaterialize: () => {
          this.tasks.completeTask('hero-headline', 'HERO');
        }
      });
    } else {
      this.tasks.completeTask('hero-headline', 'HERO');
    }

    // Type headline word-by-word with texto cursor
    if (texto) {
      this.movement.leaveOrbit(texto);
      await this.heroAnimation.typeTextWords(document.getElementById('hero-headline'), texto, { wordDelay: 60 });
      this.movement.returnToOrbit(texto);
    } else {
      document.querySelectorAll('#hero-headline .type-word').forEach(w => w.style.opacity = '1');
    }

    // Highlight gradient glow
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

    // Description (Wireframe first -> then typed word-by-word!)
    if (texto) {
      await this.boxDrawer.drawBox({
        agent: texto,
        box: boxes.description(),
        tagName: '<p.hero-description>',
        duration: 0.65,
        returnToOrbit: false
      });

      await this.heroAnimation.typeTextWords(document.getElementById('hero-description'), texto, { wordDelay: 42 });
      this.tasks.completeTask('hero-copy', 'HERO');
      this.movement.returnToOrbit(texto);
    } else {
      document.querySelectorAll('#hero-description .type-word').forEach(w => w.style.opacity = '1');
      this.tasks.completeTask('hero-copy', 'HERO');
    }

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
   * Only triggers when section enters the user's field of view (rootMargin: 0px)
   */
  initScrollObservers() {
    if (this.observer) {
      this.observer.disconnect();
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px 0px 0px',
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
   * Wireframe header -> types title/subtitle -> wireframe cards -> reveals cards
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
      await this.heroAnimation.typeTextWords(document.getElementById('workflow-title'), texto, { wordDelay: 50 });
      await this.heroAnimation.typeTextWords(document.getElementById('workflow-subtitle'), texto, { wordDelay: 38 });
      this.tasks.completeTask('wf-header', 'WORKFLOW');
      this.movement.returnToOrbit(texto);
    } else {
      document.querySelectorAll('#workflow-title .type-word, #workflow-subtitle .type-word').forEach(w => w.style.opacity = '1');
      this.tasks.completeTask('wf-header', 'WORKFLOW');
    }

    // 3. Concurrent Cards Construction (Card is 100% hidden until wireframe completes!)
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
   * Wireframe header -> types title/subtitle -> wireframe service cards -> reveals cards
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
      await this.heroAnimation.typeTextWords(document.getElementById('services-title'), texto, { wordDelay: 50 });
      await this.heroAnimation.typeTextWords(document.getElementById('services-subtitle'), texto, { wordDelay: 38 });
      this.tasks.completeTask('srv-header', 'SERVICES');
      this.movement.returnToOrbit(texto);
    } else {
      document.querySelectorAll('#services-title .type-word, #services-subtitle .type-word').forEach(w => w.style.opacity = '1');
      this.tasks.completeTask('srv-header', 'SERVICES');
    }

    // 3. Construct 3 service cards in parallel (Cards remain hidden until wireframe finishes!)
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
      await this.heroAnimation.typeTextWords(document.getElementById('cta-title'), texto, { wordDelay: 50 });

      // Wireframe subtitle
      await this.boxDrawer.drawBox({
        agent: texto,
        box: boxes.ctaSubtitle(),
        tagName: '<p.cta-subtitle>',
        duration: 0.6,
        returnToOrbit: false
      });
      await this.heroAnimation.typeTextWords(document.getElementById('cta-subtitle'), texto, { wordDelay: 38 });

      this.tasks.completeTask('cta-copy', 'CTA');
      this.movement.returnToOrbit(texto);
    } else {
      document.querySelectorAll('#cta-title .type-word, #cta-subtitle .type-word').forEach(w => w.style.opacity = '1');
      this.tasks.completeTask('cta-copy', 'CTA');
    }

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
   * Wireframe container -> wireframe brand -> wireframe symbol & socials -> 100% scatter!
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

    // 100% Full Site Ready!
    this.tasks.completeTask('site-ready', 'READY');

    await this.delay(650);

    // 4. Complete cleanup: scatter cursors across screen margins, hide HUD, reveal replay button
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
   * On 100% completion:
   * Scatters cursors across the screen margins away from content,
   * stops mouse-following, hides HUD, and reveals replay button
   */
  finishAndEnableRestart() {
    this.scatterAcrossScreen();

    // Hide HUD build bar
    const hud = document.getElementById('construction-hud');
    if (hud) hud.classList.add('is-hidden');

    // Show Restart Replay Button
    const restartBtn = document.getElementById('restart-experience-btn');
    if (restartBtn) restartBtn.classList.add('is-visible');
  }

  /**
   * Scatters cursors across screen margins and gutters so they never obstruct content
   */
  scatterAcrossScreen() {
    this.movement.stopMouseOrbit();

    const agents = this.engine.getActiveAgents();
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const gsap = window.gsap;

    // 7 Non-intrusive resting positions in negative space / gutters:
    // Placed along page borders so content and buttons remain completely clear
    const restingPositions = [
      { x: w * 0.05, y: scrollY + h * 0.18, rot: -15 },  // GRID: upper-left margin
      { x: w * 0.93, y: scrollY + h * 0.24, rot: 15 },   // LAYOUT: upper-right margin
      { x: w * 0.06, y: scrollY + h * 0.48, rot: -5 },   // TEXTO: mid-left margin
      { x: w * 0.94, y: scrollY + h * 0.54, rot: 25 },   // COR: mid-right margin
      { x: w * 0.07, y: scrollY + h * 0.78, rot: -20 },  // FOTO: lower-left margin
      { x: w * 0.91, y: scrollY + h * 0.80, rot: 10 },   // UI: lower-right margin
      { x: w * 0.32, y: scrollY + h * 0.86, rot: -12 }   // MOTION: bottom-left gutter
    ];

    agents.forEach((agent, i) => {
      const pos = restingPositions[i % restingPositions.length];
      agent.setVisible(true);
      agent.setIdle(false);
      agent.setAction('STANDBY', '');

      if (gsap) {
        gsap.to(agent, {
          x: pos.x,
          y: pos.y,
          duration: 1.2 + i * 0.08,
          ease: 'power3.out',
          onUpdate: () => agent.setPosition(agent.x, agent.y)
        });
        if (agent.svgPointer) {
          gsap.to(agent.svgPointer, {
            rotation: pos.rot,
            duration: 0.8,
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
      this.sectionQueue = [];

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
    this.scatterAcrossScreen();
  }
}
