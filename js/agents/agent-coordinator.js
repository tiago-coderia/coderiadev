/**
 * Coderia.dev — Agent Swarm Choreography Coordinator
 * Drives the 6-phase construction sequence, synchronizing agent movements with UI DOM reveals
 */

export class AgentCoordinator {
  constructor(engine, hero, heroAnimation, taskEngine) {
    this.engine = engine;
    this.hero = hero;
    this.heroAnimation = heroAnimation;
    this.tasks = taskEngine;
    this.movement = engine.movement;
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

    await this.delay(900);
    this.tasks.completeTask('init-swarm', 'INIT');
    await this.delay(300);
  }

  /**
   * FASE 02 — STRUCTURE
   * ARCHITECT frames structural bounds, LAYOUT draws header, FRONTEND anchors logo
   */
  async phase2_Structure() {
    const targets = this.hero.getTargetPositions();
    const architect = this.engine.getAgent('architect');
    const layout = this.engine.getAgent('layout');
    const frontend = this.engine.getAgent('frontend');

    // Reveal blueprint lines
    this.heroAnimation.revealBlueprintLines();

    // ARCHITECT frames blueprint
    if (architect) {
      architect.setAction('FRAMING', 'is-selecting');
      const hPos = targets.blueprintLineH();
      this.movement.moveTo(architect, hPos.x - 120, hPos.y + 20, { duration: 1.1 });
    }

    await this.delay(400);

    // LAYOUT establishes header border and navigation
    if (layout) {
      layout.setAction('ALIGNING', 'is-selecting');
      const navPos = targets.headerNav();
      this.movement.moveTo(layout, navPos.x, navPos.y, { 
        duration: 1.2,
        onComplete: () => {
          this.heroAnimation.revealNav();
          layout.setAction('STANDBY');
          this.tasks.completeTask('struct-header', 'STRUCT');
        }
      });
    }

    // FRONTEND anchors typographic logo
    if (frontend) {
      frontend.setAction('ANCHORING', 'is-typing');
      const logoPos = targets.headerLogo();
      this.movement.moveTo(frontend, logoPos.x + 30, logoPos.y + 10, {
        duration: 1.0,
        onComplete: () => {
          this.heroAnimation.revealLogo();
          frontend.setAction('STANDBY');
          this.tasks.completeTask('struct-logo', 'STRUCT');
        }
      });
    }

    this.tasks.completeTask('struct-frame', 'STRUCT');
    await this.delay(1100);
  }

  /**
   * FASE 03 — TYPOGRAPHY
   * TYPOGRAPHY sweeps eyebrow and headline; DESIGNER polishes visual highlight
   */
  async phase3_Typography() {
    const targets = this.hero.getTargetPositions();
    const typography = this.engine.getAgent('typography');
    const designer = this.engine.getAgent('designer');

    // TYPOGRAPHY constructs eyebrow
    if (typography) {
      typography.setAction('WRITING', 'is-typing');
      const eyebrowPos = targets.eyebrow();
      
      await new Promise(res => {
        this.movement.moveTo(typography, eyebrowPos.x + 80, eyebrowPos.y, {
          duration: 0.9,
          onComplete: () => {
            this.heroAnimation.revealEyebrow();
            this.tasks.completeTask('type-eyebrow', 'TYPE');
            res();
          }
        });
      });

      await this.delay(200);

      // TYPOGRAPHY constructs headline
      const headlinePos = targets.headlineStart();
      this.movement.moveTo(typography, headlinePos.x + 120, headlinePos.y + 15, {
        duration: 1.0,
        onComplete: () => {
          this.heroAnimation.revealHeadline();
          this.tasks.completeTask('type-headline', 'TYPE');
        }
      });
    } else {
      // Fallback for mobile if typography culled
      this.heroAnimation.revealEyebrow();
      this.heroAnimation.revealHeadline();
      this.tasks.completeTask('type-eyebrow', 'TYPE');
      this.tasks.completeTask('type-headline', 'TYPE');
    }

    await this.delay(500);

    // DESIGNER polishes the highlighted phrase "digital experiences"
    if (designer) {
      designer.setAction('HIGHLIGHTING', 'is-selecting');
      const highlightPos = targets.headlineHighlight();
      
      this.movement.moveTo(designer, highlightPos.x, highlightPos.y - 15, {
        duration: 0.9,
        onComplete: () => {
          this.heroAnimation.glowHeadlineHighlight();
          designer.setAction('POLISHED');
          this.tasks.completeTask('design-highlight', 'TYPE');
        }
      });
    } else {
      this.heroAnimation.glowHeadlineHighlight();
      this.tasks.completeTask('design-highlight', 'TYPE');
    }

    await this.delay(1000);
  }

