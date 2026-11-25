import type { ReactNode } from 'react'
import { withBase } from '../lib/paths'

/** Chapter kicker: `01 — THE INTRODUCTION` */
export function Chapter({ no, label }: { no: string; label: string }) {
  return (
    <div className="kicker flex items-center gap-4" data-reveal>
      <span className="text-glacier">{no}</span>
      <span className="h-px w-10 bg-white/20" />
      <span>{label}</span>
    </div>
  )
}

/** Editorial headline with per-line masked reveal. */
export function SplitHeading({
  lines,
  className = '',
  as: Tag = 'h2',
}: {
  lines: string[]
  className?: string
  as?: 'h1' | 'h2' | 'h3'
}) {
  return (
    <Tag className={`display ${className}`}>
      {lines.map((line, i) => (
        <span className="line-mask" key={i} data-line-delay={`${i * 0.12}`}>
          <span>{line}</span>
        </span>
      ))}
    </Tag>
  )
}

/** Minimal premium button / link. */
export function ArrowLink({
  children,
  href,
  onClick,
  variant = 'solid',
  external,
}: {
  children: ReactNode
  href?: string
  onClick?: () => void
  variant?: 'solid' | 'ghost'
  external?: boolean
}) {
  const cls =
    variant === 'solid'
      ? 'group inline-flex items-center gap-3 border border-white/20 bg-white/[0.04] px-7 py-4 font-mono text-[11px] tracking-[0.3em] uppercase text-white transition-all duration-500 hover:border-glacier/60 hover:bg-glacier/10 hover:shadow-[0_0_40px_rgba(125,180,255,0.15)]'
      : 'group inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] uppercase text-mist transition-colors duration-300 hover:text-white'

  const arrow = (
    <span className="inline-block transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
      ↗
    </span>
  )

  if (href) {
    return (
      <a
        href={href}
        className={cls}
        data-cursor="hover"
        {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
        onClick={onClick}
      >
        {children} {arrow}
      </a>
    )
  }
  return (
    <button type="button" onClick={onClick} className={cls} data-cursor="hover">
      {children} {arrow}
    </button>
  )
}

/** Status pill for projects. */
export function StatusBadge({ status }: { status: string }) {
  const tone =
    status === 'live'
      ? 'text-emerald-300/90 border-emerald-300/20'
      : status === 'ongoing'
        ? 'text-glacier border-glacier/25'
        : 'text-mist border-white/15'
  return (
    <span
      className={`inline-flex items-center gap-2 border px-3 py-1 font-mono text-[10px] tracking-[0.25em] uppercase ${tone}`}
    >
      <span className="h-1 w-1 rounded-full bg-current" />
      {status}
    </span>
  )
}

/** Project cover image with an elegant generated fallback. */
export function ProjectVisual({
  name,
  index,
  cover,
  className = '',
}: {
  name: string
  index: string
  cover?: string
  className?: string
}) {
  return (
    <div className={`relative overflow-hidden bg-graphite ${className}`}>
      {/* generated placeholder — under the image if missing */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="absolute inset-0 opacity-80"
          style={{
            background:
              'radial-gradient(120% 90% at 20% 10%, rgba(125,180,255,0.10), transparent 55%), radial-gradient(100% 80% at 85% 90%, rgba(255,255,255,0.05), transparent 50%), linear-gradient(160deg, #101016 0%, #0a0a0e 100%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.22]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />
        <span className="display relative select-none text-[18vw] leading-none font-light text-white/[0.06] lg:text-[9vw]">
          {name.slice(0, 2)}
        </span>
        <span className="absolute right-5 bottom-4 font-mono text-[10px] tracking-[0.3em] text-white/25">
          {index}
        </span>
      </div>
      {cover && (
        <img
          src={withBase(cover)}
          alt={`${name} project visual`}
          loading="lazy"
          className="relative z-[1] h-full w-full object-cover opacity-0 transition-opacity duration-700"
          onLoad={(e) => {
            e.currentTarget.classList.replace('opacity-0', 'opacity-100')
          }}
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
      )}
    </div>
  )
}
