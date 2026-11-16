/**
 * Coderia.dev — Agent Swarm Choreography Coordinator
 * Drives the 6-phase construction sequence with real-time wireframe bounding box drawing
 * matching the signature Swarm Rebuild / multiplayer design tool aesthetic.
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
    this.isMobile = window.innerWidth <= 768;
  }

  async runChoreography() {
    if (this.isReducedMotion) {
      this.skipToFinalState();
      return;
    }

    try {
      await this.phase1_Initialization();
      await this.phase2_Structure();
      await this.phase3_Typography();
      await this.phase4_VisualEngineering();
      await this.phase5_QualityAssurance();
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
   * FASE 01 — INITIALIZATION
   * Agents emerge at central coordinates with spring scaling
   */
  async phase1_Initialization() {
    const gsap = window.gsap;
    const activeAgents = this.engine.getActiveAgents();
    
    this.tasks.setAgentsCount(activeAgents.length);
    this.tasks.updateHUD(10, 'INIT');

    // Central staggered entrance
    activeAgents.forEach((agent, index) => {
      const el = agent.element;
      if (!el || !gsap) return;

      agent.setAction('CONNECTING', 'is-selecting');
      gsap.fromTo(el,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, delay: index * 0.08, ease: 'back.out(1.8)' }
      );
    });

    await this.delay(850);
    this.tasks.completeTask('init-swarm', 'INIT');
    await this.delay(250);
  }

  /**
   * FASE 02 — STRUCTURE
   * ARCHITECT draws blueprint guides, LAYOUT & FRONTEND draw bounding boxes for Header & Logo
   */
  async phase2_Structure() {
    const boxes = this.hero.getTargetBoxes();
    const targets = this.hero.getTargetPositions();
    const architect = this.engine.getAgent('architect');
    const layout = this.engine.getAgent('layout');
    const frontend = this.engine.getAgent('frontend');

    // Reveal blueprint lines
    this.heroAnimation.revealBlueprintLines();

    // ARCHITECT sweeps blueprint frame
    if (architect) {
      architect.setAction('FRAMING', 'is-selecting');
      const hPos = targets.blueprintLineH();
      this.movement.moveTo(architect, hPos.x - 140, hPos.y + 15, { duration: 0.9 });
    }

    await this.delay(350);

    // LAYOUT draws the entire Header bounding box in real time
    if (layout) {
      const headerBox = boxes.header();
      await this.boxDrawer.drawBox({
        agent: layout,
        box: headerBox,
        tagName: '<header.site-header>',
        duration: 0.9,
        onMaterialize: () => {
          this.heroAnimation.revealNav();
          this.tasks.completeTask('struct-header', 'STRUCT');
        }
      });
      layout.setAction('STANDBY');
    } else {
      this.heroAnimation.revealNav();
      this.tasks.completeTask('struct-header', 'STRUCT');
    }

    await this.delay(200);

    // FRONTEND draws the typographic Logo bounding box
    if (frontend) {
      const logoBox = boxes.headerLogo();
      await this.boxDrawer.drawBox({
        agent: frontend,
        box: logoBox,
        tagName: '<a.brand-logo>',
        duration: 0.75,
        onMaterialize: () => {
          this.heroAnimation.revealLogo();
          this.tasks.completeTask('struct-logo', 'STRUCT');
        }
      });
      frontend.setAction('STANDBY');
    } else {
      this.heroAnimation.revealLogo();
      this.tasks.completeTask('struct-logo', 'STRUCT');
    }

    this.tasks.completeTask('struct-frame', 'STRUCT');
    await this.delay(400);
  }

  /**
   * FASE 03 — TYPOGRAPHY
   * TYPOGRAPHY draws bounding boxes for Eyebrow & Headline; DESIGNER frames the highlight
   */
  async phase3_Typography() {
    const boxes = this.hero.getTargetBoxes();
    const typography = this.engine.getAgent('typography');
    const designer = this.engine.getAgent('designer');

    // 1. TYPOGRAPHY draws Eyebrow bounding box
    if (typography) {
      const eyebrowBox = boxes.eyebrow();
      await this.boxDrawer.drawBox({
        agent: typography,
        box: eyebrowBox,
        tagName: '<div.hero-eyebrow>',
        duration: 0.8,
        onMaterialize: () => {
          this.heroAnimation.revealEyebrow();
          this.tasks.completeTask('type-eyebrow', 'TYPE');
        }
      });

      await this.delay(200);

      // 2. TYPOGRAPHY draws the massive Headline bounding box across the central viewport
      const headlineBox = boxes.headline();
      await this.boxDrawer.drawBox({
        agent: typography,
        box: headlineBox,
        tagName: '<h1.hero-headline>',
        duration: 1.15,
        onMaterialize: () => {
          this.heroAnimation.revealHeadline();
          this.tasks.completeTask('type-headline', 'TYPE');
        }
      });
      typography.setAction('STANDBY');
    } else {
      this.heroAnimation.revealEyebrow();
      this.heroAnimation.revealHeadline();
      this.tasks.completeTask('type-eyebrow', 'TYPE');
      this.tasks.completeTask('type-headline', 'TYPE');
    }

    await this.delay(300);

    // 3. DESIGNER draws bounding box specifically for "digital experiences" highlight
    if (designer) {
      const highlightBox = boxes.headlineHighlight();
      await this.boxDrawer.drawBox({
        agent: designer,
        box: highlightBox,
        tagName: '<span.highlight>',
        duration: 0.75,
        onMaterialize: () => {
          this.heroAnimation.glowHeadlineHighlight();
          this.tasks.completeTask('design-highlight', 'TYPE');
        }
      });
      designer.setAction('POLISHED');
    } else {
      this.heroAnimation.glowHeadlineHighlight();
      this.tasks.completeTask('design-highlight', 'TYPE');
    }

    await this.delay(400);
  }

  /**
   * FASE 04 — VISUAL ENGINEERING
   * FRONTEND draws description box; MOTION draws primary & secondary CTA button boxes
   */
  async phase4_VisualEngineering() {
    const boxes = this.hero.getTargetBoxes();
    const frontend = this.engine.getAgent('frontend');
    const motion = this.engine.getAgent('motion');

    // 1. FRONTEND draws supporting paragraph bounding box
    if (frontend) {
      const descBox = boxes.description();
      await this.boxDrawer.drawBox({
        agent: frontend,
        box: descBox,
        tagName: '<p.hero-description>',
        duration: 0.85,
        onMaterialize: () => {
          this.heroAnimation.revealDescription();
          this.tasks.completeTask('visual-desc', 'VISUAL');
        }
      });
      frontend.setAction('STANDBY');
    } else {
      this.heroAnimation.revealDescription();
      this.tasks.completeTask('visual-desc', 'VISUAL');
    }

    await this.delay(250);

    // 2. MOTION draws Primary CTA button box
    if (motion) {
      const cta1Box = boxes.primaryCta();
      await this.boxDrawer.drawBox({
        agent: motion,
        box: cta1Box,
        tagName: '<button.primary-cta>',
        duration: 0.7,
        onMaterialize: () => {
          this.heroAnimation.revealPrimaryCta();
          this.tasks.completeTask('motion-cta-1', 'VISUAL');
        }
      });

      await this.delay(150);

      // 3. MOTION draws Secondary CTA button box
      const cta2Box = boxes.secondaryCta();
      await this.boxDrawer.drawBox({
        agent: motion,
        box: cta2Box,
        tagName: '<button.secondary-cta>',
        duration: 0.65,
        onMaterialize: () => {
          this.heroAnimation.revealSecondaryCta();
          this.tasks.completeTask('motion-cta-2', 'VISUAL');
        }
      });
      motion.setAction('CALIBRATED');
    } else {
      this.heroAnimation.revealCtas();
      this.tasks.completeTask('motion-cta-1', 'VISUAL');
      this.tasks.completeTask('motion-cta-2', 'VISUAL');
    }

    await this.delay(500);
  }

  /**
   * FASE 05 — QUALITY ASSURANCE
   * QA traverses layout, validates components, and draws the specification badge box
   */
  async phase5_QualityAssurance() {
    const boxes = this.hero.getTargetBoxes();
    const targets = this.hero.getTargetPositions();
    const qa = this.engine.getAgent('qa');

    if (qa) {
      qa.setAction('AUDITING NAV', 'is-validating');
      const navPos = targets.headerNav();

      await new Promise(res => {
        this.movement.moveTo(qa, navPos.x + 30, navPos.y + 10, {
          duration: 0.75,
          onComplete: () => {
            this.tasks.completeTask('qa-nav', 'QA CHECK');
            res();
          }
        });
      });

      await this.delay(200);

      qa.setAction('AUDITING HERO', 'is-validating');
      const heroPos = targets.headlineHighlight();

      await new Promise(res => {
        this.movement.moveTo(qa, heroPos.x + 50, heroPos.y + 15, {
          duration: 0.65,
          onComplete: () => {
            this.tasks.completeTask('qa-hero', 'QA CHECK');
            res();
          }
        });
      });

      await this.delay(200);

      // QA draws the Complementary Specification Badge box
      const specBox = boxes.complementary();
      await this.boxDrawer.drawBox({
        agent: qa,
        box: specBox,
        tagName: '<div.spec-badge>',
        duration: 0.7,
        onMaterialize: () => {
          this.heroAnimation.revealComplementary();
          this.tasks.completeTask('qa-badge', 'QA CHECK');
          qa.setAction('CERTIFIED', 'is-validating');
        }
      });
    } else {
      this.heroAnimation.revealComplementary();
      this.tasks.completeTask('qa-nav', 'QA CHECK');
      this.tasks.completeTask('qa-hero', 'QA CHECK');
      this.tasks.completeTask('qa-badge', 'QA CHECK');
    }

    await this.delay(400);
  }

  /**
   * FASE 06 — COMPLETION
   * Final regrouping / docking, 100% completion status, ambient drift
   */
  async phase6_Completion() {
    this.tasks.completeTask('complete', 'READY');

    const activeAgents = this.engine.getActiveAgents();
    
    // Disperse agents into comfortable ambient idle drift around viewport
    activeAgents.forEach((agent, i) => {
      agent.setAction('IDLE');
      
      const angle = (i / activeAgents.length) * Math.PI * 2;
      const targetX = window.innerWidth * 0.5 + Math.cos(angle) * (window.innerWidth * 0.36);
      const targetY = window.innerHeight * 0.44 + Math.sin(angle) * (window.innerHeight * 0.26);

      this.movement.moveTo(agent, targetX, targetY, {
        duration: 1.4,
        ease: 'power2.out',
        onComplete: () => {
          this.movement.startAmbientDrift(agent, 20);
        }
      });
    });
  }

  skipToFinalState() {
    this.heroAnimation.showFinalStateImmediate();
    this.tasks.tasks.forEach(t => t.completed = true);
    this.tasks.updateHUD(100, 'READY');
    
    // Hide agents in reduced motion mode
    this.engine.hideAll();
  }
}
