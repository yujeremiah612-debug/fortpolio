import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'

const SIZE = 112

const TEXT_SELECTOR = [
  'p',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'span',
  'a',
  'li',
  'label',
  'button',
  'em',
  'strong',
  'small',
  'code',
  '[data-xray]',
].join(',')

type Box = { left: number; top: number; right: number; bottom: number }

/**
 * Build hit boxes from real text nodes — works even when parents are
 * pointer-events: none (Ascent overlay, etc.).
 */
function collectTextBoxes(): Box[] {
  const nodes = document.querySelectorAll(TEXT_SELECTOR)
  const boxes: Box[] = []
  const vw = window.innerWidth
  const vh = window.innerHeight

  nodes.forEach((node) => {
    const el = node as HTMLElement
    const text = (el.textContent || '').trim()
    if (!text) return

    const style = window.getComputedStyle(el)
    if (style.display === 'none' || style.visibility === 'hidden') return
    if (Number(style.opacity) < 0.05) return

    const r = el.getBoundingClientRect()
    if (r.width < 2 || r.height < 2) return
    // skip giant layout wrappers
    if (r.width > vw * 0.92 && r.height > vh * 0.32) return
    // off-screen
    if (r.bottom < 0 || r.top > vh || r.right < 0 || r.left > vw) return

    boxes.push({
      left: r.left,
      top: r.top,
      right: r.right,
      bottom: r.bottom,
    })
  })

  return boxes
}

function hitText(x: number, y: number, boxes: Box[]) {
  for (let i = 0; i < boxes.length; i++) {
    const b = boxes[i]
    if (x >= b.left && x <= b.right && y >= b.top && y <= b.bottom) return true
  }
  return false
}

/**
 * Small x-ray lens — only active when the cursor is over text.
 */
export default function MouseXray() {
  const lensRef = useRef<HTMLDivElement>(null)
  const mouse = useRef({ x: 0, y: 0, onText: false })
  const pos = useRef({ x: 0, y: 0 })
  const strength = useRef(0)
  const boxes = useRef<Box[]>([])
  const ready = useRef(false)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const w = window.innerWidth
    const h = window.innerHeight
    mouse.current = { x: w * 0.5, y: h * 0.5, onText: false }
    pos.current = { x: w * 0.5, y: h * 0.5 }
    boxes.current = collectTextBoxes()
    ready.current = true

    const refreshBoxes = () => {
      boxes.current = collectTextBoxes()
    }

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
      mouse.current.onText = hitText(e.clientX, e.clientY, boxes.current)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('scroll', refreshBoxes, { passive: true })
    window.addEventListener('resize', refreshBoxes)
    const boxTimer = window.setInterval(refreshBoxes, 400)

    let raf = 0
    const tick = () => {
      if (!ready.current) {
        raf = requestAnimationFrame(tick)
        return
      }

      // re-check each frame so scroll/animation fades stay accurate
      mouse.current.onText = hitText(
        mouse.current.x,
        mouse.current.y,
        boxes.current,
      )

      const target = mouse.current.onText ? 1 : 0
      strength.current += (target - strength.current) * 0.22

      pos.current.x += (mouse.current.x - pos.current.x) * 0.35
      pos.current.y += (mouse.current.y - pos.current.y) * 0.35

      if (lensRef.current) {
        gsap.set(lensRef.current, {
          x: pos.current.x,
          y: pos.current.y,
          xPercent: -50,
          yPercent: -50,
          scale: 0.9 + strength.current * 0.12,
          opacity: strength.current,
        })
      }

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('scroll', refreshBoxes)
      window.removeEventListener('resize', refreshBoxes)
      window.clearInterval(boxTimer)
      cancelAnimationFrame(raf)
      ready.current = false
    }
  }, [])

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[110] overflow-hidden"
      aria-hidden
    >
      <div
        ref={lensRef}
        className="absolute top-0 left-0 rounded-full opacity-0 will-change-transform"
        style={{
          width: SIZE,
          height: SIZE,
          backgroundColor: 'rgba(0,0,0,0.01)',
          WebkitBackdropFilter:
            'invert(1) grayscale(0.35) contrast(1.35) brightness(1.05)',
          backdropFilter:
            'invert(1) grayscale(0.35) contrast(1.35) brightness(1.05)',
          maskImage:
            'radial-gradient(circle at center, #000 0%, #000 58%, transparent 76%)',
          WebkitMaskImage:
            'radial-gradient(circle at center, #000 0%, #000 58%, transparent 76%)',
        }}
      />
    </div>
  )
}
