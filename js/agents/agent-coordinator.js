/**
 * Coderia.dev — 14-Agent Concurrent Swarm Choreography Coordinator
 * Drives simultaneous parallel construction by 14 specialized agents:
 * 'Layout', 'Tipo', 'Cor', 'Grid', 'Foto', 'Texto', 'UI', 'Dados', 'Motion', 'Teste', 'CSS', 'Ícones', 'QA', 'Form'
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
  }

  async runChoreography() {
    if (this.isReducedMotion) {
      this.skipToFinalState();
      return;
    }

    try {
      await this.phase1_Initialization();
      await this.phase2_StructureAndHeader();
      await this.phase3_TypographyAndHero();
      await this.phase4_ActionsAndUI();
      await this.phase5_AuditAndTesting();
      await this.phase6_Completion();
    } catch (err) {
      console.warn('Choreography encountered error, falling back to final state:', err);
      this.skipToFinalState();
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Helper to retrieve agent cursor safely
   */
  agent(id) {
    return this.engine.getAgent(id);
  }

  /**
   * FASE 01 — INITIALIZATION
   * All 14 agents deploy simultaneously in an expansive tactical fan-out from screen center
   */
  async phase1_Initialization() {
    const gsap = window.gsap;
    const activeAgents = this.engine.getActiveAgents();
    
    this.tasks.setAgentsCount(activeAgents.length);
    this.tasks.updateHUD(5, 'INIT');

    // Staggered radial explosion from center
    const total = activeAgents.length;
    activeAgents.forEach((ag, index) => {
      const el = ag.element;
      if (!el || !gsap) return;

      const angle = (index / total) * Math.PI * 2;
      const spreadDist = 90 + (index % 3) * 40;
      const targetX = ag.x + Math.cos(angle) * spreadDist;
      const targetY = ag.y + Math.sin(angle) * spreadDist;

      ag.setAction('DEPLOYING', 'is-selecting');
      
      gsap.fromTo(el,
        { scale: 0, opacity: 0 },
        { 
          scale: 1, 
          opacity: 1, 
          duration: 0.75, 
          delay: index * 0.04, 
          ease: 'back.out(2.2)',
          onStart: () => ag.setPosition(targetX, targetY)
        }
      );
    });

    await this.delay(650);

    // Agents quickly announce specializations in unison
    const greetings = [
      ['grid', 'BOUNDING BOXES'],
      ['layout', 'ALIGNMENT'],
      ['texto', 'COPY STREAM'],
      ['tipo', 'TYPOGRAPHY'],
      ['cor', 'PALETTE & GLOW'],
      ['ui', 'SURFACES & RADII'],
      ['css', 'TOKENS & GAPS'],
      ['icones', 'SVG VECTORS'],
      ['foto', 'MEDIA ASSETS'],
      ['dados', 'STUDIO DATA'],
      ['form', 'ACTION WIRES'],
      ['motion', 'SPRING PHYSICS'],
      ['teste', 'TEST PROBES'],
      ['qa', 'QUALITY AUDIT']
    ];

    greetings.forEach(([id, role]) => {
      const a = this.agent(id);
      if (a) a.setAction(role);
    });

    this.tasks.completeTask('init-swarm', 'INIT');
    await this.delay(350);
  }

  /**
   * FASE 02 — STRUCTURE & HEADER (High Concurrent Parallelism)
   * Group 1: Grid + Layout + CSS frame header and baseline
   * Group 2: Ícones + Texto + Cor construct and paint logo
   * Group 3: UI + Form + Motion rig the "Let's Talk" CTA
   */
  async phase2_StructureAndHeader() {
    const boxes = this.hero.getTargetBoxes();
    const targets = this.hero.getTargetPositions();

    const grid = this.agent('grid');
    const layout = this.agent('layout');
    const css = this.agent('css');
    const icones = this.agent('icones');
    const texto = this.agent('texto');
    const cor = this.agent('cor');
    const ui = this.agent('ui');
    const form = this.agent('form');
    const motion = this.agent('motion');

    // 1. Reveal structural blueprint guidelines in background
    this.heroAnimation.revealBlueprintLines();

    // PARALLEL CLUSTER 1: Header Box + Structural Baseline
    const promiseHeader = (async () => {
      if (grid) {
        await this.boxDrawer.drawBox({
          agent: grid,
          box: boxes.header(),
          tagName: '<header.site-header>',
          duration: 0.85,
          onMaterialize: () => {
            this.heroAnimation.revealNav();
            this.tasks.completeTask('grid-header', 'STRUCT');
          }
        });
      } else {
        this.heroAnimation.revealNav();
        this.tasks.completeTask('grid-header', 'STRUCT');
      }

      if (layout) {
        layout.setAction('ALIGNING GRID', 'is-selecting');
        const navPos = targets.headerNav();
        await new Promise(r => this.movement.moveTo(layout, navPos.x, navPos.y, { duration: 0.7, onComplete: r }));
        this.tasks.completeTask('layout-nav', 'STRUCT');
        layout.setAction('ALIGNED');
      }

      if (css) {
        css.setAction('GAP: 32px', 'is-selecting');
        const navPos = targets.headerNav();
        this.movement.moveTo(css, navPos.x + 80, navPos.y + 12, { duration: 0.8 });
        this.tasks.completeTask('css-nav', 'STRUCT');
      }
    })();

    // PARALLEL CLUSTER 2 (Simultaneous): Brand Logo Construction
    const promiseLogo = (async () => {
      await this.delay(150);
      const logoBox = boxes.headerLogo();

      if (icones) {
        icones.setAction('SVG </ >', 'is-typing');
        const logoPos = targets.headerLogo();
        await new Promise(r => this.movement.moveTo(icones, logoPos.x - 30, logoPos.y, { duration: 0.6, onComplete: r }));
        this.tasks.completeTask('icones-logo', 'STRUCT');
      }

      if (texto) {
        texto.setAction('WRITE LOGO', 'is-typing');
        const logoPos = targets.headerLogo();
        await new Promise(r => this.movement.moveTo(texto, logoPos.x + 10, logoPos.y, { duration: 0.6, onComplete: r }));
        this.heroAnimation.revealLogo();
        this.tasks.completeTask('texto-logo', 'STRUCT');
      }

      if (cor) {
        cor.setAction('CYAN ACCENT', 'is-selecting');
        const logoPos = targets.headerLogo();
        this.movement.moveTo(cor, logoPos.x + 40, logoPos.y, { duration: 0.5 });
        this.tasks.completeTask('cor-brand', 'STRUCT');
      }
    })();

    // PARALLEL CLUSTER 3 (Simultaneous): Header CTA Button Rigging
    const promiseHeaderCta = (async () => {
      await this.delay(200);
      const ctaPos = targets.headerCta();

      if (ui) {
        ui.setAction('BORDER 1px', 'is-selecting');
        await new Promise(r => this.movement.moveTo(ui, ctaPos.x - 20, ctaPos.y, { duration: 0.7, onComplete: r }));
        this.tasks.completeTask('ui-header-cta', 'STRUCT');
      }

      if (form) {
        form.setAction('WIRE #CONTACT', 'is-selecting');
        this.movement.moveTo(form, ctaPos.x + 20, ctaPos.y, { duration: 0.6 });
      }

      if (motion) {
        motion.setAction('SPRING HOVER', 'is-selecting');
        this.movement.moveTo(motion, ctaPos.x, ctaPos.y - 15, { duration: 0.65 });
      }
    })();

    // Await all parallel header clusters to finish smoothly
    await Promise.all([promiseHeader, promiseLogo, promiseHeaderCta]);
    await this.delay(250);
  }

  /**
   * FASE 03 — TYPOGRAPHY & HERO (High Concurrent Parallelism)
   * Group 1: Grid + Foto + Texto assemble Eyebrow badge
   * Group 2: Grid + Texto + Tipo construct giant Headline
   * Group 3: Cor paints the cyan/violet gradient on "digital experiences"
   */
  async phase3_TypographyAndHero() {
    const boxes = this.hero.getTargetBoxes();
    const targets = this.hero.getTargetPositions();

    const grid = this.agent('grid');
    const foto = this.agent('foto');
    const texto = this.agent('texto');
    const tipo = this.agent('tipo');
    const cor = this.agent('cor');
    const layout = this.agent('layout');

    // 1. Eyebrow Assembly (Grid draws box, Foto places dot, Texto streams title)
    const promiseEyebrow = (async () => {
      const eyebrowBox = boxes.eyebrow();
      
      if (grid) {
        await this.boxDrawer.drawBox({
          agent: grid,
          box: eyebrowBox,
          tagName: '<div.hero-eyebrow>',
          duration: 0.65,
          onMaterialize: () => {
            this.heroAnimation.revealEyebrow();
            this.tasks.completeTask('grid-eyebrow', 'TYPE');
          }
        });
      } else {
        this.heroAnimation.revealEyebrow();
        this.tasks.completeTask('grid-eyebrow', 'TYPE');
      }

      if (foto) {
        foto.setAction('STATUS DOT', 'is-selecting');
        const eyePos = targets.eyebrow();
        this.movement.moveTo(foto, eyePos.x - 40, eyePos.y, { duration: 0.5 });
        this.tasks.completeTask('foto-dot', 'TYPE');
      }

      if (texto) {
        texto.setAction('TYPING EYEBROW', 'is-typing');
        const eyePos = targets.eyebrow();
        this.movement.moveTo(texto, eyePos.x + 30, eyePos.y, { duration: 0.5 });
        this.tasks.completeTask('texto-eyebrow', 'TYPE');
      }
    })();

    await promiseEyebrow;
    await this.delay(100);

    // 2. Headline Construction (Concurrent Teamwork)
    // Grid drags the massive headline box
    const headlineBox = boxes.headline();

    const promiseHeadline = (async () => {
      if (grid) {
        await this.boxDrawer.drawBox({
          agent: grid,
          box: headlineBox,
          tagName: '<h1.hero-headline>',
          duration: 0.95,
          onMaterialize: () => {
            this.heroAnimation.revealHeadline();
            this.tasks.completeTask('grid-headline', 'TYPE');
          }
        });
      } else {
        this.heroAnimation.revealHeadline();
        this.tasks.completeTask('grid-headline', 'TYPE');
      }
    })();

    // While Grid is dragging the box, Tipo and Texto approach concurrently!
    const promiseTypoTeam = (async () => {
      await this.delay(180);

      if (tipo) {
        tipo.setAction('SCALE: 5.2rem', 'is-selecting');
        const headPos = targets.headlineStart();
        await new Promise(r => this.movement.moveTo(tipo, headPos.x, headPos.y - 15, { duration: 0.65, onComplete: r }));
        this.tasks.completeTask('tipo-scale', 'TYPE');
      }

      if (texto) {
        texto.setAction('STREAMING COPY', 'is-typing');
        const headPos = targets.headlineStart();
        await new Promise(r => this.movement.moveTo(texto, headPos.x + 80, headPos.y + 10, { duration: 0.65, onComplete: r }));
        this.tasks.completeTask('texto-headline', 'TYPE');
      }

      // Cor lands right on "digital experiences" to paint the glowing gradient
      if (cor) {
        cor.setAction('PAINT GRADIENT', 'is-selecting');
        const highlightBox = boxes.headlineHighlight();
        await this.boxDrawer.drawBox({
          agent: cor,
          box: highlightBox,
          tagName: '<span.highlight>',
          duration: 0.65,
          onMaterialize: () => {
            this.heroAnimation.glowHeadlineHighlight();
            this.tasks.completeTask('cor-gradient', 'TYPE');
          }
        });
        cor.setAction('LUMINESCENT');
      } else {
        this.heroAnimation.glowHeadlineHighlight();
        this.tasks.completeTask('cor-gradient', 'TYPE');
      }
    })();

    await Promise.all([promiseHeadline, promiseTypoTeam]);
    await this.delay(250);
  }

  /**
   * FASE 04 — UI & MOTION RIGGING (High Concurrent Parallelism)
   * Group 1: Grid + Texto + CSS construct the supporting description
   * Group 2: Grid + UI + Ícones + Form + Motion build and rig the dual CTAs
   */
  async phase4_ActionsAndUI() {
    const boxes = this.hero.getTargetBoxes();
    const targets = this.hero.getTargetPositions();

    const grid = this.agent('grid');
    const texto = this.agent('texto');
    const css = this.agent('css');
    const ui = this.agent('ui');
    const icones = this.agent('icones');
    const form = this.agent('form');
    const motion = this.agent('motion');

    // CONCURRENT CLUSTER 1: System Description
    const promiseDesc = (async () => {
      const descBox = boxes.description();
      if (grid) {
        await this.boxDrawer.drawBox({
          agent: grid,
          box: descBox,
          tagName: '<p.hero-description>',
          duration: 0.75,
          onMaterialize: () => {
            this.heroAnimation.revealDescription();
            this.tasks.completeTask('grid-desc', 'UI/MOTION');
          }
        });
      } else {
        this.heroAnimation.revealDescription();
        this.tasks.completeTask('grid-desc', 'UI/MOTION');
      }

      if (texto) {
        texto.setAction('SYNTHESIZING', 'is-typing');
        const descPos = targets.description();
        this.movement.moveTo(texto, descPos.x + 60, descPos.y, { duration: 0.6 });
        this.tasks.completeTask('texto-desc', 'UI/MOTION');
      }

      if (css) {
        css.setAction('LINE-HEIGHT 1.65', 'is-selecting');
        const descPos = targets.description();
        this.movement.moveTo(css, descPos.x - 80, descPos.y, { duration: 0.6 });
        this.tasks.completeTask('css-spacing', 'UI/MOTION');
      }
    })();

    await this.delay(200);

    // CONCURRENT CLUSTER 2: Dual CTAs ("Explore our work" & "Let's talk")
    const promiseCtas = (async () => {
      const cta1Box = boxes.primaryCta();
      const cta2Box = boxes.secondaryCta();

      // UI shapes primary button frame while Motion rigs secondary
      if (ui) {
        ui.setAction('RADIUS: 6px', 'is-selecting');
        await this.boxDrawer.drawBox({
          agent: ui,
          box: cta1Box,
          tagName: '<button.primary-cta>',
          duration: 0.65,
          onMaterialize: () => {
            this.heroAnimation.revealPrimaryCta();
            this.tasks.completeTask('grid-ctas', 'UI/MOTION');
            this.tasks.completeTask('ui-buttons', 'UI/MOTION');
          }
        });
      } else {
        this.heroAnimation.revealPrimaryCta();
        this.tasks.completeTask('grid-ctas', 'UI/MOTION');
        this.tasks.completeTask('ui-buttons', 'UI/MOTION');
      }

      // Ícones drops arrow vector into primary CTA
      if (icones) {
        icones.setAction('ARROW SVG', 'is-typing');
        const cta1Pos = targets.primaryCta();
        this.movement.moveTo(icones, cta1Pos.x + 35, cta1Pos.y, { duration: 0.5 });
        this.tasks.completeTask('icones-cta', 'UI/MOTION');
      }

      // Motion frames and tests secondary CTA
      if (motion) {
        motion.setAction('RIGGING SECONDARY', 'is-selecting');
        await this.boxDrawer.drawBox({
          agent: motion,
          box: cta2Box,
          tagName: '<button.secondary-cta>',
          duration: 0.6,
          onMaterialize: () => {
            this.heroAnimation.revealSecondaryCta();
            this.tasks.completeTask('motion-spring', 'UI/MOTION');
          }
        });
        motion.setAction('CALIBRATED');
      } else {
        this.heroAnimation.revealSecondaryCta();
        this.tasks.completeTask('motion-spring', 'UI/MOTION');
      }

      if (form) {
        form.setAction('WIRE CTAs', 'is-selecting');
        const cta2Pos = targets.secondaryCta();
        this.movement.moveTo(form, cta2Pos.x + 20, cta2Pos.y, { duration: 0.5 });
        this.tasks.completeTask('form-triggers', 'UI/MOTION');
      }
    })();

    await Promise.all([promiseDesc, promiseCtas]);
    await this.delay(250);
  }

  /**
   * FASE 05 — TESTING, METRICS & QA AUDIT (High Concurrent Parallelism)
   * Group 1: Dados + Foto mount specification badge
   * Group 2: Teste executes simulated interaction probes
   * Group 3: QA audits geometry across whole screen and stamps certified pass
   */
  async phase5_AuditAndTesting() {
    const boxes = this.hero.getTargetBoxes();
    const targets = this.hero.getTargetPositions();

    const dados = this.agent('dados');
    const foto = this.agent('foto');
    const teste = this.agent('teste');
    const qa = this.agent('qa');

    // 1. Studio Specification Badge Assembly
    const promiseBadge = (async () => {
      const specBox = boxes.complementary();
      if (dados) {
        await this.boxDrawer.drawBox({
          agent: dados,
          box: specBox,
          tagName: '<div.spec-badge>',
          duration: 0.65,
          onMaterialize: () => {
            this.heroAnimation.revealComplementary();
            this.tasks.completeTask('dados-badge', 'AUDIT');
          }
        });
      } else {
        this.heroAnimation.revealComplementary();
        this.tasks.completeTask('dados-badge', 'AUDIT');
      }

      if (foto) {
        foto.setAction('BULLET SEPARATORS', 'is-selecting');
        const specPos = targets.complementary();
        this.movement.moveTo(foto, specPos.x + 40, specPos.y, { duration: 0.5 });
      }
    })();

    // 2. Parallel Automated Interaction Probes (Teste Agent)
    const promiseTeste = (async () => {
      if (!teste) return;
      teste.setAction('TEST CLICK: CTA', 'is-validating');
      const cta1Pos = targets.primaryCta();
      
      await new Promise(r => this.movement.moveTo(teste, cta1Pos.x + 10, cta1Pos.y, { duration: 0.55, onComplete: r }));
      
      // Simulate hover micro-press
      const ctaEl = document.getElementById('hero-primary-cta');
      if (ctaEl) ctaEl.style.transform = 'scale(0.97)';
      await this.delay(120);
      if (ctaEl) ctaEl.style.transform = '';

      // Test nav link
      teste.setAction('TEST NAV: LINK', 'is-validating');
      const navPos = targets.headerNav();
      await new Promise(r => this.movement.moveTo(teste, navPos.x + 40, navPos.y, { duration: 0.5, onComplete: r }));
      this.tasks.completeTask('teste-simulate', 'AUDIT');
      teste.setAction('TEST PASSED');
    })();

    // 3. Parallel Final QA Certification (QA Agent)
    const promiseQA = (async () => {
      if (!qa) return;
      qa.setAction('AUDIT GEOMETRY', 'is-validating');
      const headPos = targets.headlineHighlight();
      
      await new Promise(r => this.movement.moveTo(qa, headPos.x + 50, headPos.y + 15, { duration: 0.6, onComplete: r }));
      
      qa.setAction('CERTIFY SPEC', 'is-validating');
      const specPos = targets.complementary();
      await new Promise(r => this.movement.moveTo(qa, specPos.x - 30, specPos.y, { duration: 0.55, onComplete: r }));
      
      this.tasks.completeTask('qa-certify', 'AUDIT');
      qa.setAction('CERTIFIED', 'is-validating');
    })();

    await Promise.all([promiseBadge, promiseTeste, promiseQA]);
    await this.delay(350);
  }

  /**
   * FASE 06 — COMPLETION & ORBITAL AMBIENT DRIFT
   * All 14 agents finalize tasks, HUD updates to 100% INTERFACE READY,
   * agents gracefully disperse into a subtle multiplayer floating swarm.
   */
  async phase6_Completion() {
    this.tasks.completeTask('complete', 'READY');

    const activeAgents = this.engine.getActiveAgents();
    const total = activeAgents.length;
    
    // Disperse all 14 agents gracefully around the spacious viewport perimeter
    activeAgents.forEach((ag, i) => {
      ag.setAction('IDLE');
      
      const angle = (i / total) * Math.PI * 2;
      const rx = window.innerWidth * 0.42;
      const ry = window.innerHeight * 0.36;
      const targetX = window.innerWidth * 0.5 + Math.cos(angle) * rx;
      const targetY = window.innerHeight * 0.46 + Math.sin(angle) * ry;

      this.movement.moveTo(ag, targetX, targetY, {
        duration: 1.3 + (i % 4) * 0.15,
        ease: 'power2.out',
        onComplete: () => {
          this.movement.startAmbientDrift(ag, 22);
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
