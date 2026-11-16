/**
 * Coderia.dev — Agent Tasks & Progress Engine (Scroll-Driven Full Site)
 * Computes authentic cumulative progress as the Swarm constructs each section on scroll
 */

export class AgentTasks {
  constructor() {
    this.tasks = [
      // Section 1: Header + Hero
      { id: 'hero-init', section: 'HERO', label: '14 AGENTS DEPLOYED', completed: false },
      { id: 'hero-header', section: 'HERO', label: 'GRID: FRAME HEADER', completed: false },
      { id: 'hero-logo', section: 'HERO', label: 'ÍCONES: MOUNT LOGO', completed: false },
      { id: 'hero-symbol', section: 'HERO', label: 'FOTO: MOUNT V-SYMBOL', completed: false },
      { id: 'hero-headline', section: 'HERO', label: 'GRID: FRAME HEADLINE', completed: false },
      { id: 'hero-copy', section: 'HERO', label: 'TEXTO: WRITE HEADLINE & COPY', completed: false },
      { id: 'hero-gradient', section: 'HERO', label: 'COR: PAINT WEB INTELIGENTES', completed: false },
      { id: 'hero-cta', section: 'HERO', label: 'UI: SHAPE PROJECTS CTA', completed: false },
      { id: 'hero-showcase', section: 'HERO', label: 'GRID: FRAME N8N WORKSPACE', completed: false },

      // Section 2: Workflow
      { id: 'wf-header', section: 'WORKFLOW', label: 'GRID: FRAME WORKFLOW SECTION', completed: false },
      { id: 'wf-card-1', section: 'WORKFLOW', label: 'FOTO: MOUNT WORKFLOW CARD 1', completed: false },
      { id: 'wf-card-2', section: 'WORKFLOW', label: 'FOTO: MOUNT WORKFLOW CARD 2', completed: false },
      { id: 'wf-card-3', section: 'WORKFLOW', label: 'FOTO: MOUNT WORKFLOW CARD 3', completed: false },
      { id: 'wf-card-4', section: 'WORKFLOW', label: 'FOTO: MOUNT WORKFLOW CARD 4', completed: false },
      { id: 'wf-audit', section: 'WORKFLOW', label: 'QA: AUDIT AUTOMATION GRID', completed: false },

      // Section 3: Services
      { id: 'srv-header', section: 'SERVICES', label: 'GRID: FRAME SERVICES SECTION', completed: false },
      { id: 'srv-card-1', section: 'SERVICES', label: 'ÍCONES: MOUNT AI ICON 1', completed: false },
      { id: 'srv-card-2', section: 'SERVICES', label: 'ÍCONES: MOUNT N8N ICON 2', completed: false },
      { id: 'srv-card-3', section: 'SERVICES', label: 'ÍCONES: MOUNT DEV ICON 3', completed: false },
      { id: 'srv-style', section: 'SERVICES', label: 'UI: SHAPE SERVICE SURFACES', completed: false },

      // Section 4: CTA
      { id: 'cta-frame', section: 'CTA', label: 'GRID: FRAME CONTACT SECTION', completed: false },
      { id: 'cta-copy', section: 'CTA', label: 'TEXTO: STREAM PROPOSAL COPY', completed: false },
      { id: 'cta-button', section: 'CTA', label: 'FORM: RIG EMAIL CLIPBOARD', completed: false },
      { id: 'cta-motion', section: 'CTA', label: 'MOTION: CALIBRATE HOVER TOOLTIP', completed: false },

      // Section 5: Footer
      { id: 'ft-frame', section: 'FOOTER', label: 'GRID: FRAME FOOTER BASELINE', completed: false },
      { id: 'ft-brand', section: 'FOOTER', label: 'ÍCONES: MOUNT FOOTER BRANDING', completed: false },
      { id: 'ft-social', section: 'FOOTER', label: 'TESTE: PROBE SOCIAL DESTINATIONS', completed: false },
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
      if (this.hudAgentsCount) this.hudAgentsCount.textContent = 'ALL 14 AGENTS VERIFIED';
      if (this.hudElement) this.hudElement.classList.add('is-completed');
    } else {
      if (this.hudTitle) this.hudTitle.textContent = `BUILDING: ${phaseLabel}`;
      if (this.hudElement) this.hudElement.classList.remove('is-completed');
    }
  }

  setAgentsCount(count) {
    if (this.hudAgentsCount && !this.isCompleted()) {
      this.hudAgentsCount.textContent = `${count} AGENTS ACTIVE`;
    }
  }

  isCompleted() {
    return this.tasks.every(t => t.completed);
  }
}
