import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'

const COUNT = 48
const CIRCLE_RADIUS = 92

type Particle = {
  x: number
  y: number
  /** slot angle on the mouse circle (0…2π) */
  slot: number
  /** roam center when idle */
  cx: number
  cy: number
  tx: number
  ty: number
  radius: number
  angle: number
  spin: number
  lag: number
  size: number
  retargetAt: number
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function placeAwayFromEdges(w: number, h: number) {
  return {
    x: rand(w * 0.08, w * 0.92),
    y: rand(h * 0.12, h * 0.88),
  }
}

function makeParticle(w: number, h: number, i: number): Particle {
  const p = placeAwayFromEdges(w, h)
  const next = placeAwayFromEdges(w, h)
  return {
    x: p.x,
    y: p.y,
    slot: (i / COUNT) * Math.PI * 2,
    cx: p.x,
    cy: p.y,
    tx: next.x,
    ty: next.y,
    radius: rand(24, 110),
    angle: Math.random() * Math.PI * 2,
    spin: rand(0.008, 0.035) * (Math.random() < 0.5 ? -1 : 1),
    lag: rand(0.08, 0.2),
    size: rand(12, 26),
    retargetAt: performance.now() + rand(1800, 5200),
  }
}

/**
 * Idle: arrows roam around the page.
 * Mouse move: they form a circle around the cursor and point at it.
 */
export default function ChaseArrows() {
  const arrowsRef = useRef<(HTMLSpanElement | null)[]>([])
  const mouse = useRef({ x: 0, y: 0, active: false, lastMove: 0 })
  const particles = useRef<Particle[]>([])
  const ready = useRef(false)
  const spinOff = useRef(0)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const w = window.innerWidth
    const h = window.innerHeight
    mouse.current = { x: w * 0.5, y: h * 0.5, active: false, lastMove: 0 }
    particles.current = Array.from({ length: COUNT }, (_, i) => makeParticle(w, h, i))
    ready.current = true

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
      mouse.current.active = true
      mouse.current.lastMove = performance.now()
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    let raf = 0
    const tick = () => {
      if (!ready.current) {
        raf = requestAnimationFrame(tick)
        return
      }

      const now = performance.now()
      const vw = window.innerWidth
      const vh = window.innerHeight

      const since = now - mouse.current.lastMove
      const follow =
        mouse.current.active && since < 2800
          ? Math.max(0, 1 - since / 2800)
          : 0

      spinOff.current += 0.012 + follow * 0.02

      particles.current.forEach((p, i) => {
        const el = arrowsRef.current[i]
        if (!el) return

        if (now > p.retargetAt) {
          const next = placeAwayFromEdges(vw, vh)
          p.tx = next.x
          p.ty = next.y
          p.retargetAt = now + rand(1600, 5600)
          p.radius = rand(20, 120)
        }

        p.cx += (p.tx - p.cx) * 0.012
        p.cy += (p.ty - p.cy) * 0.012
        p.angle += p.spin

        const roamX = p.cx + Math.cos(p.angle) * p.radius
        const roamY = p.cy + Math.sin(p.angle * 0.85) * p.radius * 0.7

        // evenly spaced ring around the cursor
        const ringR =
          CIRCLE_RADIUS +
          Math.sin(now * 0.003 + i * 0.7) * 10 +
          (i % 3) * 6
        const a = p.slot + spinOff.current
        const circleX = mouse.current.x + Math.cos(a) * ringR
        const circleY = mouse.current.y + Math.sin(a) * ringR

        const targetX = roamX * (1 - follow) + circleX * follow
        const targetY = roamY * (1 - follow) + circleY * follow

        const lag = p.lag + follow * 0.18
        p.x += (targetX - p.x) * lag
        p.y += (targetY - p.y) * lag

        // tip of ↑ points straight at the mouse
        const dx = mouse.current.x - p.x
        const dy = mouse.current.y - p.y
        const aim = (Math.atan2(dy, dx) * 180) / Math.PI + 90
        const roamRot = Math.sin(now * 0.004 + i) * 18
        const rotation = roamRot * (1 - follow) + aim * follow

        gsap.set(el, {
          x: p.x,
          y: p.y,
          rotation,
          scale: 0.75 + (p.size / 30) * 0.5 + follow * 0.12,
          opacity: 0.3 + (1 - i / COUNT) * 0.4 + follow * 0.2,
          xPercent: -50,
          yPercent: -50,
        })
      })

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
      ready.current = false
    }
  }, [])

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[25] overflow-hidden"
      aria-hidden
    >
      {Array.from({ length: COUNT }, (_, i) => {
        const tone = i % 5
        return (
          <span
            key={i}
            ref={(el) => {
              arrowsRef.current[i] = el
            }}
            className={`absolute top-0 left-0 will-change-transform ${
              tone === 0 || tone === 3 ? 'text-white/45' : 'text-glacier/80'
            }`}
            style={{
              fontSize: `${11 + (i % 7) * 2.2}px`,
              filter: i % 4 === 0 ? 'blur(0.45px)' : undefined,
            }}
          >
            ↑
          </span>
        )
      })}
    </div>
  )
}
