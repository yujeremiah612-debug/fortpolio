import { useState } from 'react'
import { profile } from '../data/profile'
import { Chapter, SplitHeading } from '../components/ui'
import { withBase } from '../lib/paths'

export default function About() {
  const [active, setActive] = useState(0)
  const { about } = profile

  return (
    <section className="hairline relative border-t" id="about">
      <div className="mx-auto max-w-[1600px] px-6 py-32 md:px-12 md:py-48">
        <Chapter no="03" label="About" />
        <SplitHeading
          lines={['THE PERSON', 'BEHIND THE CODE.']}
          className="mt-10 text-5xl font-medium text-white sm:text-6xl lg:text-8xl"
        />

        <div className="mt-20 grid gap-16 lg:grid-cols-12">
          {/* portrait */}
          <div className="lg:col-span-5" data-reveal>
            <div className="group relative aspect-[4/5] overflow-hidden bg-graphite">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'radial-gradient(80% 60% at 50% 30%, rgba(125,180,255,0.08), transparent 60%), linear-gradient(170deg,#13131a,#0a0a0e)',
                  }}
                />
                <span className="display relative text-8xl font-light text-white/[0.07]">J</span>
                <span className="relative font-mono text-[10px] tracking-[0.3em] text-white/25 uppercase">
                  Replace with /public/profile.jpg
                </span>
              </div>
              <img
                src={withBase(profile.photo)}
                alt="Portrait of Jeremiah"
                loading="lazy"
                className="relative h-full w-full object-cover opacity-0 transition-all duration-700 group-hover:scale-[1.03]"
                onLoad={(e) => e.currentTarget.classList.replace('opacity-0', 'opacity-100')}
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
              <div className="pointer-events-none absolute inset-0 border border-white/10" />
            </div>
          </div>

          {/* story + facets */}
          <div className="flex flex-col justify-between lg:col-span-7">
            <div className="space-y-6">
              {about.paragraphs.map((t, i) => (
                <p
                  key={i}
                  className={`leading-relaxed ${i === 0 ? 'text-xl text-silver md:text-2xl' : 'text-lg text-mist'}`}
                  data-reveal
                  data-reveal-delay={`${i * 0.1}`}
                >
                  {t}
                </p>
              ))}
            </div>

            {/* interactive facets */}
            <div className="mt-16" data-reveal>
              <div className="flex flex-wrap gap-2">
                {about.facets.map((f, i) => (
                  <button
                    key={f.label}
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    className={`border px-4 py-2 font-mono text-[10px] tracking-[0.2em] uppercase transition-all duration-400 ${
                      active === i
                        ? 'border-glacier/60 bg-glacier/10 text-white'
                        : 'border-white/10 text-mist hover:border-white/30 hover:text-silver'
                    }`}
                    data-cursor="hover"
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <div className="hairline mt-6 border-t pt-6">
                <p
                  key={active}
                  className="animate-[fadeUp_0.5s_ease_both] text-lg leading-relaxed text-silver"
                  style={{ animationName: 'fadeUp' }}
                >
                  {about.facets[active].text}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(12px);} to { opacity: 1; transform: none; } }`}</style>
    </section>
  )
}
