import { useLayoutEffect } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'

/**
 * Global scroll-reveal system.
 *
 * · `[data-reveal]`            → fade/rise in when scrolled into view.
 *   optional `data-reveal-delay="0.2"` stagger offset.
 * · `.line-mask > span`        → masked line slide-up (editorial reveal).
 */
export function useReveals(ready: boolean) {
  useLayoutEffect(() => {
    if (!ready) return

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        const delay = parseFloat(el.dataset.revealDelay ?? '0')
        gsap.fromTo(
          el,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            delay,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          },
        )
      })

      gsap.utils.toArray<HTMLElement>('.line-mask').forEach((mask) => {
        const inner = mask.querySelector('span')
        if (!inner) return
        gsap.to(inner, {
          y: 0,
          duration: 1.25,
          ease: 'power4.out',
          delay: parseFloat(mask.dataset.lineDelay ?? '0'),
          scrollTrigger: { trigger: mask, start: 'top 90%', once: true },
        })
      })
    })

    // let layout settle (fonts, images) then measure again
    const t = setTimeout(() => ScrollTrigger.refresh(), 400)

    return () => {
      clearTimeout(t)
      ctx.revert()
    }
  }, [ready])
}
