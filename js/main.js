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
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));
    }

    try {
      // 1. Kick off intro visual boot
      IntroAnimation.start();

      // 2. Initialize UI components
      const navigation = new Navigation();
      const hero = new Hero();
      const heroAnimation = new HeroAnimation(hero);
      const transitions = new Transitions();

      // 3. Initialize Agent Engine & Tasks HUD
      const taskEngine = new AgentTasks();
      const agentEngine = new AgentEngine();

      // 4. Initialize and run choreography coordinator
      const coordinator = new AgentCoordinator(agentEngine, hero, heroAnimation, taskEngine);
      
      // Allow slight breather before choreography kicks in for seamless page load
      setTimeout(() => {
        coordinator.runChoreography();
      }, 350);

    } catch (err) {
      console.error('Coderia.dev bootstrap error:', err);
      // Graceful fallback to fully displayed interface
      document.body.classList.remove('is-loading');
    }
  }
}

// Bootstrap application instance
new App();
