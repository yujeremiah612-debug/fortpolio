import { stack } from '../data/profile'
import { Chapter, SplitHeading } from '../components/ui'

const all = stack.flatMap((g) => g.items)

export default function Technology() {
  return (
    <section className="hairline relative overflow-hidden border-t">
      <div className="mx-auto max-w-[1600px] px-6 py-32 md:px-12 md:py-48">
        <Chapter no="04" label="The Technology" />
        <SplitHeading
          lines={['POWERED BY CREATIVITY', 'AND ENGINEERING.']}
          className="mt-10 text-4xl font-medium text-white sm:text-6xl lg:text-7xl"
        />

        <div className="mt-20 grid gap-px bg-white/5 md:grid-cols-2 lg:grid-cols-3">
          {stack.map((group, gi) => (
            <div
              key={group.group}
              className="group/cell bg-void p-8 transition-colors duration-500 hover:bg-graphite/50 md:p-10"
              data-reveal
              data-reveal-delay={`${gi * 0.08}`}
            >
              <p className="font-mono text-[10px] tracking-[0.3em] text-glacier uppercase">
                {String(gi + 1).padStart(2, '0')} / {group.group}
              </p>
              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-3">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="display cursor-default text-xl text-mist transition-all duration-300 hover:-translate-y-0.5 hover:text-white hover:glow-text md:text-2xl"
                    data-cursor="hover"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* marquee strip */}
      <div className="hairline relative border-t py-6">
        <div className="flex w-max gap-12 whitespace-nowrap marquee-track">
          {[...all, ...all].map((t, i) => (
            <span
              key={i}
              className="font-mono text-xs tracking-[0.3em] text-white/25 uppercase"
            >
              {t} <span className="mx-4 text-glacier/40">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
