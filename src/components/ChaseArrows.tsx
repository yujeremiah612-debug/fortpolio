import { useEffect, useRef, type RefObject } from 'react'
import { gsap } from '../lib/gsap'

const COUNT = 40
/** rumble duration before the dragon settles into orbit (ms) */
const RUMBLE_MS = 1400

type Particle = {
  x: number
  y: number
  jx: number
  jy: number
  lag: number
}

/**
 * Loader dragon: rumble first, then coil around the target
 * (JEREMIAH + status line block).
 */
export default function ChaseArrows({
  targetRef,
}: {
  targetRef: RefObject<HTMLElement | null>
}) {
  const arrowsRef = useRef<(HTMLSpanElement | null)[]>([])
  const particles = useRef<Particle[]>([])
  const ready = useRef(false)
  const t = useRef(0)
  const start = useRef(0)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const w = window.innerWidth
    const h = window.innerHeight
    start.current = performance.now()
    particles.current = Array.from({ length: COUNT }, () => ({
      x: w * 0.5 + (Math.random() - 0.5) * w * 0.6,
      y: h * 0.5 + (Math.random() - 0.5) * h * 0.5,
      jx: (Math.random() - 0.5) * 180,
      jy: (Math.random() - 0.5) * 140,
      lag: 0.12 + Math.random() * 0.18,
    }))
    ready.current = true

    let raf = 0
    const tick = () => {
      if (!ready.current) {
        raf = requestAnimationFrame(tick)
        return
      }

      const now = performance.now()
      t.current += 0.038
      const time = t.current
      const elapsed = now - start.current
      // 0 = full rumble → 1 = full orbit
      const settle = Math.min(1, Math.max(0, (elapsed - RUMBLE_MS * 0.35) / (RUMBLE_MS * 0.65)))

      const el = targetRef.current
      const r = el?.getBoundingClientRect()
      const cx = r ? r.left + r.width * 0.5 : window.innerWidth * 0.5
      const cy = r ? r.top + r.height * 0.5 : window.innerHeight * 0.48
      const rx = r ? Math.max(r.width * 0.62, 160) : 220
      const ry = r ? Math.max(r.height * 0.72, 70) : 90

      particles.current.forEach((p, i) => {
        const node = arrowsRef.current[i]
        if (!node) return

        const slot = (i / COUNT) * Math.PI * 2 + time
        const wave = Math.sin(time * 2.4 + i * 0.2) * 14
        const orbitX = cx + Math.cos(slot) * (rx + wave)
        const orbitY = cy + Math.sin(slot) * ry + Math.sin(slot * 2) * 12

        // rumble: chaotic shake around scattered offsets near center
        const rumbleX =
          cx +
          p.jx +
          Math.sin(time * 8 + i * 1.7) * 28 +
          Math.cos(time * 5.5 + i) * 18 +
          (Math.random() - 0.5) * 10
        const rumbleY =
          cy +
          p.jy +
          Math.cos(time * 7.2 + i * 1.3) * 24 +
          Math.sin(time * 6 + i * 0.8) * 16 +
          (Math.random() - 0.5) * 10

        const tx = rumbleX * (1 - settle) + orbitX * settle
        const ty = rumbleY * (1 - settle) + orbitY * settle

        p.x += (tx - p.x) * (p.lag + settle * 0.12)
        p.y += (ty - p.y) * (p.lag + settle * 0.12)

        // face along orbit when settled; tumble while rumbling
        let rotation: number
        if (settle > 0.55) {
          const nextSlot = slot + 0.2
          const nx = cx + Math.cos(nextSlot) * rx
          const ny = cy + Math.sin(nextSlot) * ry
          rotation = (Math.atan2(ny - p.y, nx - p.x) * 180) / Math.PI + 90
        } else {
          rotation = Math.sin(time * 6 + i) * 50 + time * 40
        }

        gsap.set(node, {
          x: p.x,
          y: p.y,
          rotation,
          scale: 0.95 - i * 0.012 + (1 - settle) * 0.15,
          opacity: Math.max(0.18, 0.95 - i * 0.018),
          xPercent: -50,
          yPercent: -50,
        })
      })

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      ready.current = false
    }
  }, [targetRef])

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[6] overflow-hidden"
      aria-hidden
    >
      {Array.from({ length: COUNT }, (_, i) => (
        <span
          key={i}
          ref={(el) => {
            arrowsRef.current[i] = el
          }}
          className="absolute top-0 left-0 will-change-transform"
          style={{
            fontSize: `${18 - Math.min(9, i * 0.22)}px`,
            color:
              i % 4 === 0
                ? 'rgba(255, 236, 160, 0.95)'
                : i % 4 === 1
                  ? 'rgba(255, 170, 40, 0.9)'
                  : i % 4 === 2
                    ? 'rgba(255, 110, 20, 0.88)'
                    : 'rgba(255, 70, 10, 0.82)',
            textShadow:
              '0 0 10px rgba(255, 140, 0, 0.55), 0 0 22px rgba(255, 80, 0, 0.35)',
            filter: i > 26 ? 'blur(0.45px)' : undefined,
          }}
        >
          ↑
        </span>
      ))}
    </div>
  )
}
