import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from '../lib/gsap'
import { featuredProjects } from '../data/projects'
import { Chapter, ProjectVisual, StatusBadge } from '../components/ui'

/**
 * Selected work carousel — side arrows, no pinned scroll stay.
 */
export default function ProjectFilm() {
  const [index, setIndex] = useState(0)
  const slideRef = useRef<HTMLDivElement>(null)
  const total = featuredProjects.length
  const project = featuredProjects[index]

  const go = (next: number) => {
    const i = (next + total) % total
    setIndex(i)
  }

  useEffect(() => {
    const el = slideRef.current
    if (!el) return
    gsap.fromTo(
      el,
      { autoAlpha: 0.35, x: 28 },
      { autoAlpha: 1, x: 0, duration: 0.55, ease: 'power3.out' },
    )
  }, [index])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(index + 1)
      if (e.key === 'ArrowLeft') go(index - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, total])

  return (
    <section id="work" className="relative z-10 overflow-hidden bg-void">
      <div className="mx-auto max-w-[1600px] px-6 pt-28 md:px-12 md:pt-36">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Chapter no="02" label="Selected Work" />
            <h2 className="display mt-8 text-5xl font-medium text-white md:text-7xl">
              BUILT WITH PURPOSE<span className="text-glacier">.</span>
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-mist">
              Real client projects — developed with AI assistance to move faster from idea to launch.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] tracking-[0.28em] text-mist">
              {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
            <button
              type="button"
              aria-label="Previous project"
              onClick={() => go(index - 1)}
              className="flex h-12 w-12 items-center justify-center border border-white/15 text-white transition-all duration-300 hover:border-glacier/50 hover:bg-glacier/10"
              data-cursor="hover"
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Next project"
              onClick={() => go(index + 1)}
              className="flex h-12 w-12 items-center justify-center border border-white/15 text-white transition-all duration-300 hover:border-glacier/50 hover:bg-glacier/10"
              data-cursor="hover"
            >
              →
            </button>
          </div>
        </div>
      </div>

      <div className="relative mx-auto mt-12 max-w-[1600px] px-6 pb-28 md:px-12">
        {/* side arrows — desktop floating */}
        <button
          type="button"
          aria-label="Previous project"
          onClick={() => go(index - 1)}
          className="absolute top-1/2 left-2 z-20 hidden h-14 w-14 -translate-y-1/2 items-center justify-center border border-white/20 bg-void/70 text-xl text-white backdrop-blur-sm transition-all hover:border-glacier/60 hover:bg-glacier/10 md:left-4 md:flex lg:left-0"
          data-cursor="hover"
        >
          ←
        </button>
        <button
          type="button"
          aria-label="Next project"
          onClick={() => go(index + 1)}
          className="absolute top-1/2 right-2 z-20 hidden h-14 w-14 -translate-y-1/2 items-center justify-center border border-white/20 bg-void/70 text-xl text-white backdrop-blur-sm transition-all hover:border-glacier/60 hover:bg-glacier/10 md:right-4 md:flex lg:right-0"
          data-cursor="hover"
        >
          →
        </button>

        <div ref={slideRef} className="md:px-16">
          <Link
            to={`/project/${project.slug}`}
            className="group relative block aspect-[16/10] overflow-hidden"
            data-cursor="hover"
          >
            <ProjectVisual
              name={project.name}
              index={project.index}
              cover={project.cover}
              className="h-full w-full transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-void/70 via-transparent to-transparent" />
            <span className="absolute top-5 left-5 font-mono text-xs text-white/60">
              {project.index}
            </span>
            <span className="absolute right-5 bottom-5 font-mono text-[10px] tracking-[0.3em] text-white/80 uppercase opacity-0 transition-opacity duration-400 group-hover:opacity-100">
              Open project ↗
            </span>
          </Link>

          <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <StatusBadge status={project.status} />
              <h3 className="display mt-4 text-3xl text-white md:text-5xl">{project.name}</h3>
              <p className="mt-2 font-mono text-[11px] tracking-[0.22em] text-glacier uppercase">
                {project.category}
              </p>
              <p className="mt-5 leading-relaxed text-mist">{project.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.stack.map((t) => (
                  <span
                    key={t}
                    className="border border-white/10 px-3 py-1 font-mono text-[10px] tracking-wider text-mist"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <Link
              to={`/project/${project.slug}`}
              className="font-mono text-[11px] tracking-[0.28em] text-mist uppercase transition-colors hover:text-white"
              data-cursor="hover"
            >
              Case study →
            </Link>
          </div>
        </div>

        {/* dots */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {featuredProjects.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              aria-label={`Go to ${p.name}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 transition-all duration-300 ${
                i === index ? 'w-8 bg-glacier' : 'w-1.5 bg-white/25 hover:bg-white/50'
              }`}
              data-cursor="hover"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
