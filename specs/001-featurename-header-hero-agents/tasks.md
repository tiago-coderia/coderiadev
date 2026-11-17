# Tasks: Coderia.dev — In-View Trigger, Idle Mouse Orbit & Swarm Replay

**Feature Branch**: `001-featurename-header-hero-agents`
**Status**: Completed

---

## Task Group 1: Visibility & Idle Mouse Orbit Engine
- [x] T01-01: Update `css/agents.css` to hide agent pills during `.is-idle`, hide cursors initially (`opacity: 0`), and style `#restart-experience-btn`
- [x] T01-02: Add `#restart-experience-btn` in `index.html` with SVG replay icon and tooltip
- [x] T01-03: Implement mouse-trailing inward orbital ring physics in `js/agents/agent-movement.js` matching user screenshot

## Task Group 2: Strict In-View Triggering & Completion Lifecycle
- [x] T02-01: Update `IntersectionObserver` in `js/agents/agent-coordinator.js` with `rootMargin: '0px'` and strict visible threshold
- [x] T02-02: Implement completion transition: hide HUD and cursors, fade in replay button
- [x] T02-03: Implement replay button click handler (scroll to top, reset DOM and task states, restart swarm)

## Task Group 3: 7 Builder Agents & Smooth Trajectories
- [x] T03-01: Reduce roster to 7 pure builder specialists (`grid`, `layout`, `texto`, `cor`, `foto`, `ui`, `motion`) in `agents.config.js` and `agent-tasks.js`
- [x] T03-02: Fix scroll-freeze bug with live `window.scrollY` sampling on every frame in `agent-movement.js`
- [x] T03-03: Implement smooth departure from orbit to element anchor and smooth return back into orbit in `agent-box-drawer.js` and `agent-movement.js`
- [x] T03-04: Wire all 5 sections in `agent-coordinator.js` to utilize the 7 builder specialists without interrupting orbit for idle agents

## Task Group 4: Wireframe-First, Word-by-Word Typing & Screen Scatter
- [x] T04-01: Enforce strict wireframe-first appearance (content stays 100% hidden until wireframe finishes drawing)
- [x] T04-02: Implement `typeTextWords` word-by-word realistic typing engine with live `texto` cursor position tracking
- [x] T04-03: Implement `scatterAcrossScreen` at 100% completion (cursors fly to screen margins and stop mouse-tracking)
- [x] T04-04: Implement smooth center regrouping and scroll-to-top on replay restart
