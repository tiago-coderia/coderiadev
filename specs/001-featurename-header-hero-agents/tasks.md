# Tasks: Coderia.dev — Full-Site Scroll-Driven Swarm Construction

**Feature Branch**: `001-featurename-header-hero-agents`
**Status**: Completed (Adapted from `coderia.dev` with Scroll-Triggered Section Swarm)

---

## Task Group 1: HTML Semantic Foundation & Full Content Adaptation
- [x] T01-01: Update `index.html` with all sections from `coderia.dev` (Header, Hero with n8n showcase, Workflow cards, Services cards, CTA, Footer)
- [x] T01-02: Adapt CSS files (`css/global.css`, `css/header.css`, `css/hero.css`, `css/sections.css`, `css/agents.css`) to match the palette and typography from `coderia.dev` (`#1a1823`, `#232030`, `#17151e`, `#e0ddef`, `#a995c9`)

## Task Group 2: Swarm Engine & Scroll Observer
- [x] T02-01: Update `js/agents/agent-tasks.js` to track all 5 site sections with cumulative progress (0% -> 100%)
- [x] T02-02: Implement scroll trigger observer in `js/agents/agent-coordinator.js` to activate Swarm construction when each section is scrolled into view
- [x] T02-03: Implement concurrent multi-agent assembly routines for Workflow, Services, CTA, and Footer

## Task Group 3: Interactive Features & Verification
- [x] T03-01: Implement "Entre em contato" email copy behavior with tooltip feedback
- [x] T03-02: Test smooth scroll behavior and cursor migration across viewport heights
- [x] T03-03: Commit changes with git
