import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '../lib/gsap'

let lenis: Lenis | null = null

export function getLenis() {
  return lenis
}

export function scrollToTarget(
  target: string | number,
  opts?: { immediate?: boolean; duration?: number },
) {
  const immediate = opts?.immediate ?? false
  const duration = opts?.duration ?? 1.25

  if (lenis) {
    lenis.scrollTo(target, {
      offset: 0,
      duration: immediate ? 0 : duration,
      immediate,
      force: true,
    })
    // keep GSAP in sync instantly on programmatic jumps
    ScrollTrigger.update()
  } else if (typeof target === 'string') {
    document.querySelector(target)?.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth' })
  } else {
    window.scrollTo({ top: target, behavior: immediate ? 'auto' : 'smooth' })
  }
}

/** Mounts Lenis wired into GSAP's ticker + ScrollTrigger. */
export function useSmoothScroll() {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      ascentReduced()
      return
    }

    lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
    })

    // Expose for debugging / browser verification
    ;(window as unknown as { __lenis?: Lenis }).__lenis = lenis

    lenis.on('scroll', ScrollTrigger.update)

    const raf = (time: number) => {
      lenis?.raf(time * 1000)
    }
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    ScrollTrigger.refresh()

    return () => {
      gsap.ticker.remove(raf)
      lenis?.destroy()
      lenis = null
      delete (window as unknown as { __lenis?: Lenis }).__lenis
    }
  }, [])
}

function ascentReduced() {
  // no-op marker — Experience already reads prefers-reduced-motion
}
