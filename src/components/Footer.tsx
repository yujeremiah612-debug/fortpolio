import { profile } from '../data/profile'
import { scrollToTarget } from '../hooks/useSmoothScroll'

export default function Footer() {
  const { links } = profile
  const socials = [
    links.github && { label: 'GitHub', url: links.github },
    links.linkedin && { label: 'LinkedIn', url: links.linkedin },
    links.email && { label: 'Email', url: links.email },
    ...links.other,
  ].filter(Boolean) as { label: string; url: string }[]

  return (
    <footer className="hairline border-t">
      <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-6 px-6 py-10 md:flex-row md:px-12">
        <span className="display text-sm font-semibold text-white">
          JEREMIAH<span className="text-glacier">.</span>
        </span>
        <div className="flex items-center gap-8">
          {socials.length > 0 ? (
            socials.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="link-underline font-mono text-[10px] tracking-[0.25em] text-mist uppercase hover:text-white"
              >
                {s.label}
              </a>
            ))
          ) : (
            <span className="font-mono text-[10px] tracking-[0.2em] text-white/25 uppercase">
              add your links in src/data/profile.ts
            </span>
          )}
        </div>
        <button
          onClick={() => scrollToTarget(0)}
          className="link-underline font-mono text-[10px] tracking-[0.25em] text-mist uppercase hover:text-white"
          data-cursor="hover"
        >
          Back to top ↑
        </button>
      </div>
      <div className="hairline border-t py-4 text-center font-mono text-[10px] tracking-[0.3em] text-white/20 uppercase">
        © {new Date().getFullYear()} Jeremiah — Built with React · Three.js · GSAP
      </div>
    </footer>
  )
}
