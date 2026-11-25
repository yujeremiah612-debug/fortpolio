import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from '../lib/gsap'
import { featuredProjects } from '../data/projects'
import { Chapter, SplitHeading, StatusBadge, ProjectVisual, ArrowLink } from '../components/ui'

export default function Work() {
  const rootRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // cinematic parallax on each project visual
      gsap.utils.toArray<HTMLElement>('.work-visual').forEach((visual) => {
        const inner = visual.querySelector('.parallax-inner')
        if (!inner) return
        gsap.fromTo(
          inner,
          { yPercent: -8, scale: 1.12 },
          {
            yPercent: 8,
            scale: 1.12,
            ease: 'none',
            scrollTrigger: { trigger: visual, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className="hairline relative border-t" id="work">
      <div className="mx-auto max-w-[1600px] px-6 py-32 md:px-12 md:py-48">
        <Chapter no="02" label="Selected Work" />
        <SplitHeading
          lines={['SELECTED PROJECTS.', 'BUILT TO BE USED.']}
          className="mt-10 text-4xl font-medium text-white sm:text-6xl lg:text-7xl"
        />

        <div className="mt-28 flex flex-col gap-32 md:gap-44">
          {featuredProjects.map((p, i) => {
            const flip = i % 2 === 1
            return (
              <article
                key={p.slug}
                className={`grid items-end gap-8 lg:grid-cols-12 ${flip ? '' : ''}`}
              >
                {/* visual */}
                <Link
                  to={`/project/${p.slug}`}
                  className={`work-visual group relative block aspect-[16/10] overflow-hidden lg:col-span-8 ${
                    flip ? 'lg:order-2' : ''
                  }`}
                  data-reveal
                  data-cursor="hover"
                >
                  <div className="parallax-inner absolute inset-0 will-change-transform">
                    <ProjectVisual name={p.name} index={p.index} cover={p.cover} className="h-full w-full" />
                  </div>
                  <div className="absolute inset-0 bg-void/0 transition-colors duration-700 group-hover:bg-void/20" />
                  <span className="display absolute top-6 left-6 text-sm tracking-widest text-white/50">
                    {p.index}
                  </span>
                  <span className="absolute right-6 bottom-6 translate-y-3 font-mono text-[10px] tracking-[0.3em] text-white uppercase opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    Open project ↗
                  </span>
                </Link>

                {/* meta */}
                <div className={`lg:col-span-4 ${flip ? 'lg:order-1 lg:pr-10' : 'lg:pl-10'}`}>
                  <div data-reveal>
                    <StatusBadge status={p.status} />
                    <h3 className="display mt-6 text-3xl font-medium text-white md:text-4xl">
                      {p.name}
                    </h3>
                    <p className="mt-2 font-mono text-[11px] tracking-[0.2em] text-glacier uppercase">
                      {p.category}
                    </p>
                    <p className="mt-6 leading-relaxed text-mist">{p.description}</p>
                    <p className="mt-4 text-sm text-mist/70">
                      <span className="text-silver">Role —</span> {p.role}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {p.stack.map((t) => (
                        <span
                          key={t}
                          className="border border-white/10 px-3 py-1 font-mono text-[10px] tracking-wider text-mist"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="mt-8 flex flex-wrap items-center gap-6">
                      {p.url && (
                        <ArrowLink href={p.url} external>
                          View project
                        </ArrowLink>
                      )}
                      <Link
                        to={`/project/${p.slug}`}
                        className="group inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] text-mist uppercase transition-colors hover:text-white"
                        data-cursor="hover"
                      >
                        View case study{' '}
                        <span className="transition-transform duration-500 group-hover:translate-x-1">
                          →
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
