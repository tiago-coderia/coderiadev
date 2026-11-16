# Implementation Plan: Coderia.dev — In-View Trigger, Idle Mouse Orbit & Swarm Replay

**Feature Branch**: `001-featurename-header-hero-agents`
**Status**: Ready
**Architecture Style**: Pure Vanilla Modular (HTML5 + CSS3 + ES6+ Modules + GSAP + Motion)

---

## 1. Technical Architecture Updates

### A. Strict Viewport Intersection Observer
- Configure `IntersectionObserver` with `rootMargin: '0px'`, `threshold: 0.2` (and `0.1` for footer).
- No section triggers until its bounds are inside the user's visible viewport.

### B. Mouse Orbit Following Engine (`js/agents/agent-movement.js` or `js/agents/agent-coordinator.js`)
- Track global mouse coordinates `(pageX, pageY)`.
- When `enterIdleMode()` is called:
  - Add class `.is-idle` to all active cursors (hides `.agent-pill` via CSS `opacity: 0; transform: scale(0.8)`).
  - Activate `requestAnimationFrame` loop that arranges the 14 agents in a 45px circle around `(pageX, pageY)`:
    - `angle = (i / 14) * 2 * PI + timeOffset`
    - Inward rotation: rotate each pointer SVG by `angle - PI/2` so pointers point directly at the user's mouse (matching user screenshot).
- When `exitIdleMode()` is called:
  - Stop RAF mouse follow loop.
  - Remove `.is-idle` class to reveal tags.

### C. Reset & Replay Lifecycle
- Add restart button in `index.html` (`#restart-experience-btn`).
- Style in `css/agents.css` (floating glass circle with SVG replay icon).
- In `agent-coordinator.js`, on 100% completion:
  - Fade out HUD (`#construction-hud`) and agents.
  - Fade in `#restart-experience-btn`.
  - Handle click on `#restart-experience-btn`: reset and replay.
