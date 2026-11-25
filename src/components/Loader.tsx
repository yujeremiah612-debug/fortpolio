import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import ChaseArrows from './ChaseArrows'

export default function Loader({ onDone }: { onDone: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const orbitRef = useRef<HTMLDivElement>(null)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const counter = { v: 0 }
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(rootRef.current, {
          yPercent: -100,
          duration: 1.0,
          ease: 'power4.inOut',
          onComplete: onDone,
        })
      },
    })

    tl.fromTo(
      '.loader-letter',
      { yPercent: 120, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.055, ease: 'power4.out' },
    )
      .to(
        counter,
        {
          v: 100,
          duration: 1.6,
          ease: 'power2.inOut',
          onUpdate: () => setCount(Math.round(counter.v)),
        },
        '<0.2',
      )
      .to('.loader-bar', { scaleX: 1, duration: 1.6, ease: 'power2.inOut' }, '<')
      .to('.loader-letter', { opacity: 0.25, duration: 0.4, stagger: 0.03 }, '>-0.1')

    return () => {
      tl.kill()
    }
  }, [onDone])

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-void"
      aria-hidden
    >
      {/* orbit target: name + status — dragon coils around this whole block */}
      <div ref={orbitRef} className="relative z-10 flex flex-col items-center">
        <div className="display flex overflow-hidden text-[13vw] leading-none font-medium tracking-tight text-white md:text-[7vw]">
          {'JEREMIAH'.split('').map((l, i) => (
            <span key={i} className="loader-letter inline-block">
              {l}
            </span>
          ))}
        </div>
        <div className="mt-8 h-px w-56 overflow-hidden bg-white/10">
          <div className="loader-bar h-full w-full origin-left scale-x-0 bg-glacier" />
        </div>
        <div className="mt-4 font-mono text-[11px] tracking-[0.4em] text-mist">
          {String(count).padStart(3, '0')} — ENTERING EXPERIENCE
        </div>
      </div>

      <ChaseArrows targetRef={orbitRef} />
    </div>
  )
}
