# Tasks: Coderia.dev — Full-Site Scroll-Driven Swarm Construction

**Feature Branch**: `001-featurename-header-hero-agents`
**Status**: Completed (Document-Anchored Coordinates & Full Footer Support)

---

## Task Group 1: HTML Semantic Foundation & Full Content Adaptation
- [x] T01-01: Update `index.html` with all sections from `coderia.dev` (Header, Hero with n8n showcase, Workflow cards, Services cards, CTA, Footer)
- [x] T01-02: Adapt CSS files (`css/global.css`, `css/header.css`, `css/hero.css`, `css/sections.css`, `css/agents.css`) to match the palette and typography from `coderia.dev` (`#1a1823`, `#232030`, `#17151e`, `#e0ddef`, `#a995c9`)

## Task Group 2: Swarm Engine & Scroll Observer
- [x] T02-01: Update `js/agents/agent-tasks.js` to track all 5 site sections with cumulative progress (0% -> 100%)
- [x] T02-02: Implement scroll trigger observer in `js/agents/agent-coordinator.js` to activate Swarm construction when each section is scrolled into view
- [x] T02-03: Implement concurrent multi-agent assembly routines for Workflow, Services, CTA, and Footer

## Task Group 3: Document Anchoring & Scroll Stabilization
- [x] T03-01: Shift `#agents-layer` from `position: fixed` to `position: absolute` in document space so bounding boxes stay 100% glued to elements during scroll
- [x] T03-02: Update `getElementBox` and `getElementAnchor` in `js/components/hero.js` to incorporate `window.scrollX` and `window.scrollY`
- [x] T03-03: Fix Footer build sequence with bottom-of-page scroll listener, positive rootMargin, and full container framing

## Task Group 4: Interactive Features & Verification
- [x] T04-01: Implement "Entre em contato" email copy behavior with tooltip feedback
- [x] T04-02: Test smooth scroll behavior and cursor migration across viewport heights
- [x] T04-03: Commit changes with git
