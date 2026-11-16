/**
 * Coderia.dev — Agent Swarm Engine
 * Lifecycle manager for agent cursor creation, DOM attachment, resizing, and culling
 */

import { AGENT_PROFILES } from '../config/agents.config.js';
import { AgentCursor } from './agent-cursor.js';
import { AgentMovement } from './agent-movement.js';
import { AgentBoxDrawer } from './agent-box-drawer.js';

export class AgentEngine {
  constructor() {
    this.container = document.getElementById('agents-layer');
    this.movement = new AgentMovement();
    this.boxDrawer = new AgentBoxDrawer(this.container);
    this.agents = new Map();
    this.isMobile = window.innerWidth <= 768;

    this.initAgents();
    this.bindResize();
  }

  initAgents() {
    if (!this.container) return;

    // Filter agents according to viewport (culls to 3 agents on mobile)
    const profiles = AGENT_PROFILES.filter(profile => {
      if (this.isMobile) {
        return profile.mobileActive;
      }
      return true;
    });

    profiles.forEach(profile => {
      const cursor = new AgentCursor(profile, this.container);
      this.agents.set(profile.id, cursor);
    });
  }

  getAgent(id) {
    return this.agents.get(id);
  }

  getActiveAgents() {
    return Array.from(this.agents.values());
  }

  hideAll() {
    this.agents.forEach(agent => agent.setVisible(false));
  }

  bindResize() {
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const currentlyMobile = window.innerWidth <= 768;
        if (currentlyMobile !== this.isMobile) {
          this.isMobile = currentlyMobile;
          // Re-initialize agents for new viewport mode
          this.destroy();
          this.initAgents();
        }
      }, 250);
    }, { passive: true });
  }

  destroy() {
    this.movement.stopAll();
    if (this.boxDrawer) this.boxDrawer.clearAll();
    this.agents.forEach(agent => agent.destroy());
    this.agents.clear();
  }
}
