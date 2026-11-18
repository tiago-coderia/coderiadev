/**
 * Coderia.dev — Agent Wireframe Box Drawer & Component Clone Engine
 * Creates real-time bounding boxes drawn by agent cursors, and coordinates
 * interactive Figma-style [Alt+Drag] duplication of components across grid slots.
 */

export class AgentBoxDrawer {
  constructor(container, movement = null) {
    this.container = container || document.getElementById('agents-layer');
    this.movement = movement;
    this.activeBoxes = [];
    this.activeTweens = new Set();
    this.activeTimers = new Set();
  }

  scheduleTimer(fn, ms) {
    const id = setTimeout(() => {
      this.activeTimers.delete(id);
      fn();
    }, ms);
    this.activeTimers.add(id);
    return id;
  }

  trackTween(tween) {
    if (!tween) return tween;
    this.activeTweens.add(tween);
    return tween;
  }

  untrackTween(tween) {
    if (tween) this.activeTweens.delete(tween);
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
   * Coordinated box drawing:
   * 1. Agent smoothly leaves mouse orbit and flies to element top-left anchor.
   * 2. Agent drags down-right, physically drawing out the bounding box frame in real time.
   * 3. Target content materializes inside the frame and the wireframe dissolves.
   * 4. Agent smoothly returns back into the mouse orbit.
   */
  async drawBox({ agent, box, tagName = 'div', duration = 0.75, onMaterialize = null, returnToOrbit = true, shouldAbort = null }) {
    const gsap = window.gsap;
    const isAborted = () => Boolean(shouldAbort && shouldAbort());
    if (isAborted()) return null;

    if (!this.container || !agent || !box) {
      if (onMaterialize && !isAborted()) onMaterialize();
      return null;
    }

    if (this.movement) {
      this.movement.leaveOrbit(agent);
    }

    const color = agent.profile.color;
    const startX = box.left;
    const startY = box.top;
    const targetX = box.right;
    const targetY = box.bottom;

    agent.setVisible(true);
    agent.setIdle(false);
    agent.setAction('APPROACHING', 'is-selecting');

    const dist = Math.hypot(startX - agent.x, startY - agent.y);
    const travelDuration = Math.min(0.52, Math.max(0.24, dist / 2200)) / (agent.profile.speed || 1);

    await new Promise(res => {
      if (isAborted()) { res(); return; }
      if (!gsap) {
        agent.setPosition(startX, startY);
        res();
        return;
      }

      gsap.killTweensOf(agent);
      let tween = null;
      tween = this.trackTween(gsap.to(agent, {
        x: startX,
        y: startY,
        duration: travelDuration,
        ease: 'power2.out',
        onUpdate: () => agent.setPosition(agent.x, agent.y),
        onInterrupt: () => {
          this.untrackTween(tween);
          res();
        },
        onComplete: () => {
          this.untrackTween(tween);
          if (!isAborted()) agent.setAction('ANCHORING', 'is-selecting');
          res();
        }
      }));
    });

    if (isAborted()) return null;

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

    ['tl', 'tr', 'bl', 'br'].forEach(corner => {
      const handle = document.createElement('span');
      handle.className = `wireframe-handle handle-${corner}`;
      handle.style.borderColor = color;
      boxEl.appendChild(handle);
    });

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

    agent.setAction('DRAWING BOX', 'is-selecting');

    await new Promise(resolve => {
      if (isAborted()) {
        if (boxEl.parentNode) boxEl.parentNode.removeChild(boxEl);
        resolve(null);
        return;
      }

      if (!gsap) {
        boxEl.style.width = `${box.width}px`;
        boxEl.style.height = `${box.height}px`;
        agent.setPosition(targetX, targetY);
        if (onMaterialize && !isAborted()) onMaterialize();
        this.scheduleTimer(() => {
          boxEl.classList.add('is-complete');
          this.scheduleTimer(() => {
            if (boxEl.parentNode) boxEl.parentNode.removeChild(boxEl);
          }, 400);
          resolve(boxEl);
        }, 300);
        return;
      }

      gsap.killTweensOf(agent);
      let tween = null;
      tween = this.trackTween(gsap.to(agent, {
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
        onInterrupt: () => {
          this.untrackTween(tween);
          if (boxEl.parentNode) boxEl.parentNode.removeChild(boxEl);
          resolve(null);
        },
        onComplete: () => {
          this.untrackTween(tween);
          if (isAborted()) {
            if (boxEl.parentNode) boxEl.parentNode.removeChild(boxEl);
            resolve(null);
            return;
          }

          boxEl.style.width = `${box.width}px`;
          boxEl.style.height = `${box.height}px`;
          if (dimEl) {
            dimEl.textContent = `${Math.round(box.width)} × ${Math.round(box.height)}`;
          }

          agent.setAction('MATERIALIZING', 'is-typing');

          if (onMaterialize) {
            onMaterialize();
          }

          this.scheduleTimer(() => {
            boxEl.classList.add('is-complete');
            this.scheduleTimer(() => {
              if (boxEl.parentNode) boxEl.parentNode.removeChild(boxEl);
              const idx = this.activeBoxes.indexOf(boxEl);
              if (idx !== -1) this.activeBoxes.splice(idx, 1);
            }, 400);
          }, 300);

          resolve(boxEl);
        }
      }));
    });

    if (isAborted()) return null;

    if (returnToOrbit && this.movement) {
      await new Promise(r => this.scheduleTimer(r, 160));
      if (!isAborted()) {
        this.movement.returnToOrbit(agent);
      }
    }

    return boxEl;
  }

  /**
   * Interactive Figma-style Duplicate (Alt+Drag):
   * 1. Agent approaches fromBox to select source component.
   * 2. Creates a glowing clone ghost box matching component dimensions.
   * 3. Drags the clone box AND cursor together across to toBox.
   * 4. Snaps into place at toBox, invokes onLand callback to materialize target, and dissolves clone.
   */
  async cloneAndDrag({ agent, fromBox, toBox, tagName = '<clone.duplicate [Alt+Drag]>', duration = 0.7, onLand = null, returnToOrbit = true, shouldAbort = null }) {
    const gsap = window.gsap;
    const isAborted = () => Boolean(shouldAbort && shouldAbort());
    if (isAborted()) return null;

    if (!this.container || !agent || !fromBox || !toBox) {
      if (onLand && !isAborted()) onLand();
      return null;
    }

    if (this.movement) {
      this.movement.leaveOrbit(agent);
    }

    const color = agent.profile.color;
    agent.setVisible(true);
    agent.setIdle(false);
    agent.setAction('SELECTING', 'is-selecting');

    const startX = fromBox.left;
    const startY = fromBox.top;
    const endX = toBox.left;
    const endY = toBox.top;

    // 1. Move to source box top-left
    const distToSource = Math.hypot(startX - agent.x, startY - agent.y);
    const approachDuration = Math.min(0.45, Math.max(0.2, distToSource / 2400)) / (agent.profile.speed || 1);

    await new Promise(res => {
      if (isAborted()) { res(); return; }
      if (!gsap) {
        agent.setPosition(startX, startY);
        res();
        return;
      }
      gsap.killTweensOf(agent);
      let tween = null;
      tween = this.trackTween(gsap.to(agent, {
        x: startX,
        y: startY,
        duration: approachDuration,
        ease: 'power2.out',
        onUpdate: () => agent.setPosition(agent.x, agent.y),
        onInterrupt: () => {
          this.untrackTween(tween);
          res();
        },
        onComplete: () => {
          this.untrackTween(tween);
          res();
        }
      }));
    });

    if (isAborted()) return null;

    // 2. Create the clone ghost frame
    const cloneBox = document.createElement('div');
    cloneBox.className = 'wireframe-clone-box';
    cloneBox.style.left = `${startX}px`;
    cloneBox.style.top = `${startY}px`;
    cloneBox.style.width = `${fromBox.width}px`;
    cloneBox.style.height = `${fromBox.height}px`;
    cloneBox.style.borderColor = color;
    cloneBox.style.backgroundColor = this.hexToRgba(color, 0.12);

    ['tl', 'tr', 'bl', 'br'].forEach(corner => {
      const handle = document.createElement('span');
      handle.className = `wireframe-handle handle-${corner}`;
      handle.style.borderColor = color;
      cloneBox.appendChild(handle);
    });

    const tagEl = document.createElement('div');
    tagEl.className = 'wireframe-tag';
    tagEl.style.borderColor = color;
    tagEl.innerHTML = `
      <span class="wireframe-tag-name" style="color: ${color}">${tagName}</span>
      <span class="wireframe-tag-dim">${Math.round(toBox.width)} × ${Math.round(toBox.height)}</span>
    `;
    cloneBox.appendChild(tagEl);

    this.container.appendChild(cloneBox);
    this.activeBoxes.push(cloneBox);

    // 3. Drag clone to target slot
    agent.setAction('CLONING [ALT+DRAG]', 'is-typing');

    await new Promise(resolve => {
      if (isAborted()) {
        if (cloneBox.parentNode) cloneBox.parentNode.removeChild(cloneBox);
        resolve();
        return;
      }

      if (!gsap) {
        cloneBox.style.left = `${endX}px`;
        cloneBox.style.top = `${endY}px`;
        agent.setPosition(endX, endY);
        if (onLand && !isAborted()) onLand();
        cloneBox.classList.add('is-complete');
        this.scheduleTimer(() => {
          if (cloneBox.parentNode) cloneBox.parentNode.removeChild(cloneBox);
        }, 300);
        resolve();
        return;
      }

      const dragObj = { x: startX, y: startY };
      let tween = null;
      tween = this.trackTween(gsap.to(dragObj, {
        x: endX,
        y: endY,
        duration: duration / (agent.profile.speed || 1),
        ease: 'power2.inOut',
        onUpdate: () => {
          cloneBox.style.left = `${dragObj.x}px`;
          cloneBox.style.top = `${dragObj.y}px`;
          agent.setPosition(dragObj.x, dragObj.y);
        },
        onInterrupt: () => {
          this.untrackTween(tween);
          if (cloneBox.parentNode) cloneBox.parentNode.removeChild(cloneBox);
          resolve();
        },
        onComplete: () => {
          this.untrackTween(tween);
          if (isAborted()) {
            if (cloneBox.parentNode) cloneBox.parentNode.removeChild(cloneBox);
            resolve();
            return;
          }

          cloneBox.classList.add('is-snapping');
          agent.setAction('DROPPED', 'is-selecting');

          if (onLand) onLand();

          this.scheduleTimer(() => {
            cloneBox.classList.add('is-complete');
            this.scheduleTimer(() => {
              if (cloneBox.parentNode) cloneBox.parentNode.removeChild(cloneBox);
              const idx = this.activeBoxes.indexOf(cloneBox);
              if (idx !== -1) this.activeBoxes.splice(idx, 1);
            }, 350);
          }, 150);

          resolve();
        }
      }));
    });

    if (isAborted()) return null;

    if (returnToOrbit && this.movement) {
      await new Promise(r => this.scheduleTimer(r, 160));
      if (!isAborted()) {
        this.movement.returnToOrbit(agent);
      }
    }
  }

  clearAll() {
    this.activeTimers.forEach(id => clearTimeout(id));
    this.activeTimers.clear();

    this.activeTweens.forEach(tween => {
      if (tween && tween.kill) tween.kill();
    });
    this.activeTweens.clear();

    this.activeBoxes.forEach(box => {
      if (box.parentNode) box.parentNode.removeChild(box);
    });
    this.activeBoxes = [];
  }
}
