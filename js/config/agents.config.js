/**
 * Coderia.dev — 14-Agent Swarm Configuration
 * Defines profiles, colors, velocities, and initial coordinates for the 14 specialist agents:
 * 'Layout', 'Tipo', 'Cor', 'Grid', 'Foto', 'Texto', 'UI', 'Dados', 'Motion', 'Teste', 'CSS', 'Ícones', 'QA', 'Form'
 */

export const AGENT_PROFILES = [
  {
    id: 'grid',
    name: 'GRID',
    role: 'Bounding Box & Wireframes',
    color: '#3b82f6', // Blue
    initialPos: { x: 0.44, y: 0.42 },
    speed: 1.2,
    mobileActive: true
  },
  {
    id: 'layout',
    name: 'LAYOUT',
    role: 'Layout & Alignment',
    color: '#10b981', // Emerald Green
    initialPos: { x: 0.52, y: 0.40 },
    speed: 1.1,
    mobileActive: true
  },
  {
    id: 'texto',
    name: 'TEXTO',
    role: 'Content & Copywriting',
    color: '#06b6d4', // Cyan
    initialPos: { x: 0.48, y: 0.46 },
    speed: 1.25,
    mobileActive: true
  },
  {
    id: 'tipo',
    name: 'TIPO',
    role: 'Typography Hierarchy',
    color: '#ec4899', // Hot Pink
    initialPos: { x: 0.56, y: 0.45 },
    speed: 1.1,
    mobileActive: false
  },
  {
    id: 'cor',
    name: 'COR',
    role: 'Color & Gradients',
    color: '#a855f7', // Purple
    initialPos: { x: 0.42, y: 0.50 },
    speed: 1.15,
    mobileActive: true
  },
  {
    id: 'ui',
    name: 'UI',
    role: 'Components & Surfaces',
    color: '#eab308', // Amber
    initialPos: { x: 0.54, y: 0.52 },
    speed: 1.1,
    mobileActive: false
  },
  {
    id: 'css',
    name: 'CSS',
    role: 'Styling & Spacing Tokens',
    color: '#6366f1', // Indigo
    initialPos: { x: 0.46, y: 0.54 },
    speed: 1.15,
    mobileActive: false
  },
  {
    id: 'icones',
    name: 'ÍCONES',
    role: 'SVG Icons & Symbols',
    color: '#14b8a6', // Teal
    initialPos: { x: 0.50, y: 0.38 },
    speed: 1.2,
    mobileActive: false
  },
  {
    id: 'foto',
    name: 'FOTO',
    role: 'Media & Status Assets',
    color: '#f43f5e', // Rose
    initialPos: { x: 0.38, y: 0.48 },
    speed: 1.05,
    mobileActive: false
  },
  {
    id: 'dados',
    name: 'DADOS',
    role: 'Telemetry & Studio Specs',
    color: '#8b5cf6', // Violet
    initialPos: { x: 0.58, y: 0.50 },
    speed: 1.1,
    mobileActive: false
  },
  {
    id: 'form',
    name: 'FORM',
    role: 'Forms & Action Triggers',
    color: '#84cc16', // Lime
    initialPos: { x: 0.40, y: 0.56 },
    speed: 1.15,
    mobileActive: false
  },
  {
    id: 'motion',
    name: 'MOTION',
    role: 'Spring Physics & Motion',
    color: '#f97316', // Orange
    initialPos: { x: 0.52, y: 0.58 },
    speed: 1.3,
    mobileActive: true
  },
  {
    id: 'teste',
    name: 'TESTE',
    role: 'Interactive Testing',
    color: '#0ea5e9', // Sky Blue
    initialPos: { x: 0.45, y: 0.60 },
    speed: 1.25,
    mobileActive: false
  },
  {
    id: 'qa',
    name: 'QA',
    role: 'Quality Assurance & Audit',
    color: '#ef4444', // Red
    initialPos: { x: 0.55, y: 0.60 },
    speed: 1.2,
    mobileActive: true
  }
];

export const CHOREOGRAPHY_CONFIG = {
  durationMultiplier: 1.0,
  mobileBreakpoint: 768,
  phases: {
    INITIALIZATION: { id: 1, name: 'INITIALIZATION', label: 'INIT' },
    STRUCTURE: { id: 2, name: 'STRUCTURE & LAYOUT', label: 'STRUCT' },
    TYPOGRAPHY: { id: 3, name: 'TYPOGRAPHY & COLOR', label: 'TYPE' },
    UI_ENGINEERING: { id: 4, name: 'UI & MOTION RIGGING', label: 'UI/MOTION' },
    AUDIT_TESTING: { id: 5, name: 'TESTING & QA', label: 'AUDIT' },
    COMPLETION: { id: 6, name: 'COMPLETION', label: 'READY' }
  }
};
