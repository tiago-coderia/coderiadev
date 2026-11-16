# Implementation Plan: Coderia.dev — Header & Hero Section with Swarm Multi-Agent System

**Feature Branch**: `001-featurename-header-hero-agents`
**Status**: In Progress (Adding Wireframe Box Drawing Engine)
**Architecture Style**: Pure Vanilla Modular (HTML5 + CSS3 + ES6+ Modules + GSAP + Motion)

---

## 1. Technical Architecture & Separation of Concerns

### Wireframe Bounding Box Drawing System
To match the signature Swarm Rebuild / multiplayer design tool aesthetic:
1. **Dynamic Bounding Box Creation (`js/agents/agent-box-drawer.js`)**:
   - Manages interactive canvas/DOM wireframe boxes:
     - Outer container placed in `#agents-layer`.
     - Styling: `border: 1px dashed <agent-color>`, `background: rgba(<agent-color>, 0.08)`.
     - 4 corner handles (`width: 5px, height: 5px`, matching design tools like Figma).
     - Floating dimension / tag badge: e.g. `<h1.hero-headline> 840×120` positioned above top-left corner.
2. **Coordinated Drag Animation**:
   - Cursor starts at element's `(rect.left, rect.top)`.
   - Cursor drags to `(rect.right, rect.bottom)` using GSAP tween.
   - On each frame of the tween (`onUpdate`), the box's `width` and `height` update to track the cursor's current position, and the dimension label updates its pixel values dynamically!
   - When the drag finishes, the target DOM element inside the page is revealed, and the dashed wireframe box fades out smoothly.

### Updated File Structure
```text
coderia/
│
├── css/
│   ├── ...
│   └── agents.css               # Added wireframe bounding box, corner handles, dimension chips
│
└── js/
    ├── agents/
    │   ├── agent-engine.js      # Mounts box drawer & agents
    │   ├── agent-box-drawer.js  # Dedicated engine for creating, dragging, and sizing wireframe boxes
    │   ├── agent-cursor.js
    │   ├── agent-movement.js
    │   ├── agent-tasks.js
    │   └── agent-coordinator.js # Coordinates drag-box creation before revealing each element
    └── ...
```
