/**
 * Coderia.dev — Agents Configuration
 * Defines agent profiles, color palettes, motion parameters, and phases
 */

export const AGENT_PROFILES = [
  {
    id: 'architect',
    name: 'ARCHITECT',
    role: 'Architecture',
    color: '#3b82f6',
    initialPos: { x: 0.48, y: 0.46 },
    speed: 1.0,
    mobileActive: true
  },
  {
    id: 'designer',
    name: 'DESIGNER',
    role: 'Visual Design',
    color: '#a855f7',
    initialPos: { x: 0.52, y: 0.48 },
    speed: 0.95,
    mobileActive: false
  },
  {
    id: 'typography',
    name: 'TYPOGRAPHY',
    role: 'Typography',
    color: '#ec4899',
    initialPos: { x: 0.45, y: 0.52 },
    speed: 1.1,
    mobileActive: false
  },
  {
    id: 'layout',
    name: 'LAYOUT',
    role: 'Layout Engineering',
    color: '#10b981',
    initialPos: { x: 0.54, y: 0.52 },
    speed: 1.05,
    mobileActive: false
  },
  {
    id: 'motion',
    name: 'MOTION',
    role: 'Motion Design',
    color: '#f97316',
    initialPos: { x: 0.47, y: 0.55 },
    speed: 1.15,
    mobileActive: false
  },
  {
    id: 'frontend',
    name: 'FRONTEND',
    role: 'Frontend Development',
    color: '#06b6d4',
    initialPos: { x: 0.51, y: 0.44 },
    speed: 1.0,
    mobileActive: true
  },
  {
    id: 'qa',
    name: 'QA',
    role: 'Quality Assurance',
    color: '#ef4444',
    initialPos: { x: 0.53, y: 0.56 },
    speed: 1.2,
    mobileActive: true
  }
];

export const CHOREOGRAPHY_CONFIG = {
  // Configurable duration factor (1.0 = standard balanced pacing, ~10s total)
  durationMultiplier: 1.0,
  
  // Mobile threshold below which non-essential agents are culled
  mobileBreakpoint: 768,

  // Phases in strict sequential order
  phases: {
    INITIALIZATION: {
      id: 1,
      name: 'INITIALIZATION',
      label: 'INIT',
      targetPercent: 15
    },
    STRUCTURE: {
      id: 2,
      name: 'STRUCTURE',
      label: 'STRUCT',
      targetPercent: 35
    },
    TYPOGRAPHY: {
      id: 3,
      name: 'TYPOGRAPHY',
      label: 'TYPE',
      targetPercent: 60
    },
    VISUAL_ENGINEERING: {
      id: 4,
      name: 'VISUAL ENGINEERING',
      label: 'VISUAL',
      targetPercent: 80
    },
    QUALITY_ASSURANCE: {
      id: 5,
      name: 'QUALITY ASSURANCE',
      label: 'QA CHECK',
      targetPercent: 95
    },
    COMPLETION: {
      id: 6,
      name: 'COMPLETION',
      label: 'READY',
      targetPercent: 100
    }
  }
};
