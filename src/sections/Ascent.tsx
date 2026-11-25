import { useLayoutEffect, useRef, useState } from 'react'
import { ArrowLink } from '../components/ui'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { ascent, STAGES } from '../lib/ascent'
import { scrollToTarget } from '../hooks/useSmoothScroll'

/**
 * Apex-style continuous ascent:
 * Fixed WebGL (Experience) + tall scroll track + fixed overlay.
 * One scrubbed progress value drives camera, objects, text, HUD.
 */

function formatAlt(n: number) {
  return n.toLocaleString('en-US')
}

/** Soft plateau window for chapter visibility (0–1). */
function chapterVisibility(p: number, i: number, n: number) {
  const start = i / n
  const end = (i + 1) / n
  const fade = (end - start) * 0.3

  if (i === 0 && p <= start + fade) return 1
  if (i === n - 1 && p >= end - fade) return 1

  if (p < start || p > end) return 0
  if (p < start + fade) return (p - start) / fade
  if (p > end - fade) return (end - p) / fade
  return 1
}

export default function Ascent() {
  const trackRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const brandRef = useRef<HTMLDivElement>(null)
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([])
  const [stage, setStage] = useState(0)
  const [alt, setAlt] = useState(0)

  useLayoutEffect(() => {
    const track = trackRef.current
    const overlay = overlayRef.current
    if (!track || !overlay) return

    const n = STAGES.length

    const applyProgress = (p: number) => {
      ascent.progress = p

      const idx = Math.min(n - 1, Math.floor(p * n + 0.0001))
      setStage(idx)

      const seg = 1 / n
      const local = gsap.utils.clamp(0, 1, (p - idx * seg) / seg)
      const from = STAGES[idx].alt
      const to = STAGES[Math.min(idx + 1, n - 1)].alt
      setAlt(Math.round(from + (to - from) * local))

      // brand wordmark
      if (brandRef.current) {
        const b = gsap.utils.clamp(0, 1, 1 - p / 0.14)
        gsap.set(brandRef.current, {
          autoAlpha: b,
          y: (1 - b) * -48,
          scale: 0.92 + b * 0.08,
        })
      }

      // chapter crossfades
      chapterRefs.current.forEach((el, i) => {
        if (!el) return
        const v = gsap.utils.clamp(0, 1, chapterVisibility(p, i, n))
        gsap.set(el, {
          autoAlpha: v,
          y: (1 - v) * 48,
          filter: `blur(${(1 - v) * 10}px)`,
        })
      })
    }

    const ctx = gsap.context(() => {
      // initialize
      applyProgress(0)

      const syncOverlayVisibility = () => {
        const endY = track.offsetTop + track.offsetHeight - window.innerHeight
        const past = window.scrollY > endY + 8
        gsap.to(overlay, {
          autoAlpha: past ? 0 : 1,
          duration: past ? 0.35 : 0.25,
          ease: 'power2.out',
          overwrite: true,
        })
        if (past) ascent.progress = 1
      }

      ScrollTrigger.create({
        trigger: track,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.7,
        onUpdate: (self) => {
          applyProgress(self.progress)
          syncOverlayVisibility()
        },
        onLeave: () => {
          gsap.set(overlay, { autoAlpha: 0 })
          ascent.progress = 1
        },
        onEnterBack: () => gsap.set(overlay, { autoAlpha: 1 }),
      })

      window.addEventListener('scroll', syncOverlayVisibility, { passive: true })

      // store remover on the track node for cleanup
      ;(track as unknown as { __syncOverlay?: () => void }).__syncOverlay = syncOverlayVisibility
    }, track)

    const refresh = () => ScrollTrigger.refresh()
    const t = window.setTimeout(refresh, 250)
    window.addEventListener('load', refresh)

    return () => {
      window.clearTimeout(t)
      window.removeEventListener('load', refresh)
      const sync = (track as unknown as { __syncOverlay?: () => void }).__syncOverlay
      if (sync) window.removeEventListener('scroll', sync)
      ctx.revert()
      ascent.progress = 0
    }
  }, [])

  const jumpTo = (index: number) => {
    const track = trackRef.current
    if (!track) return
    const top = track.getBoundingClientRect().top + window.scrollY
    const travel = Math.max(1, track.offsetHeight - window.innerHeight)
    const target = top + ((index + 0.42) / STAGES.length) * travel
    scrollToTarget(target, { immediate: true })
    // force progress sync on the next frame (Lenis immediate + ScrollTrigger)
    requestAnimationFrame(() => ScrollTrigger.update())
  }

  return (
    <>
      {/* scroll distance for the climb */}
      <div ref={trackRef} id="hero" className="relative h-[1000vh]" />

      {/* FIXED cinematic overlay */}
      <div ref={overlayRef} className="pointer-events-none fixed inset-0 z-20">
        {/* giant brand — depth layer behind copy */}
        <div
          ref={brandRef}
          className="absolute inset-x-0 top-[16%] px-6 md:px-16 lg:px-24"
          aria-hidden
        >
          <span className="display block text-[20vw] leading-[0.8] font-semibold tracking-[-0.045em] text-white/[0.075] select-none md:text-[13vw]">
            JEREMIAH
          </span>
        </div>

        {/* chapters */}
        <div className="pointer-events-none absolute inset-0 z-10">
          {STAGES.map((s, i) => (
            <div
              key={s.id}
              ref={(el) => {
                chapterRefs.current[i] = el
              }}
              className="pointer-events-none absolute inset-0 flex items-center will-change-transform"
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              <div className="mx-auto w-full max-w-[1200px] px-6 md:px-16 md:pr-28">
                <p className="kicker mb-5 text-glacier">{s.kicker}</p>
                <h1 className="display text-[12vw] font-medium leading-[0.92] text-white sm:text-[7.5vw] lg:text-[5.8vw]">
                  {s.lines.map((line, li) => (
                    <span key={li} className="block">
                      {line.replace(/\.$/, '')}
                      {line.endsWith('.') && <span className="text-glacier">.</span>}
                    </span>
                  ))}
                </h1>
                {s.sub ? (
                  <p className="mt-6 font-mono text-[11px] tracking-[0.28em] text-mist uppercase">
                    {s.sub}
                  </p>
                ) : null}
                <p className="mt-7 max-w-lg text-base leading-relaxed text-mist md:text-lg">
                  {s.body}
                </p>
                {'cta' in s && s.cta ? (
                  <div className="pointer-events-auto mt-10">
                    <ArrowLink onClick={() => scrollToTarget('#work')}>Explore my work</ArrowLink>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        {/* HUD */}
        <div className="absolute bottom-6 left-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] tracking-[0.28em] text-white/45 uppercase md:bottom-8 md:left-12">
          <span>
            ALT <span className="text-glacier">{formatAlt(alt)}</span> M
          </span>
          <span className="text-white/20">·</span>
          <span>
            STAGE <span className="text-white">{STAGES[stage].label}</span>
          </span>
          <span className="text-white/20">·</span>
          <span className="hidden sm:inline">Scroll to ascend</span>
        </div>

        {/* stage rail */}
        <nav
          className="pointer-events-auto absolute top-1/2 right-3 z-30 hidden -translate-y-1/2 flex-col items-center gap-2.5 md:right-8 md:flex"
          aria-label="Ascent stages"
        >
          <span className="mb-1 font-mono text-[9px] tracking-[0.35em] text-white/25 uppercase">
            Scroll
          </span>
          {STAGES.map((s, i) => {
            const active = i === stage
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => jumpTo(i)}
                className="group pointer-events-auto flex flex-col items-center gap-1"
                data-cursor="hover"
                aria-label={`Go to ${s.label}`}
                aria-current={active ? 'step' : undefined}
              >
                <span
                  className={`font-mono text-[10px] tracking-[0.18em] transition-colors duration-300 ${
                    active ? 'text-glacier' : 'text-white/30 group-hover:text-white/70'
                  }`}
                >
                  {s.label}
                </span>
                <span
                  className={`w-px transition-all duration-300 ${
                    active ? 'h-7 bg-glacier' : 'h-5 bg-white/15 group-hover:bg-white/40'
                  }`}
                />
              </button>
            )
          })}
        </nav>
      </div>
    </>
  )
}
