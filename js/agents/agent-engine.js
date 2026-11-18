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
    this.boxDrawer = new AgentBoxDrawer(this.container, this.movement);
    this.agents = new Map();
    this.isMobile = window.innerWidth <= 768;

    this.initAgents();
    this.bindResize();
  }

  initAgents() {
    if (!this.container) return;
    this.updateContainerHeight();

    // All 7 core builder agents are active on both desktop and mobile
    AGENT_PROFILES.forEach(profile => {
      const cursor = new AgentCursor(profile, this.container);
      this.agents.set(profile.id, cursor);
    });
  }

  updateContainerHeight() {
    if (!this.container) return;
    const docHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight
    );
    this.container.style.height = `${docHeight}px`;
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

  setLayerHidden(hidden) {
    if (!this.container) return;
    if (hidden) {
      this.container.classList.add('is-hidden');
    } else {
      this.container.classList.remove('is-hidden');
    }
  }

  bindResize() {
    const syncHeight = () => {
      this.isMobile = window.innerWidth <= 768;
      this.updateContainerHeight();
    };

    window.addEventListener('resize', syncHeight, { passive: true });
    window.addEventListener('load', syncHeight, { passive: true });

    // Keep agents-layer height in sync as fonts/images load or layout reflows
    if (typeof ResizeObserver !== 'undefined' && document.body) {
      this.resizeObserver = new ResizeObserver(() => {
        this.updateContainerHeight();
      });
      this.resizeObserver.observe(document.body);
    }
  }

  destroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    this.movement.stopMouseOrbit();
    this.movement.stopAll();
    if (this.boxDrawer) this.boxDrawer.clearAll();
    this.agents.forEach(agent => agent.destroy());
    this.agents.clear();
  }
}
