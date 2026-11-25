import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { gsap } from '../lib/gsap'
import { scrollToTarget } from '../hooks/useSmoothScroll'

const LINKS = [
  { label: 'About', target: '#about' },
  { label: 'Work', target: '#work' },
  { label: 'Expertise', target: '#expertise' },
  { label: 'Process', target: '#process' },
  { label: 'Contact', target: '#contact' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const overlay = overlayRef.current
    if (!overlay) return
    if (open) {
      gsap.set(overlay, { display: 'flex' })
      gsap.fromTo(overlay, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: 'power4.inOut' })
      gsap.fromTo(
        overlay.querySelectorAll('.menu-link'),
        { yPercent: 120 },
        { yPercent: 0, duration: 0.9, stagger: 0.07, delay: 0.25, ease: 'power4.out' },
      )
    } else {
      gsap.to(overlay, {
        clipPath: 'inset(0 0 100% 0)',
        duration: 0.7,
        ease: 'power4.inOut',
        onComplete: () => gsap.set(overlay, { display: 'none' }),
      })
    }
  }, [open])

  const go = (target: string) => {
    setOpen(false)
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => scrollToTarget(target), 350)
    } else {
      setTimeout(() => scrollToTarget(target), open ? 450 : 0)
    }
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-void/70 backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 md:px-12">
          <Link
            to="/"
            onClick={() => scrollToTarget(0)}
            className="display text-lg font-semibold tracking-tight text-white"
            data-cursor="hover"
          >
            JEREMIAH<span className="text-glacier">.</span>
          </Link>

          <nav className="hidden items-center gap-10 md:flex">
            {LINKS.map((l) => (
              <button
                key={l.label}
                onClick={() => go(l.target)}
                className="link-underline font-mono text-[11px] tracking-[0.25em] text-mist uppercase transition-colors hover:text-white"
                data-cursor="hover"
              >
                {l.label}
              </button>
            ))}
          </nav>

          <button
            onClick={() => setOpen(!open)}
            className="group relative z-[60] flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
            aria-label="Menu"
          >
            <span
              className={`h-px w-6 bg-white transition-all duration-400 ${open ? 'translate-y-[3.5px] rotate-45' : ''}`}
            />
            <span
              className={`h-px w-6 bg-white transition-all duration-400 ${open ? '-translate-y-[3.5px] -rotate-45' : ''}`}
            />
          </button>
        </div>
      </header>

      {/* mobile overlay menu */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-40 hidden flex-col justify-center bg-charcoal px-8"
        style={{ clipPath: 'inset(0 0 100% 0)' }}
      >
        {LINKS.map((l, i) => (
          <div key={l.label} className="overflow-hidden py-2">
            <button
              onClick={() => go(l.target)}
              className="menu-link display block text-5xl font-medium text-white"
            >
              <span className="mr-4 font-mono text-sm text-glacier">0{i + 1}</span>
              {l.label}
            </button>
          </div>
        ))}
      </div>
    </>
  )
}
