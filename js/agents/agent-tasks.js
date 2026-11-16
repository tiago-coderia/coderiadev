/**
 * Coderia.dev — Agent Tasks & Progress Engine
 * Calculates authentic progress metrics based on executed tasks and updates HUD
 */

export class AgentTasks {
  constructor() {
    this.tasks = [
      { id: 'init-swarm', phase: 'INIT', label: 'INITIALIZING SWARM', completed: false },
      { id: 'struct-frame', phase: 'STRUCT', label: 'ARCHITECT: FRAME BLUEPRINT', completed: false },
      { id: 'struct-header', phase: 'STRUCT', label: 'LAYOUT: ALIGN NAVIGATION', completed: false },
      { id: 'struct-logo', phase: 'STRUCT', label: 'FRONTEND: ANCHOR LOGO', completed: false },
      { id: 'type-eyebrow', phase: 'TYPE', label: 'TYPOGRAPHY: DRAFT EYEBROW', completed: false },
      { id: 'type-headline', phase: 'TYPE', label: 'TYPOGRAPHY: COMPOSE HEADLINE', completed: false },
      { id: 'design-highlight', phase: 'TYPE', label: 'DESIGNER: POLISH HIGHLIGHT', completed: false },
      { id: 'visual-desc', phase: 'VISUAL', label: 'FRONTEND: RENDER SYSTEM TEXT', completed: false },
      { id: 'motion-cta-1', phase: 'VISUAL', label: 'MOTION: RIG PRIMARY CTA', completed: false },
      { id: 'motion-cta-2', phase: 'VISUAL', label: 'MOTION: RIG SECONDARY CTA', completed: false },
      { id: 'qa-nav', phase: 'QA', label: 'QA: AUDIT NAVIGATION', completed: false },
      { id: 'qa-hero', phase: 'QA', label: 'QA: VALIDATE GEOMETRY', completed: false },
      { id: 'qa-badge', phase: 'QA', label: 'QA: CERTIFY SYSTEM SPEC', completed: false },
      { id: 'complete', phase: 'READY', label: 'INTERFACE READY', completed: false }
    ];

    this.hudElement = document.getElementById('construction-hud');
    this.hudTitle = document.getElementById('hud-title');
    this.hudPercent = document.getElementById('hud-percent');
    this.hudProgressBar = document.getElementById('hud-progress-bar');
    this.hudAgentsCount = document.getElementById('hud-agents-count');
    this.hudPhaseLabel = document.getElementById('hud-phase-label');

    this.updateHUD(0, 'INIT');
  }

  completeTask(taskId, phaseLabel) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = true;
    }

    const completedCount = this.tasks.filter(t => t.completed).length;
    const totalCount = this.tasks.length;
    const percent = Math.min(100, Math.round((completedCount / totalCount) * 100));

    this.updateHUD(percent, phaseLabel || task?.phase || 'BUILDING');
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
      if (this.hudAgentsCount) this.hudAgentsCount.textContent = 'ALL TASKS VERIFIED';
      if (this.hudElement) this.hudElement.classList.add('is-completed');
    } else {
      if (this.hudTitle) this.hudTitle.textContent = 'BUILDING INTERFACE';
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

  reset() {
    this.tasks.forEach(t => t.completed = false);
    this.updateHUD(0, 'INIT');
  }
}
