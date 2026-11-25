/**
 * Shared ascent state — written by GSAP ScrollTrigger, read by the 3D scene.
 * Camera path keyframes define the continuous climb (Apex-style scrub).
 */

export type Vec3 = [number, number, number]

export const ascent = {
  /** 0 → 1 scrub progress across the pinned climb */
  progress: 0,
  /** reduced-motion / no-webgl */
  reduced: false,
}

/** Camera + lookAt keyframes along the climb (interpolated by progress). */
export const CAMERA_PATH: { p: number; pos: Vec3; look: Vec3; fov: number }[] = [
  { p: 0.0, pos: [0.4, 1.4, 9.2], look: [0.0, 0.6, -2], fov: 48 },
  { p: 0.18, pos: [-0.3, 2.2, 7.4], look: [0.2, 1.2, -2.5], fov: 46 },
  { p: 0.36, pos: [0.8, 3.4, 5.6], look: [-0.1, 2.2, -3], fov: 44 },
  { p: 0.55, pos: [-0.5, 4.8, 4.0], look: [0.3, 3.6, -3.2], fov: 42 },
  { p: 0.74, pos: [0.35, 6.4, 2.8], look: [0.0, 5.2, -2.8], fov: 40 },
  { p: 1.0, pos: [0.0, 8.2, 2.2], look: [0.0, 7.0, -1.5], fov: 38 },
]

export function sampleCamera(progress: number) {
  const p = Math.min(1, Math.max(0, progress))
  const path = CAMERA_PATH
  let i = 0
  while (i < path.length - 1 && path[i + 1].p < p) i++
  const a = path[i]
  const b = path[Math.min(i + 1, path.length - 1)]
  const t = a.p === b.p ? 0 : (p - a.p) / (b.p - a.p)
  const lerp = (x: number, y: number) => x + (y - x) * t
  return {
    pos: [lerp(a.pos[0], b.pos[0]), lerp(a.pos[1], b.pos[1]), lerp(a.pos[2], b.pos[2])] as Vec3,
    look: [lerp(a.look[0], b.look[0]), lerp(a.look[1], b.look[1]), lerp(a.look[2], b.look[2])] as Vec3,
    fov: lerp(a.fov, b.fov),
  }
}

export const STAGES = [
  {
    id: 'BASE',
    label: 'BASE',
    kicker: '01 · THE INTRODUCTION',
    lines: ['BUILDING DIGITAL', 'EXPERIENCES.'],
    sub: 'Web Developer  ·  Software Developer  ·  Digital Solutions Builder',
    body: 'I transform ideas into functional websites, business systems, and digital experiences.',
    alt: 0,
  },
  {
    id: '01',
    label: '01',
    kicker: '02 · THE TURN',
    lines: ['IDEAS INTO', 'FUNCTIONAL SOLUTIONS.'],
    sub: '',
    body: 'Websites, business applications, API integrations, and custom systems — engineered to work in the real world.',
    alt: 2100,
  },
  {
    id: '02',
    label: '02',
    kicker: '03 · WHAT I BUILD',
    lines: ['DESIGN.', 'DEVELOPMENT.', 'ENGINEERING.'],
    sub: '',
    body: 'Website Development · Web Applications · Backend · API Integrations · E-Commerce · Automation · Deployment',
    alt: 4200,
  },
  {
    id: '03',
    label: '03',
    kicker: '04 · SELECTED WORK',
    lines: ['BUILT WITH', 'PURPOSE.'],
    sub: '',
    body: 'Restaurant sites, service businesses, and custom digital systems — developed with precision.',
    alt: 6400,
  },
  {
    id: '04',
    label: '04',
    kicker: '05 · THE TECHNOLOGY',
    lines: ['POWERED BY', 'TECHNOLOGY.'],
    sub: '',
    body: 'React · TypeScript · PHP · Node.js · MySQL · APIs · Webhooks · GitHub · Docker · Render',
    alt: 8100,
  },
  {
    id: 'SUMMIT',
    label: 'SUMMIT',
    kicker: '06 · THE SUMMIT',
    lines: ["LET'S BUILD", 'SOMETHING GREAT.'],
    sub: '',
    body: 'Have a project or idea? Let’s turn it into something real.',
    alt: 9800,
    cta: true,
  },
] as const

export type Stage = (typeof STAGES)[number]
