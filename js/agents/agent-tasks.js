/**
 * Coderia.dev — Agent Tasks & Progress Engine (7 Builder Agents)
 * Tracks cumulative construction progress for the 7 active builder specialists:
 * Grid, Layout, Texto, Cor, Foto, UI, Motion
 */

export class AgentTasks {
  constructor() {
    this.tasks = [
      // Section 1: Header + Hero
      { id: 'hero-init', section: 'HERO', label: '7 BUILDER AGENTS DEPLOYED', completed: false },
      { id: 'hero-header', section: 'HERO', label: 'GRID: FRAME HEADER', completed: false },
      { id: 'hero-logo', section: 'HERO', label: 'LAYOUT: ALIGN BRAND LOGO', completed: false },
      { id: 'hero-symbol', section: 'HERO', label: 'FOTO: MOUNT V-SYMBOL', completed: false },
      { id: 'hero-headline', section: 'HERO', label: 'GRID: FRAME HEADLINE', completed: false },
      { id: 'hero-copy', section: 'HERO', label: 'TEXTO: WRITE HEADLINE & COPY', completed: false },
      { id: 'hero-gradient', section: 'HERO', label: 'COR: PAINT WEB INTELIGENTES', completed: false },
      { id: 'hero-cta', section: 'HERO', label: 'UI: SHAPE PROJECTS CTA', completed: false },
      { id: 'hero-showcase', section: 'HERO', label: 'GRID: FRAME N8N WORKSPACE', completed: false },

      // Section 2: Workflow
      { id: 'wf-header', section: 'WORKFLOW', label: 'GRID: FRAME WORKFLOW SECTION', completed: false },
      { id: 'wf-card-1', section: 'WORKFLOW', label: 'FOTO: MOUNT AI WORKFLOW', completed: false },
      { id: 'wf-card-2', section: 'WORKFLOW', label: 'UI: MOUNT CRM AUTOMATION', completed: false },
      { id: 'wf-card-3', section: 'WORKFLOW', label: 'COR: MOUNT ANALYTICS DASHBOARD', completed: false },
      { id: 'wf-card-4', section: 'WORKFLOW', label: 'LAYOUT: MOUNT ECOMMERCE AI', completed: false },

      // Section 3: Services
      { id: 'srv-header', section: 'SERVICES', label: 'GRID: FRAME SERVICES SECTION', completed: false },
      { id: 'srv-card-1', section: 'SERVICES', label: 'LAYOUT: SHAPE AI & ML CARD', completed: false },
      { id: 'srv-card-2', section: 'SERVICES', label: 'UI: SHAPE N8N WORKFLOW CARD', completed: false },
      { id: 'srv-card-3', section: 'SERVICES', label: 'COR: SHAPE FULLSTACK DEV CARD', completed: false },

      // Section 4: CTA
      { id: 'cta-frame', section: 'CTA', label: 'GRID: FRAME CONTACT SECTION', completed: false },
      { id: 'cta-copy', section: 'CTA', label: 'TEXTO: STREAM PROPOSAL COPY', completed: false },
      { id: 'cta-button', section: 'CTA', label: 'MOTION: CALIBRATE ACTION TRIGGERS', completed: false },

      // Section 5: Footer
      { id: 'ft-frame', section: 'FOOTER', label: 'GRID: FRAME FOOTER BASELINE', completed: false },
      { id: 'ft-brand', section: 'FOOTER', label: 'LAYOUT: ALIGN FOOTER BRANDING', completed: false },
      { id: 'site-ready', section: 'READY', label: 'FULL SITE ASSEMBLED', completed: false }
    ];

    this.hudElement = document.getElementById('construction-hud');
    this.hudTitle = document.getElementById('hud-title');
    this.hudPercent = document.getElementById('hud-percent');
    this.hudProgressBar = document.getElementById('hud-progress-bar');
    this.hudAgentsCount = document.getElementById('hud-agents-count');
    this.hudPhaseLabel = document.getElementById('hud-phase-label');

    this.updateHUD(0, 'HERO');
  }

  completeTask(taskId, phaseLabel) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = true;
    }

    const completedCount = this.tasks.filter(t => t.completed).length;
    const totalCount = this.tasks.length;
    const percent = Math.min(100, Math.round((completedCount / totalCount) * 100));

    this.updateHUD(percent, phaseLabel || task?.section || 'BUILDING');
    return percent;
  }

  updateHUD(percent, phaseLabel) {
    if (this.hudPercent) {
      this.hudPercent.textContent = `${percent}%`;
    }
    if (this.hudProgressBar) {
      this.hudProgressBar.style.width = `${percent}%`;
    }
    if (this.hudPhaseLabel && phaseLabel) {
      this.hudPhaseLabel.textContent = phaseLabel;
    }

    if (percent >= 100) {
      if (this.hudTitle) this.hudTitle.textContent = 'INTERFACE READY';
      if (this.hudAgentsCount) this.hudAgentsCount.textContent = '7 BUILDERS VERIFIED';
      if (this.hudElement) this.hudElement.classList.add('is-completed');
    } else {
      if (this.hudTitle) this.hudTitle.textContent = `BUILDING: ${phaseLabel}`;
      if (this.hudElement) this.hudElement.classList.remove('is-completed');
    }
  }

  setAgentsCount(count) {
    if (this.hudAgentsCount && !this.isCompleted()) {
      this.hudAgentsCount.textContent = `${count} BUILDER AGENTS`;
    }
  }

  isCompleted() {
    return this.tasks.every(t => t.completed);
  }

  reset() {
    this.tasks.forEach(t => t.completed = false);
    this.updateHUD(0, 'HERO');
  }
}
