import { useEffect } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { getProject, projects } from '../data/projects'
import { StatusBadge, ProjectVisual, ArrowLink } from '../components/ui'
import { useReveals } from '../hooks/useReveals'
import { withBase } from '../lib/paths'

export default function ProjectPage() {
  const { slug } = useParams()
  const project = slug ? getProject(slug) : undefined

  useReveals(true)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!project) return <Navigate to="/" replace />

  const idx = projects.indexOf(project)
  const next = projects[(idx + 1) % projects.length]

  return (
    <main className="relative noise">
      {/* header */}
      <section className="mx-auto max-w-[1600px] px-6 pt-36 pb-16 md:px-12 md:pt-48">
        <Link
          to="/"
          className="link-underline font-mono text-[11px] tracking-[0.3em] text-mist uppercase hover:text-white"
          data-cursor="hover"
        >
          ← Back to all work
        </Link>

        <div className="mt-12 flex flex-wrap items-center gap-4" data-reveal>
          <span className="font-mono text-sm text-glacier">{project.index}</span>
          <StatusBadge status={project.status} />
          <span className="font-mono text-[11px] tracking-[0.25em] text-mist uppercase">
            {project.category}
          </span>
        </div>

        <h1 className="display mt-6 text-5xl font-medium text-white sm:text-7xl lg:text-[7vw]">
          <span className="line-mask">
            <span>{project.name}</span>
          </span>
        </h1>
      </section>

      {/* hero visual */}
      <section className="mx-auto max-w-[1600px] px-6 md:px-12" data-reveal>
        <ProjectVisual
          name={project.name}
          index={project.index}
          cover={project.cover}
          className="aspect-[16/9] w-full"
        />
      </section>

      {/* details */}
      <section className="mx-auto grid max-w-[1600px] gap-16 px-6 py-24 md:px-12 lg:grid-cols-12">
        <div className="lg:col-span-7" data-reveal>
          <p className="kicker mb-6">Overview</p>
          <p className="text-xl leading-relaxed text-silver md:text-2xl">{project.description}</p>
          <p className="mt-8 text-lg leading-relaxed text-mist">
            <span className="text-silver">My role — </span>
            {project.role}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-mist/80">
            Built with AI assistance — used to speed up development while I own the architecture,
            implementation, and delivery.
          </p>
          <div className="mt-12 flex flex-wrap gap-6">
            {project.url && (
              <ArrowLink href={project.url} external>
                View live project
              </ArrowLink>
            )}
            {project.caseStudyUrl && (
              <ArrowLink href={project.caseStudyUrl} external variant="ghost">
                Full case study
              </ArrowLink>
            )}
          </div>
        </div>

        <aside className="lg:col-span-5" data-reveal data-reveal-delay="0.15">
          <p className="kicker mb-6">Technology</p>
          <ul className="space-y-1">
            {project.stack.map((t) => (
              <li
                key={t}
                className="hairline display border-t py-4 text-2xl text-mist transition-colors last:border-b hover:text-white"
              >
                {t}
              </li>
            ))}
          </ul>
        </aside>
      </section>

      {/* gallery */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="mx-auto max-w-[1600px] space-y-8 px-6 pb-24 md:px-12">
          {project.gallery.map((src) => (
            <img
              key={src}
              src={withBase(src)}
              alt={`${project.name} screenshot`}
              loading="lazy"
              className="w-full"
              data-reveal
            />
          ))}
        </section>
      )}

      {/* next project */}
      <section className="hairline border-t">
        <Link
          to={`/project/${next.slug}`}
          className="group mx-auto block max-w-[1600px] px-6 py-24 md:px-12"
          data-cursor="hover"
        >
          <p className="kicker mb-6">Next project</p>
          <p className="display text-4xl font-medium text-mist transition-colors duration-500 group-hover:text-white md:text-7xl">
            {next.name}{' '}
            <span className="inline-block text-glacier transition-transform duration-500 group-hover:translate-x-3">
              →
            </span>
          </p>
        </Link>
      </section>
    </main>
  )
}
