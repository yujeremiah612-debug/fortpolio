import { useEffect, useRef } from 'react'

const EMBERS = 28

type Ember = {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  hue: number
}

/**
 * Soft orange–yellow fire aura that trails the cursor as a background layer.
 */
export default function FireFollow() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const mouse = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5, active: false }
    const glow = { x: mouse.x, y: mouse.y }
    const trail: { x: number; y: number }[] = []
    const embers: Ember[] = []

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(window.innerWidth * dpr)
      canvas.height = Math.floor(window.innerHeight * dpr)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      mouse.active = true
    }
    const onLeave = () => {
      mouse.active = false
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseleave', onLeave)
    window.addEventListener('resize', resize)

    const spawnEmber = (x: number, y: number) => {
      if (embers.length >= EMBERS) embers.shift()
      embers.push({
        x: x + (Math.random() - 0.5) * 40,
        y: y + (Math.random() - 0.5) * 30,
        vx: (Math.random() - 0.5) * 0.9,
        vy: -0.6 - Math.random() * 1.8,
        life: 0,
        maxLife: 40 + Math.random() * 50,
        size: 3 + Math.random() * 8,
        hue: 18 + Math.random() * 38,
      })
    }

    let raf = 0
    let tick = 0
    const frame = () => {
      tick += 1
      const w = window.innerWidth
      const h = window.innerHeight

      // lagged follow — soft background feel
      glow.x += (mouse.x - glow.x) * 0.085
      glow.y += (mouse.y - glow.y) * 0.085

      trail.push({ x: glow.x, y: glow.y })
      if (trail.length > 14) trail.shift()

      if (mouse.active && tick % 2 === 0) {
        spawnEmber(glow.x, glow.y)
      }

      ctx.clearRect(0, 0, w, h)

      // soft fire bloom under the cursor path
      for (let i = 0; i < trail.length; i++) {
        const t = trail[i]
        const p = (i + 1) / trail.length
        const r = 90 + p * 160
        const g = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, r)
        g.addColorStop(0, `rgba(255, 210, 90, ${0.08 * p})`)
        g.addColorStop(0.35, `rgba(255, 120, 20, ${0.055 * p})`)
        g.addColorStop(0.7, `rgba(255, 60, 0, ${0.028 * p})`)
        g.addColorStop(1, 'rgba(255, 40, 0, 0)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(t.x, t.y, r, 0, Math.PI * 2)
        ctx.fill()
      }

      // main ember core
      const core = ctx.createRadialGradient(glow.x, glow.y, 0, glow.x, glow.y, 220)
      core.addColorStop(0, 'rgba(255, 240, 170, 0.22)')
      core.addColorStop(0.25, 'rgba(255, 170, 40, 0.14)')
      core.addColorStop(0.55, 'rgba(255, 90, 10, 0.07)')
      core.addColorStop(1, 'rgba(255, 40, 0, 0)')
      ctx.fillStyle = core
      ctx.beginPath()
      ctx.arc(glow.x, glow.y, 220, 0, Math.PI * 2)
      ctx.fill()

      // rising ember sparks
      for (let i = embers.length - 1; i >= 0; i--) {
        const e = embers[i]
        e.life += 1
        e.x += e.vx
        e.y += e.vy
        e.vy -= 0.02
        e.vx *= 0.99

        if (e.life >= e.maxLife) {
          embers.splice(i, 1)
          continue
        }

        const life = 1 - e.life / e.maxLife
        const alpha = life * 0.75
        const er = e.size * (0.5 + life * 0.8)
        const eg = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, er)
        eg.addColorStop(0, `hsla(${e.hue}, 100%, 72%, ${alpha})`)
        eg.addColorStop(0.45, `hsla(${e.hue - 8}, 100%, 50%, ${alpha * 0.55})`)
        eg.addColorStop(1, `hsla(${e.hue - 15}, 100%, 40%, 0)`)
        ctx.fillStyle = eg
        ctx.beginPath()
        ctx.arc(e.x, e.y, er, 0, Math.PI * 2)
        ctx.fill()
      }

      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[22] hidden md:block"
      aria-hidden
      style={{ mixBlendMode: 'screen' }}
    />
  )
}
