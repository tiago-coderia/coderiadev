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

## Task Group 5: Highlight Gradient Fix & Alt+Drag Clone Animations
- [x] T05-01: Fix obscured text clipping on `.headline-highlight` ("Web Inteligentes") ensuring vivid, crisp luminescence
- [x] T05-02: Implement `cloneAndDrag` in `AgentBoxDrawer` for Figma-style [Alt+Drag] component cloning
- [x] T05-03: Orchestrate Workflow section: Build Card 1 -> type copy -> clone Card 2 -> type copy -> clone Cards 3 & 4 -> type copy
- [x] T05-04: Orchestrate Services section: One card at a time with icon insertion, typing copy, and drag-cloning sequentially

## Task Group 6: Headline Letter-by-Letter Typewriter & First Section Scatter
- [x] T06-01: Implement `prepareHeadlineForTyping` and `typeHeadlineCharacters` for genuine character-by-character typewriter writing (36ms/char)
- [x] T06-02: Synchronize live cursor position tracking with the writing agent (`TEXTO`) across each typed character
- [x] T06-03: Implement `scatterInFirstSection` on 100% build completion: auto-scroll to `#hero` and distribute cursors across the first section around headline, symbol, CTA, and showcase frame
- [x] T06-04: Connect replay restart button to regroup cursors at hero center and replay full sequence cleanly

## Task Group 7: Complete Headline Typing Sequence & Deferred Glow Effect
- [x] T07-01: Isolate `#headline-main` ("Construindo Aplicações") and `#headline-highlight` ("Web Inteligentes") with individual wireframe bounding boxes
- [x] T07-02: Type "Construindo Aplicações" letter-by-letter with cursor tracking
- [x] T07-03: Draw selection box on `boxes.headlineHighlight()` before typing "Web Inteligentes"
- [x] T07-04: Type "Web Inteligentes" letter-by-letter as clean white text (no instant appearance, no pre-rendered glow/gradient/underline)
- [x] T07-05: Apply glow effect at the end via `agent: cor`: activate `.has-glow`, gradient fill, text-shadow bloom, and expanding underline

## Task Group 8: Preloader, Scroll 0, Centered Builder Bar & Viewport-Focused Swarm
- [x] T08-01: Implement high-tech `#site-preloader` with pulsing Coderia symbol and gradient progress bar, hiding all site elements during load
- [x] T08-02: Enforce instant `window.scrollTo(0, 0)` with `history.scrollRestoration = 'manual'` so the page always starts at the top
- [x] T08-03: Center builder bar (`.construction-hud`) at the bottom of the viewport (`left: 50%; transform: translateX(-50%)`) across desktop and mobile
- [x] T08-04: Implement dynamic `getSectionInFocus()` and responsive section switching in `AgentCoordinator` so the swarm immediately constructs whichever section is currently in view (e.g. scrolling directly to footer constructs footer first)