  /**
   * FASE 04 — VISUAL ENGINEERING
   * FRONTEND renders description; MOTION executes CTA micro-animations
   */
  async phase4_VisualEngineering() {
    const targets = this.hero.getTargetPositions();
    const frontend = this.engine.getAgent('frontend');
    const motion = this.engine.getAgent('motion');

    // FRONTEND renders supporting paragraph
    if (frontend) {
      frontend.setAction('SYNTHESIZING', 'is-typing');
      const descPos = targets.description();
      this.movement.moveTo(frontend, descPos.x + 60, descPos.y, {
        duration: 0.9,
        onComplete: () => {
          this.heroAnimation.revealDescription();
          this.tasks.completeTask('visual-desc', 'VISUAL');
        }
      });
    } else {
      this.heroAnimation.revealDescription();
      this.tasks.completeTask('visual-desc', 'VISUAL');
    }

    await this.delay(350);

    // MOTION tests primary & secondary CTAs
    if (motion) {
      motion.setAction('RIGGING CTA', 'is-selecting');
      const cta1Pos = targets.primaryCta();

      await new Promise(res => {
        this.movement.moveTo(motion, cta1Pos.x + 20, cta1Pos.y + 10, {
          duration: 0.9,
          onComplete: () => {
            this.heroAnimation.revealCtas();
            this.tasks.completeTask('motion-cta-1', 'VISUAL');
            res();
          }
        });
      });

      // Quick test on secondary CTA
      const cta2Pos = targets.secondaryCta();
      this.movement.moveTo(motion, cta2Pos.x + 10, cta2Pos.y + 10, {
        duration: 0.6,
        onComplete: () => {
          this.tasks.completeTask('motion-cta-2', 'VISUAL');
          motion.setAction('CALIBRATED');
        }
      });
    } else {
      this.heroAnimation.revealCtas();
      this.tasks.completeTask('motion-cta-1', 'VISUAL');
      this.tasks.completeTask('motion-cta-2', 'VISUAL');
    }

    await this.delay(900);
  }

  /**
   * FASE 05 — QUALITY ASSURANCE
   * QA traverses components and verifies visual geometry
   */
  async phase5_QualityAssurance() {
    const targets = this.hero.getTargetPositions();
    const qa = this.engine.getAgent('qa');

    if (qa) {
      qa.setAction('AUDITING NAV', 'is-validating');
      const navPos = targets.headerNav();

      await new Promise(res => {
        this.movement.moveTo(qa, navPos.x + 40, navPos.y + 10, {
          duration: 0.8,
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
        this.movement.moveTo(qa, heroPos.x + 60, heroPos.y + 20, {
          duration: 0.7,
          onComplete: () => {
            this.tasks.completeTask('qa-hero', 'QA CHECK');
            res();
          }
        });
      });

      await this.delay(200);

      // Verify complementary specification badge
      qa.setAction('CERTIFYING', 'is-validating');
      const specPos = targets.complementary();

      await new Promise(res => {
        this.movement.moveTo(qa, specPos.x + 40, specPos.y + 10, {
          duration: 0.7,
          onComplete: () => {
            this.heroAnimation.revealComplementary();
            this.tasks.completeTask('qa-badge', 'QA CHECK');
            qa.setAction('VERIFIED', 'is-validating');
            res();
          }
        });
      });
    } else {
      this.heroAnimation.revealComplementary();
      this.tasks.completeTask('qa-nav', 'QA CHECK');
      this.tasks.completeTask('qa-hero', 'QA CHECK');
      this.tasks.completeTask('qa-badge', 'QA CHECK');
    }

    await this.delay(600);
  }

  /**
   * FASE 06 — COMPLETION
   * Final regrouping / docking, 100% completion status, ambient drift
   */
  async phase6_Completion() {
    this.tasks.completeTask('complete', 'READY');

    const activeAgents = this.engine.getActiveAgents();
    
    // Group agents slightly or let them transition to subtle ambient idle drift
    activeAgents.forEach((agent, i) => {
      agent.setAction('IDLE');
      
      // Gentle dispersion around comfortable viewport coordinates
      const angle = (i / activeAgents.length) * Math.PI * 2;
      const targetX = window.innerWidth * 0.5 + Math.cos(angle) * (window.innerWidth * 0.38);
      const targetY = window.innerHeight * 0.45 + Math.sin(angle) * (window.innerHeight * 0.28);

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
