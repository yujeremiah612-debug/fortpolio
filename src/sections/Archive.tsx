import { useState } from 'react'
import { Link } from 'react-router-dom'
import { archiveProjects } from '../data/projects'
import { StatusBadge } from '../components/ui'
import { ScrollTrigger } from '../lib/gsap'

export default function Archive() {
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? archiveProjects : archiveProjects.slice(0, 6)

  const toggle = () => {
    setExpanded((v) => !v)
    // new rows change page height — refresh scroll measurements
    requestAnimationFrame(() => ScrollTrigger.refresh())
  }

  return (
    <section className="hairline relative z-10 border-t">
      <div className="mx-auto max-w-[1600px] px-6 py-24 md:px-12 md:py-32">
        <div className="flex items-end justify-between">
          <div>
            <p className="kicker mb-4">The Archive</p>
            <h3 className="display text-3xl font-medium text-white md:text-5xl">
              MORE BUILDS<span className="text-glacier">.</span>
            </h3>
          </div>
          <span className="hidden font-mono text-xs text-mist md:block">
            {archiveProjects.length} additional projects
          </span>
        </div>

        <ul className="mt-14">
          {visible.map((p) => (
            <li key={p.slug}>
              <Link
                to={`/project/${p.slug}`}
                className="group hairline grid grid-cols-[1fr_auto] items-center gap-4 border-t py-5 transition-all duration-400 last:border-b hover:bg-white/[0.02] hover:pl-4 md:grid-cols-[3rem_1fr_1fr_auto_auto]"
                data-cursor="hover"
              >
                <span className="hidden font-mono text-[10px] text-glacier/60 md:block">
                  {p.index}
                </span>
                <span className="display text-lg text-silver transition-colors group-hover:text-white md:text-xl">
                  {p.name}
                </span>
                <span className="hidden font-mono text-[10px] tracking-[0.2em] text-mist/70 uppercase md:block">
                  {p.category}
                </span>
                <span className="hidden md:block">
                  <StatusBadge status={p.status} />
                </span>
                <span className="text-mist transition-all duration-400 group-hover:translate-x-1 group-hover:text-white">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {archiveProjects.length > 6 && (
          <div className="relative z-20 mt-10 text-center">
            <button
              type="button"
              onClick={toggle}
              className="pointer-events-auto border border-white/15 px-8 py-3.5 font-mono text-[11px] tracking-[0.3em] text-mist uppercase transition-all duration-500 hover:border-glacier/50 hover:text-white"
              data-cursor="hover"
            >
              {expanded
                ? 'Collapse archive −'
                : `Expand full archive (${archiveProjects.length}) +`}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
