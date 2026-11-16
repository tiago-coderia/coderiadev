/**
 * Coderia.dev — Agent Wireframe Box Drawer
 * Creates and animates real-time bounding boxes drawn by agent cursors (Swarm Rebuild style)
 */

export class AgentBoxDrawer {
  constructor(container) {
    this.container = container || document.getElementById('agents-layer');
    this.activeBoxes = [];
  }

  /**
   * Helper to convert HEX color to RGBA
   */
  hexToRgba(hex, alpha = 0.08) {
    let c = hex.replace('#', '');
    if (c.length === 3) {
      c = c.split('').map(x => x + x).join('');
    }
    const num = parseInt(c, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  /**
   * Coordinated animation: agent cursor anchors at top-left and drags down-right,
   * physically drawing out the element's bounding box frame in real time.
   * 
   * @param {object} params
   * @param {AgentCursor} params.agent The agent performing the drawing
   * @param {object} params.box Bounding box coordinates {left, top, width, height, right, bottom}
   * @param {string} params.tagName Label to display (e.g. "<header>", "<h1.hero-headline>")
   * @param {number} params.duration Duration in seconds
   * @param {function} params.onMaterialize Callback to reveal the actual DOM element
   * @returns {Promise<HTMLElement>}
   */
  drawBox({ agent, box, tagName = 'div', duration = 1.0, onMaterialize = null }) {
    return new Promise((resolve) => {
      const gsap = window.gsap;
      if (!this.container || !agent || !box) {
        if (onMaterialize) onMaterialize();
        resolve(null);
        return;
      }

      const color = agent.profile.color;
      const startX = box.left;
      const startY = box.top;
      const targetX = box.right;
      const targetY = box.bottom;

      // 1. Position agent at the top-left anchor point first
      agent.setPosition(startX, startY);
      agent.setAction('ANCHORING', 'is-selecting');

      // 2. Create the wireframe bounding box element
      const boxEl = document.createElement('div');
      boxEl.className = 'wireframe-box';
      if (startY < 30) {
        boxEl.classList.add('is-top-boundary');
      }
      boxEl.style.left = `${startX}px`;
      boxEl.style.top = `${startY}px`;
      boxEl.style.width = '0px';
      boxEl.style.height = '0px';
      boxEl.style.borderColor = color;
      boxEl.style.backgroundColor = this.hexToRgba(color, 0.08);

      // 4 Corner handles
      ['tl', 'tr', 'bl', 'br'].forEach(corner => {
        const handle = document.createElement('span');
        handle.className = `wireframe-handle handle-${corner}`;
        handle.style.borderColor = color;
        boxEl.appendChild(handle);
      });

      // Dimension & Tag metadata badge
      const tagEl = document.createElement('div');
      tagEl.className = 'wireframe-tag';
      tagEl.style.borderColor = color;
      tagEl.innerHTML = `
        <span class="wireframe-tag-name" style="color: ${color}">${tagName}</span>
        <span class="wireframe-tag-dim">0 × 0</span>
      `;
      boxEl.appendChild(tagEl);

      const dimEl = tagEl.querySelector('.wireframe-tag-dim');

      this.container.appendChild(boxEl);
      this.activeBoxes.push(boxEl);

      if (!gsap) {
        // Fallback without GSAP
        boxEl.style.width = `${box.width}px`;
        boxEl.style.height = `${box.height}px`;
        agent.setPosition(targetX, targetY);
        if (onMaterialize) onMaterialize();
        setTimeout(() => {
          boxEl.classList.add('is-complete');
          setTimeout(() => boxEl.remove(), 400);
          resolve(boxEl);
        }, 300);
        return;
      }

      // 3. Animate cursor drag from top-left to bottom-right
      agent.setAction('DRAWING BOX', 'is-selecting');

      gsap.to(agent, {
        x: targetX,
        y: targetY,
        duration: duration / (agent.profile.speed || 1),
        ease: 'power2.inOut',
        onUpdate: () => {
          agent.setPosition(agent.x, agent.y);
          const currentW = Math.max(0, agent.x - startX);
          const currentH = Math.max(0, agent.y - startY);

          boxEl.style.width = `${currentW}px`;
          boxEl.style.height = `${currentH}px`;
          if (dimEl) {
            dimEl.textContent = `${Math.round(currentW)} × ${Math.round(currentH)}`;
          }
        },
        onComplete: () => {
          // Lock to precise target dimensions
          boxEl.style.width = `${box.width}px`;
          boxEl.style.height = `${box.height}px`;
          if (dimEl) {
            dimEl.textContent = `${Math.round(box.width)} × ${Math.round(box.height)}`;
          }

          agent.setAction('MATERIALIZING', 'is-typing');

          // Trigger content reveal inside the drawn frame
          if (onMaterialize) {
            onMaterialize();
          }

          // Dissolve wireframe box into final styled component
          setTimeout(() => {
            boxEl.classList.add('is-complete');
            setTimeout(() => {
              if (boxEl.parentNode) boxEl.parentNode.removeChild(boxEl);
              const idx = this.activeBoxes.indexOf(boxEl);
              if (idx !== -1) this.activeBoxes.splice(idx, 1);
            }, 450);
          }, 350);

          resolve(boxEl);
        }
      });
    });
  }

  clearAll() {
    this.activeBoxes.forEach(box => {
      if (box.parentNode) box.parentNode.removeChild(box);
    });
    this.activeBoxes = [];
  }
}
