/**
 * Coderia.dev — Main Application Bootstrap
 * ES Module Entry Point
 */

import { IntroAnimation } from './animations/intro.js';
import { HeroAnimation } from './animations/hero-animation.js';
import { Transitions } from './animations/transitions.js';
import { Navigation } from './components/navigation.js';
import { Hero } from './components/hero.js';
import { AgentEngine } from './agents/agent-engine.js';
import { AgentTasks } from './agents/agent-tasks.js';
import { AgentCoordinator } from './agents/agent-coordinator.js';

class App {
  constructor() {
    this.init();
  }

  async init() {
    // 0. Enforce scroll position strictly at top (0, 0) before any layout calculations
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));
    }

    const preloaderEl = document.getElementById('site-preloader');
    const preloaderBar = document.getElementById('preloader-progress-bar');
    const preloaderText = document.getElementById('preloader-text');

    if (preloaderBar) preloaderBar.style.width = '45%';

    try {
      // 1. Initialize UI components & set initial hidden states (strictly zero visibility behind preloader)
      const navigation = new Navigation();
      const hero = new Hero();
      const heroAnimation = new HeroAnimation(hero);
      const transitions = new Transitions();

      if (preloaderBar) preloaderBar.style.width = '80%';
      if (preloaderText) preloaderText.textContent = 'CONECTANDO SWARM...';

      // 2. Kick off intro visual boot
      IntroAnimation.start();

      // 3. Initialize Agent Engine & Tasks HUD
      const taskEngine = new AgentTasks();
      const agentEngine = new AgentEngine();

      // 4. Initialize choreography coordinator
      const coordinator = new AgentCoordinator(agentEngine, hero, heroAnimation, taskEngine);

      if (preloaderBar) preloaderBar.style.width = '100%';
      if (preloaderText) preloaderText.textContent = 'PRONTO';

      // 5. Dismiss preloader smoothly and reveal the pristine canvas
      setTimeout(() => {
        // Enforce scroll at 0 again right before dismiss to ensure absolute top start
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;

        if (preloaderEl) {
          preloaderEl.classList.add('is-dismissed');
        }
        document.body.classList.remove('is-loading');

        setTimeout(() => {
          coordinator.start();
        }, 200);
      }, 400);

    } catch (err) {
      console.error('Coderia.dev bootstrap error:', err);
      // Graceful fallback to fully displayed interface
      if (preloaderEl) preloaderEl.classList.add('is-dismissed');
      document.body.classList.remove('is-loading');
    }
  }
}

// Bootstrap application instance
new App();
