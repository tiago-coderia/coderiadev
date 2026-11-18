/**
 * Coderia.dev — Agent Cursor
 * Renders SVG cursor, pill tag, dynamic state badge, idle states, and pointer rotation
 */

export class AgentCursor {
  constructor(profile, container) {
    this.profile = profile;
    this.container = container;
    this.element = null;
    this.svgPointer = null;
    this.statusBadge = null;
    this.currentActionClass = '';
    this.isIdle = false;
    
    this.x = window.innerWidth * profile.initialPos.x;
    this.y = window.innerHeight * profile.initialPos.y;

    this.render();
  }

  render() {
    const cursorEl = document.createElement('div');
    cursorEl.className = 'agent-cursor';
    cursorEl.id = `agent-cursor-${this.profile.id}`;
    cursorEl.style.color = this.profile.color;
    cursorEl.style.transform = `translate3d(${this.x}px, ${this.y}px, 0)`;

    // Custom engineered SVG cursor pointer
    const svgIcon = `
      <svg class="cursor-pointer-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.5 3L19.5 12L12 14.25L9 21L4.5 3Z" 
              fill="${this.profile.color}" 
              stroke="#08080a" 
              stroke-width="1.5" 
              stroke-linejoin="round"/>
      </svg>
    `;

    // Agent label pill & state badge
    const pill = document.createElement('div');
    pill.className = 'agent-pill';
    pill.style.borderColor = this.profile.color;
    
    const nameSpan = document.createElement('span');
    nameSpan.className = 'agent-name';
    nameSpan.textContent = this.profile.name;

    this.statusBadge = document.createElement('span');
    this.statusBadge.className = 'agent-status-badge';
    this.statusBadge.textContent = 'STANDBY';

    pill.appendChild(nameSpan);
    pill.appendChild(this.statusBadge);

    cursorEl.innerHTML = svgIcon;
    cursorEl.appendChild(pill);

    this.container.appendChild(cursorEl);
    this.element = cursorEl;
    this.svgPointer = cursorEl.querySelector('.cursor-pointer-svg');
  }

  setPosition(x, y) {
    if (!Number.isFinite(x) || !Number.isFinite(y)) return;
    this.x = x;
    this.y = y;
    if (this.element) {
      this.element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
      const flipThreshold = viewportWidth <= 768 ? 115 : 145;
      if (x > viewportWidth - flipThreshold) {
        this.element.classList.add('is-flipped-left');
      } else {
        this.element.classList.remove('is-flipped-left');
      }
    }
  }

  setAction(statusText, actionClass = '') {
    if (this.statusBadge) {
      this.statusBadge.textContent = statusText;
    }

    if (this.currentActionClass && this.element) {
      this.element.classList.remove(this.currentActionClass);
      this.currentActionClass = '';
    }

    if (actionClass && this.element) {
      this.element.classList.add(actionClass);
      this.currentActionClass = actionClass;
    }
  }

  setIdle(isIdle) {
    this.isIdle = isIdle;
    if (this.element) {
      if (isIdle) {
        this.element.classList.add('is-idle');
      } else {
        this.element.classList.remove('is-idle');
        this.resetRotation();
      }
    }
  }

  setRotation(degrees) {
    if (this.svgPointer) {
      this.svgPointer.style.transform = `rotate(${degrees}deg)`;
    }
  }

  resetRotation() {
    if (this.svgPointer) {
      this.svgPointer.style.transform = '';
    }
  }

  setVisible(visible) {
    if (this.element) {
      // Ensure no stale inline opacity overrides CSS visibility transitions
      this.element.style.opacity = '';
      if (visible) {
        this.element.classList.add('is-active');
      } else {
        this.element.classList.remove('is-active');
      }
    }
  }

  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}
