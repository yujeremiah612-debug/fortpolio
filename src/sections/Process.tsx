import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { process } from '../data/profile'
import { Chapter, SplitHeading } from '../components/ui'

export default function Process() {
  const rootRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.process-line',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.process-list',
            start: 'top 70%',
            end: 'bottom 60%',
            scrub: true,
          },
        },
      )
      gsap.utils.toArray<HTMLElement>('.process-step').forEach((el) => {
        gsap.fromTo(
          el.querySelector('.process-num'),
          { opacity: 0.08 },
          {
            opacity: 0.35,
            scrollTrigger: { trigger: el, start: 'top 75%', end: 'top 35%', scrub: true },
          },
        )
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className="hairline relative border-t" id="process">
      <div className="mx-auto max-w-[1600px] px-6 py-32 md:px-12 md:py-48">
        <Chapter no="05" label="The Process" />
        <SplitHeading
          lines={['FROM IDEA', 'TO DEPLOYMENT.']}
          className="mt-10 text-5xl font-medium text-white sm:text-6xl lg:text-8xl"
        />

        <div className="process-list relative mt-24">
          {/* progress spine */}
          <span className="process-line absolute top-0 left-0 hidden h-full w-px origin-top bg-gradient-to-b from-glacier/70 to-glacier/10 md:block" />

          {process.map((s) => (
            <div
              key={s.step}
              className="process-step hairline grid gap-6 border-t py-16 last:border-b md:grid-cols-12 md:pl-16"
              data-reveal
            >
              <span className="process-num display text-7xl font-light text-white md:col-span-3 md:text-8xl">
                {s.step}
              </span>
              <div className="md:col-span-9">
                <h3 className="display text-3xl font-medium text-white md:text-5xl">{s.title}</h3>
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-mist">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
