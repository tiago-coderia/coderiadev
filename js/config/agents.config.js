/**
 * Coderia.dev — Core Builder Agents Configuration
 * Retains strictly the builder agents that actively construct the interface:
 * Grid, Layout, Texto, Cor, Foto, UI, Motion
 */

export const AGENT_PROFILES = [
  {
    id: 'grid',
    name: 'GRID',
    role: 'Bounding Boxes & Wireframes',
    color: '#3b82f6', // Blue
    initialPos: { x: 0.44, y: 0.42 },
    speed: 1.25,
    mobileActive: true
  },
  {
    id: 'layout',
    name: 'LAYOUT',
    role: 'Structure & Baseline',
    color: '#10b981', // Emerald Green
    initialPos: { x: 0.52, y: 0.40 },
    speed: 1.15,
    mobileActive: true
  },
  {
    id: 'texto',
    name: 'TEXTO',
    role: 'Headlines & Content Stream',
    color: '#06b6d4', // Cyan
    initialPos: { x: 0.48, y: 0.46 },
    speed: 1.3,
    mobileActive: true
  },
  {
    id: 'cor',
    name: 'COR',
    role: 'Gradients & Luminescence',
    color: '#a855f7', // Purple
    initialPos: { x: 0.42, y: 0.50 },
    speed: 1.2,
    mobileActive: true
  },
  {
    id: 'foto',
    name: 'FOTO',
    role: 'Project Cards & Media',
    color: '#f43f5e', // Rose
    initialPos: { x: 0.38, y: 0.48 },
    speed: 1.1,
    mobileActive: true
  },
  {
    id: 'ui',
    name: 'UI',
    role: 'Surfaces & Action Shapes',
    color: '#eab308', // Amber
    initialPos: { x: 0.54, y: 0.52 },
    speed: 1.15,
    mobileActive: true
  },
  {
    id: 'motion',
    name: 'MOTION',
    role: 'Spring Physics & Calibrations',
    color: '#f97316', // Vivid Orange
    initialPos: { x: 0.50, y: 0.56 },
    speed: 1.3,
    mobileActive: true
  }
];

export const CHOREOGRAPHY_CONFIG = {
  durationMultiplier: 1.0,
  mobileBreakpoint: 768,
  phases: {
    INITIALIZATION: { id: 1, name: 'INITIALIZATION', label: 'INIT' },
    HERO: { id: 2, name: 'HERO & SHOWCASE', label: 'HERO' },
    WORKFLOW: { id: 3, name: 'WORKFLOW AUTOMATIONS', label: 'WORKFLOW' },
    SERVICES: { id: 4, name: 'SERVICES SUITE', label: 'SERVICES' },
    CTA: { id: 5, name: 'CONTACT & PROPOSAL', label: 'CTA' },
    FOOTER: { id: 6, name: 'FOOTER & COMPLETION', label: 'FOOTER' }
  }
};
