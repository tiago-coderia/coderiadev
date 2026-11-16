# Feature Specification: Coderia.dev — Full-Site Scroll-Driven Swarm Construction

**Feature Branch**: `001-featurename-header-hero-agents`
**Status**: Approved (Adapted from `coderia.dev` with Scroll-Triggered Section Swarm)
**Input**: Comprehensive adaptation of the complete `coderia.dev` website (Header, Hero, Workflow, Services, CTA, Footer) built dynamically on scroll by the 14-agent Swarm.

---

## 1. Executive Summary & Concept

Coderia.dev's complete web presence (adapted from the existing Next.js layout in `coderia.dev/`) is transformed into a continuous, scroll-driven multi-agent construction experience.

As the visitor traverses the page:
1. **Initial Viewport (Header & Hero)**:
   - The 14-agent Swarm constructs the Header with `logocompleta.svg` and navigation.
   - The Swarm builds the Hero with `logocoderia-v.svg`, `"Construindo Aplicações Web Inteligentes"`, subtitle, `"Ver meus projetos"` CTA, and the `wallpaper2.png` n8n showcase frame.
2. **Scroll to Workflow (`#potencialize`)**:
   - Swarm agents descend smoothly into the Workflow section.
   - `Grid` draws wireframe boxes for the 4 project cards; `Foto` mounts `card1.jpg`, `card2.jpg`, `card3.jpg`, `card4.jpg`; `Texto` and `Tipo` write titles/descriptions; `UI` and `CSS` shape card elevations; `Teste` and `QA` audit the cards.
3. **Scroll to Services (`#servicos`)**:
   - Swarm descends to the Services grid.
   - `Grid` frames the 3 service cards; `Ícones` mounts `icon1.svg`, `icon2.svg`, `icon3.svg`; `Texto` types `"IA e aprendizado de máquina"`, `"Automação N8N"`, `"Desenvolvimento FullStack"`.
4. **Scroll to CTA (`#contato`)**:
   - Swarm descends to the Call To Action section.
   - `Grid` frames container and button; `Texto` streams `"Pronto para construir algo incrível?"`; `Form` and `Motion` rig the interactive email copy tooltip (`hello@coderia.dev`).
5. **Scroll to Footer**:
   - Swarm frames footer baseline, mounts `logocompleta.svg`, `logocoderia-v.svg`, and LinkedIn/GitHub links.

---

## 2. Scroll-Driven Section State Machine

Each section follows an `unbuilt -> building -> ready` lifecycle:
- Unbuilt sections start with unrevealed elements (or initial wireframe placement placeholders).
- When a section enters the viewport (via `IntersectionObserver`), its dedicated Swarm construction routine is invoked.
- The 14 agent cursors smoothly scroll/fly down to that section's coordinates, drawing bounding boxes, injecting texts/assets, and validating layout.
- Once completed, the section marks itself as `built`, allowing standard user interaction and hover states.
- The HUD tracks total site progress across all 5 sections (0% to 100%).
