# Tasks: Coderia.dev — Header & Hero Section with Swarm Multi-Agent System

**Feature Branch**: `001-featurename-header-hero-agents`
**Status**: Completed (Wireframe Bounding Box Drawing Engine Integrated)

---

## Task Group 1: Project Setup & Semantic HTML Foundation
- [x] T01-01: Initialize Spec Kit integration and structure
- [x] T01-02: Create directory structure
- [x] T01-03: Create semantic `index.html`

## Task Group 2: CSS Architecture & Visual Identity
- [x] T02-01: Implement `css/reset.css`
- [x] T02-02: Implement `css/variables.css`
- [x] T02-03: Implement `css/global.css`
- [x] T02-04: Implement `css/header.css`
- [x] T02-05: Implement `css/hero.css`
- [x] T02-06: Enhance `css/agents.css` with Figma-style wireframe bounding boxes, corner handles, dimension badges, and materialization animations

## Task Group 3: JavaScript Core Configuration & Components
- [x] T03-01: Implement `js/config/agents.config.js`
- [x] T03-02: Implement `js/components/navigation.js`
- [x] T03-03: Implement `js/components/hero.js` with target bounding box getters (`getTargetBoxes()`)

## Task Group 4: Swarm Multi-Agent Cursor Engine & Bounding Box Drawer
- [x] T04-01: Implement `js/agents/agent-cursor.js`
- [x] T04-02: Implement `js/agents/agent-movement.js`
- [x] T04-03: Create `js/agents/agent-box-drawer.js` for dragging and sizing real-time wireframe bounding boxes with live dimensions
- [x] T04-04: Update `js/agents/agent-coordinator.js` to execute box-drawing drags for each UI element before reveal
- [x] T04-05: Update `js/agents/agent-engine.js` with boxDrawer lifecycle management

## Task Group 5: Verification & Testing
- [x] T05-01: Verify visual box drag, dimensions update, and element materialization
- [x] T05-02: Verify responsive behavior and mobile culling
- [x] T05-03: Commit changes with git
