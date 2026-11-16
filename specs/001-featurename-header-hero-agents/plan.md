# Implementation Plan: Coderia.dev — Full-Site Scroll-Driven Swarm Construction

**Feature Branch**: `001-featurename-header-hero-agents`
**Status**: Ready
**Architecture Style**: Pure Vanilla Modular (HTML5 + CSS3 + ES6+ Modules + GSAP + Motion)

---

## 1. Technical Architecture & Modular Structure

### A. Section-by-Section Swarm Coordinator (`js/agents/agent-coordinator.js`)
Instead of a single one-off sequence, `AgentCoordinator` manages a scroll-triggered section state machine:
- Section 1: `buildHeaderAndHero()`
- Section 2: `buildWorkflowSection()`
- Section 3: `buildServicesSection()`
- Section 4: `buildCtaSection()`
- Section 5: `buildFooterSection()`

### B. Scroll Observer & Cursor Tracking
- Uses `IntersectionObserver` with threshold `0.15` and rootMargin `-50px`.
- When an unbuilt section enters view:
  1. The observer triggers the section's build choreography.
  2. The 14 agent cursors migrate smoothly to the target section in viewport coordinates.
  3. Wireframe boxes are dragged by `Grid`, content injected by `Texto`, images placed by `Foto`, icons mounted by `Ícones`, and validated by `QA`.
  4. HUD reflects the current section being built (e.g. `WORKFLOW SECTION: 42%`).

### C. Component Adaptation from `coderia.dev`
- **Header**: `logocompleta.svg`, nav links ("Porque IA?", "Serviços"), and email button with copy interaction.
- **Hero**: `logocoderia-v.svg`, headline `"Construindo Aplicações Web Inteligentes"`, description, `"Ver meus projetos"` CTA with "Em construção!" tooltip, and `wallpaper2.png` frame.
- **Workflow (`#potencialize`)**: 4 project cards with images `card1.jpg`, `card2.jpg`, `card3.jpg`, `card4.jpg` and N8N/AI workflow copy.
- **Services (`#servicos`)**: 3 cards with `icon1.svg`, `icon2.svg`, `icon3.svg` and fullstack/IA copy.
- **CTA (`#contato`)**: `"Pronto para construir algo incrível?"` with email copy button.
- **Footer**: `logocompleta.svg`, `logocoderia-v.svg`, social links.
