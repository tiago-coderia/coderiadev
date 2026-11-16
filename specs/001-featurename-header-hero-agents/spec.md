# Feature Specification: Coderia.dev — In-View Trigger, Idle Mouse Orbit & Swarm Replay

**Feature Branch**: `001-featurename-header-hero-agents`
**Status**: Approved (Refined with In-View Trigger, Idle Mouse Ring & Replay Button)
**Input**: Four core behavioral refinements:
1. Strict in-view triggering (zero pre-execution off-screen).
2. Cursors start completely invisible and only fade in upon task execution.
3. In idle state, cursor text tags hide and the 14 pointers form an orbital ring following the user's cursor (matching user reference image).
4. On 100% completion, HUD and cursors disappear, revealing a floating Replay button that smoothly returns to top and restarts the swarm construction.

---

## 1. Acceptance Criteria

### Criteria 1: Strict In-View Triggering
- Swarm construction for any section (`#hero`, `#potencialize`, `#servicos`, `#contato`, `#site-footer`) ONLY fires when that section actually enters the browser's visible field of view (`rootMargin: 0px`, `threshold >= 0.2`).

### Criteria 2: Initial Invisibility
- Prior to section construction, agent cursors are completely invisible (`opacity: 0`).
- They fade in smoothly right at the moment they anchor and drag their first frame.

### Criteria 3: Idle Mouse Ring Orbit (Uploaded Spec Reference)
- When agents finish tasks for a section and enter IDLE:
  - Agent pills (`.agent-pill`) vanish (`opacity: 0`).
  - Only the 14 colored SVG arrow cursors remain.
  - They form an orbital ring of radius ~45px around the visitor's actual mouse cursor, rotating and trailing mouse movement smoothly.
- As soon as the user scrolls into the next section:
  - Idle orbit breaks; agents fly down to the section, their status pills re-appear, and they build the elements.

### Criteria 4: 100% Completion & Replay Experience
- When the entire page is 100% built:
  - The construction HUD bar smoothly transitions out.
  - All 14 agent cursors fade away.
  - A sleek floating "Reiniciar Construção" replay button emerges at the bottom-right.
- Clicking Replay:
  - Scrolls to top smoothly (`window.scrollTo({ top: 0, behavior: 'smooth' })`).
  - Resets all elements to initial hidden state.
  - Resets task progress and HUD to 0%.
  - Re-triggers the Swarm choreography from the beginning.
