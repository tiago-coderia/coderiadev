# CODERIA.DEV — HEADER & HERO SECTION

> **"Digital experiences engineered with intelligence."**

Institutional website for **Coderia.dev** featuring a high-precision, multi-agent autonomous cursor swarm that visually constructs the interface in real time (inspired by Dhvanil Patel's *SWARM Rebuild* concept, implemented as an original native architecture).

Project structured and managed using **GitHub Spec Kit** (`specify`).

---

## 🚀 Key Features

1. **Swarm Multi-Agent Engine**:
   - 7 autonomous agent cursors with distinct specializations, SVG pointers, dynamic status pills, and physics:
     - 🔵 **ARCHITECT** (`#3b82f6`): Architecture & structural blueprint framing
     - 🟣 **DESIGNER** (`#a855f7`): Visual design & typography highlight polish
     - 🌸 **TYPOGRAPHY** (`#ec4899`): Typography composing & headline writing
     - 🟢 **LAYOUT** (`#10b981`): Layout engineering & navigation alignment
     - 🟠 **MOTION** (`#f97316`): Motion design & CTA microinteraction calibration
     - 🔷 **FRONTEND** (`#06b6d4`): Frontend development & DOM component anchoring
     - 🔴 **QA** (`#ef4444`): Quality assurance & geometric/navigational audit
2. **6-Phase Construction Choreography**:
   - **Phase 01 — Initialization**: Agent swarm emerges with spring scaling from center.
   - **Phase 02 — Structure**: Blueprint lines sweep across; header and logo are anchored.
   - **Phase 03 — Typography**: Eyebrow badge and headline appear; designer polishes highlight.
   - **Phase 04 — Visual Engineering**: Supporting copy renders; motion agent tests CTAs.
   - **Phase 05 — Quality Assurance**: QA audits navigation, validates layout, certifies system badge.
   - **Phase 06 — Completion**: Swarm reaches 100%, transitions to ambient idle drift; interface ready.
3. **Real-time Dev-Tool Construction HUD**:
   - Displays live task progress (`0%` -> `100%`), phase labels, and active agent count.
   - Progress bar updates strictly from authentic completed tasks, not random timers.
4. **Header & Navigation**:
   - Typographic logo `<coderia.dev>`, semantic navigation links, responsive mobile drawer, microinteractive "Let's Talk" CTA.
5. **Hero Section**:
   - Impactful typography, highlighted phrase *"digital experiences"*, supporting copy, dual CTAs, and engineering specification badge (`DESIGNING • ENGINEERING • BUILDING`).
6. **Accessibility & Responsiveness**:
   - Full support for `prefers-reduced-motion` (instantly displays final UI without motion).
   - Mobile agent culling: viewports ≤ 768px automatically reduce active agents from 7 to 3 to prevent visual clutter while preserving the swarm experience.
   - Strict `pointer-events: none` on cursor canvas ensures zero interference with user clicks.

---

## 🛠️ Technology Stack

- **HTML5 & CSS3**: Pure semantic markup and native CSS variables (no Tailwind, Bootstrap, or CSS frameworks).
- **JavaScript ES6+**: 100% native ES Modules (no React, Next.js, Vue, Angular, Svelte, or bundlers).
- **GSAP 3.12+**: Coordinated multi-agent pathing, easing, and sequential phase orchestration.
- **Motion (One)**: Spring physics for interactive CTA hover states and link microinteractions.

---

## 📂 Project Architecture

```text
coderia/
│
├── index.html                   # Semantic HTML5 entry
├── README.md                    # Project documentation
│
├── .specify/                    # GitHub Spec Kit infrastructure
│   ├── templates/
│   ├── workflows/
│   └── scripts/
│
├── specs/                       # Spec Kit Feature Specifications
│   └── 001-featurename-header-hero-agents/
│       ├── spec.md              # Functional specifications & acceptance criteria
│       ├── plan.md              # Architectural & implementation plan
│       └── tasks.md             # Ordered task breakdown
│
├── assets/
│   ├── fonts/
│   ├── images/
│   └── icons/
│
├── css/
│   ├── reset.css                # CSS reset
│   ├── variables.css            # Dark mode tokens & agent color definitions
│   ├── global.css               # Engineering grid background & buttons
│   ├── header.css               # Header layout, logo, desktop nav, mobile drawer
│   ├── hero.css                 # Hero typography, badge, CTAs, blueprint guides
│   └── agents.css               # Cursors, agent pills, action badges, dev HUD
│
└── js/
    ├── main.js                  # Application bootstrap
    │
    ├── config/
    │   └── agents.config.js     # Agent profiles, colors, coordinates, phases
    │
    ├── components/
    │   ├── navigation.js        # Mobile drawer & scroll listener
    │   └── hero.js              # Target coordinate resolution
    │
    ├── agents/
    │   ├── agent-engine.js      # Agent lifecycle manager & mobile culling
    │   ├── agent-cursor.js      # SVG cursor & dynamic tag renderer
    │   ├── agent-movement.js    # GSAP velocity & ambient drift engine
    │   ├── agent-tasks.js       # Authentic task completion & HUD updater
    │   └── agent-coordinator.js # 6-phase master choreo coordinator
    │
    └── animations/
        ├── intro.js             # Initial grid & backdrop reveal
        ├── hero-animation.js    # Synchronized DOM element reveals
        └── transitions.js       # Motion One spring microinteractions
```

---

## 💻 How to Run

Because native JavaScript ES Modules require HTTP/HTTPS origin (due to browser CORS security for local modules), serve the project directory with any static server:

```bash
# Using Python:
python -m http.server 3000

# Using Node / npx:
npx serve .

# Or using VS Code "Live Server" extension:
Right-click index.html -> "Open with Live Server"
```

Then open `http://localhost:3000` in any modern web browser.
