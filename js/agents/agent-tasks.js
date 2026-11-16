/**
 * Coderia.dev — Agent Tasks & Progress Engine (14-Agent Swarm)
 * Computes authentic progress from the 14 specialist agent tasks
 */

export class AgentTasks {
  constructor() {
    this.tasks = [
      { id: 'init-swarm', phase: 'INIT', label: '14 AGENTS DEPLOYED', completed: false },
      { id: 'grid-header', phase: 'STRUCT', label: 'GRID: FRAME HEADER BOUNDS', completed: false },
      { id: 'layout-nav', phase: 'STRUCT', label: 'LAYOUT: ALIGN NAVIGATION GRID', completed: false },
      { id: 'icones-logo', phase: 'STRUCT', label: 'ÍCONES: MOUNT BRAND VECTOR', completed: false },
      { id: 'texto-logo', phase: 'STRUCT', label: 'TEXTO: WRITE BRAND IDENTIFIER', completed: false },
      { id: 'cor-brand', phase: 'STRUCT', label: 'COR: INJECT BRAND ACCENTS', completed: false },
      { id: 'css-nav', phase: 'STRUCT', label: 'CSS: COMPUTE NAV FLEX TOKENS', completed: false },
      { id: 'ui-header-cta', phase: 'STRUCT', label: 'UI: SHAPE HEADER ACTION', completed: false },
      { id: 'grid-eyebrow', phase: 'TYPE', label: 'GRID: FRAME EYEBROW BADGE', completed: false },
      { id: 'foto-dot', phase: 'TYPE', label: 'FOTO: MOUNT STATUS PULSE', completed: false },
      { id: 'texto-eyebrow', phase: 'TYPE', label: 'TEXTO: STREAM EYEBROW COPY', completed: false },
      { id: 'grid-headline', phase: 'TYPE', label: 'GRID: FRAME HEADLINE VIEWPORT', completed: false },
      { id: 'tipo-scale', phase: 'TYPE', label: 'TIPO: COMPUTE CLAMP SCALE', completed: false },
      { id: 'texto-headline', phase: 'TYPE', label: 'TEXTO: COMPOSE HEADLINE COPY', completed: false },
      { id: 'cor-gradient', phase: 'TYPE', label: 'COR: PAINT DIGITAL EXPERIENCES', completed: false },
      { id: 'grid-desc', phase: 'UI/MOTION', label: 'GRID: FRAME SYSTEM DESCRIPTION', completed: false },
      { id: 'texto-desc', phase: 'UI/MOTION', label: 'TEXTO: INJECT CORE CAPABILITIES', completed: false },
      { id: 'css-spacing', phase: 'UI/MOTION', label: 'CSS: ALIGN VERTICAL RHYTHM', completed: false },
      { id: 'grid-ctas', phase: 'UI/MOTION', label: 'GRID: FRAME DUAL ACTION CLUSTER', completed: false },
      { id: 'ui-buttons', phase: 'UI/MOTION', label: 'UI: SHAPE PILL RADII & BORDERS', completed: false },
      { id: 'icones-cta', phase: 'UI/MOTION', label: 'ÍCONES: ALIGN ARROW VECTOR', completed: false },
      { id: 'form-triggers', phase: 'UI/MOTION', label: 'FORM: RIG CONTACT PROTOCOLS', completed: false },
      { id: 'motion-spring', phase: 'UI/MOTION', label: 'MOTION: CALIBRATE SPRING CURVES', completed: false },
      { id: 'dados-badge', phase: 'AUDIT', label: 'DADOS: INJECT STUDIO METRICS', completed: false },
      { id: 'teste-simulate', phase: 'AUDIT', label: 'TESTE: SIMULATE INTERACTION AUDIT', completed: false },
      { id: 'qa-certify', phase: 'AUDIT', label: 'QA: CERTIFY SYSTEM GEOMETRY', completed: false },
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
      if (this.hudAgentsCount) this.hudAgentsCount.textContent = 'ALL 14 AGENTS VERIFIED';
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
