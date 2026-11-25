import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'

const COUNT = 28

/**
 * Many arrows that follow the mouse — each lags behind the one ahead,
 * creating a chasing trail that tracks the cursor.
 */
export default function ChaseArrows({ progress }: { progress: number }) {
  const arrowsRef = useRef<(HTMLSpanElement | null)[]>([])
  const mouse = useRef({ x: 0, y: 0 })
  const points = useRef(
    Array.from({ length: COUNT }, () => ({
      x: typeof window !== 'undefined' ? window.innerWidth * 0.5 : 0,
      y: typeof window !== 'undefined' ? window.innerHeight * 0.55 : 0,
    })),
  )
  const ready = useRef(false)

  const opacity = Math.max(0, 1 - progress / 0.28)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    mouse.current.x = window.innerWidth * 0.5
    mouse.current.y = window.innerHeight * 0.55
    points.current.forEach((p) => {
      p.x = mouse.current.x
      p.y = mouse.current.y
    })
    ready.current = true

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    let raf = 0
    const tick = () => {
      if (!ready.current) {
        raf = requestAnimationFrame(tick)
        return
      }

      const pts = points.current
      // head follows mouse
      pts[0].x += (mouse.current.x - pts[0].x) * 0.32
      pts[0].y += (mouse.current.y - pts[0].y) * 0.32

      // each arrow chases the previous one
      for (let i = 1; i < COUNT; i++) {
        const lag = 0.16 + i * 0.011
        pts[i].x += (pts[i - 1].x - pts[i].x) * lag
        pts[i].y += (pts[i - 1].y - pts[i].y) * lag
      }

      arrowsRef.current.forEach((el, i) => {
        if (!el) return
        const cur = pts[i]
        const prev = i === 0 ? mouse.current : pts[i - 1]
        const dx = prev.x - cur.x
        const dy = prev.y - cur.y
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90
        const scale = 1 - i * 0.02
        const a = Math.max(0.1, 0.95 - i * 0.03)

        gsap.set(el, {
          x: cur.x,
          y: cur.y,
          rotation: angle,
          scale,
          opacity: a,
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

  if (opacity <= 0.02) return null

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[5] overflow-hidden"
      style={{ opacity }}
      aria-hidden
    >
      {Array.from({ length: COUNT }, (_, i) => (
        <span
          key={i}
          ref={(el) => {
            arrowsRef.current[i] = el
          }}
          className={`absolute top-0 left-0 will-change-transform ${
            i % 3 === 0 ? 'text-white/55' : 'text-glacier'
          }`}
          style={{
            fontSize: `${20 - Math.min(11, i * 0.38)}px`,
            filter: i > 18 ? 'blur(0.6px)' : undefined,
          }}
        >
          ↑
        </span>
      ))}
    </div>
  )
}
