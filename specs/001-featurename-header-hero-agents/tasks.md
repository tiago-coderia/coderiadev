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

## Task Group 3: Verification & Git Commit
- [x] T03-01: Verify in-view trigger behavior on scroll
- [x] T03-02: Verify idle mouse-following ring and inward rotation
- [x] T03-03: Verify 100% completion cleanup and restart functionality
- [x] T03-04: Commit changes with git
