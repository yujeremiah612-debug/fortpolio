import HeroScene from '../components/three/HeroScene'
import { profile } from '../data/profile'
import { ArrowLink } from '../components/ui'
import { scrollToTarget } from '../hooks/useSmoothScroll'

export default function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col justify-end overflow-hidden" id="hero">
      <HeroScene />

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-6 pt-32 pb-20 md:px-12 md:pb-28">
        <p className="kicker mb-6" data-reveal data-reveal-delay="0.1">
          {profile.roles.join('  •  ')}
        </p>

        <h1 className="display mb-8 text-[13.5vw] font-medium text-white sm:text-[11vw] lg:text-[8.2vw]">
          <span className="line-mask">
            <span>BUILDING DIGITAL</span>
          </span>
          <span className="line-mask" data-line-delay="0.12">
            <span>
              EXPERIENCES<span className="text-glacier">.</span>
            </span>
          </span>
          <span className="line-mask" data-line-delay="0.24">
            <span className="text-mist">ENGINEERING</span>
          </span>
          <span className="line-mask" data-line-delay="0.36">
            <span className="text-mist">
              REAL SOLUTIONS<span className="text-glacier">.</span>
            </span>
          </span>
        </h1>

        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <p
            className="max-w-md text-base leading-relaxed text-mist md:text-lg"
            data-reveal
            data-reveal-delay="0.5"
          >
            {profile.intro}
          </p>
          <div data-reveal data-reveal-delay="0.65">
            <ArrowLink onClick={() => scrollToTarget('#work')}>Explore my work</ArrowLink>
          </div>
        </div>
      </div>

      {/* scroll hint */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
        <span className="font-mono text-[9px] tracking-[0.4em] text-white/30 uppercase">Scroll</span>
        <span className="h-10 w-px animate-pulse bg-gradient-to-b from-white/50 to-transparent" />
      </div>
    </section>
  )
}
