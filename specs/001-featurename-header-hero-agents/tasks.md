# Tasks: Coderia.dev — Header & Hero Section with Swarm Multi-Agent System

**Feature Branch**: `001-featurename-header-hero-agents`
**Status**: Completed

---

## Task Group 1: Project Setup & Semantic HTML Foundation
- [x] T01-01: Initialize Spec Kit integration and structure
- [x] T01-02: Create directory structure (`assets/`, `css/`, `js/`, `js/config/`, `js/components/`, `js/agents/`, `js/animations/`)
- [x] T01-03: Create semantic `index.html` with header, navigation, hero section, cursor layer, and HUD indicator

## Task Group 2: CSS Architecture & Visual Identity
- [x] T02-01: Implement `css/reset.css`
- [x] T02-02: Implement `css/variables.css` with dark palette, typography, agent accents, and spacing tokens
- [x] T02-03: Implement `css/global.css` with subtle engineering grid background and base typography
- [x] T02-04: Implement `css/header.css` with typographic logo, desktop navigation, CTA, and mobile drawer
- [x] T02-05: Implement `css/hero.css` with balanced negative space, highlighted headline, badge, and CTA styling
- [x] T02-06: Implement `css/agents.css` with cursor SVG styling, agent pill labels, action badges, and HUD dev-tool component

## Task Group 3: JavaScript Core Configuration & Components
- [x] T03-01: Implement `js/config/agents.config.js` with 7 agent definitions, colors, task matrix, and coordinates
- [x] T03-02: Implement `js/components/navigation.js` for header scroll behavior and mobile menu toggle
- [x] T03-03: Implement `js/components/hero.js` for DOM node references and text span splitting for typography animation

## Task Group 4: Swarm Multi-Agent Cursor Engine
- [x] T04-01: Implement `js/agents/agent-cursor.js` for rendering SVG cursors, label tags, and state indicators
- [x] T04-02: Implement `js/agents/agent-movement.js` wrapping GSAP for natural curved trajectories, easing, and deceleration
- [x] T04-03: Implement `js/agents/agent-tasks.js` for tracking task states, execution queue, and calculating real completion %
- [x] T04-04: Implement `js/agents/agent-coordinator.js` to synchronize the 7 agents across the 6 construction phases
- [x] T04-05: Implement `js/agents/agent-engine.js` connecting all agent submodules and lifecycle events

## Task Group 5: Animation Choreography & Microinteractions
- [x] T05-01: Implement `js/animations/intro.js` for page boot and agent entry
- [x] T05-02: Implement `js/animations/hero-animation.js` synchronizing element construction with agent movements
- [x] T05-03: Implement `js/animations/transitions.js` with Motion One for button hovers and link micro-interactions
- [x] T05-04: Implement `js/main.js` bootstrapping the entire application with reduced-motion and viewport detection

## Task Group 6: Verification, Responsive Testing & Quality Assurance
- [x] T06-01: Validate all 14 acceptance criteria
- [x] T06-02: Test responsiveness across mobile, tablet, and desktop
- [x] T06-03: Test `prefers-reduced-motion` compliance
- [x] T06-04: Verify zero console errors and smooth 60 FPS animation execution
