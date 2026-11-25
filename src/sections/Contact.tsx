import { useState, type FormEvent } from 'react'
import { profile } from '../data/profile'
import { Chapter, SplitHeading } from '../components/ui'

const PROJECT_TYPES = [
  'Business Website',
  'Web Application',
  'API Integration',
  'E-Commerce',
  'Automation',
  'Something Else',
]

export default function Contact() {
  const [sent, setSent] = useState<string | null>(null)
  const { links } = profile

  const socials = [
    links.github && { label: 'GitHub', url: links.github },
    links.linkedin && { label: 'LinkedIn', url: links.linkedin },
    links.email && { label: 'Email', url: links.email },
    ...links.other,
  ].filter(Boolean) as { label: string; url: string }[]

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const subject = `Project inquiry — ${data.get('type')}`
    const body = `Name: ${data.get('name')}\nEmail: ${data.get('email')}\nProject type: ${data.get('type')}\n\n${data.get('message')}`

    if (links.email) {
      const addr = links.email.replace(/^mailto:/, '')
      window.location.href = `mailto:${addr}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      setSent('Opening your email client…')
    } else {
      setSent(
        'Form is ready — add your email address in src/data/profile.ts (links.email) to start receiving messages.',
      )
    }
  }

  return (
    <section className="hairline relative overflow-hidden border-t" id="contact">
      {/* ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(70% 55% at 50% 110%, rgba(125,180,255,0.12), transparent 65%)',
        }}
      />

      <div className="relative mx-auto max-w-[1600px] px-6 py-32 md:px-12 md:py-48">
        <Chapter no="06" label="Let's Connect" />
        <SplitHeading
          lines={["LET'S CREATE", 'SOMETHING', 'MEANINGFUL.']}
          className="mt-10 text-6xl font-medium text-white sm:text-7xl lg:text-[7.5rem]"
        />
        <p className="mt-10 max-w-lg text-lg leading-relaxed text-mist" data-reveal>
          Have a project, business idea, or technical challenge? Let's turn it into something real.
        </p>

        <div className="mt-20 grid gap-16 lg:grid-cols-12">
          {/* form */}
          <form onSubmit={onSubmit} className="space-y-10 lg:col-span-7" data-reveal>
            <div className="grid gap-10 md:grid-cols-2">
              <Field label="Your name" name="name" type="text" placeholder="Jane Doe" />
              <Field label="Your email" name="email" type="email" placeholder="jane@company.com" />
            </div>

            <div>
              <label className="kicker mb-4 block">Project type</label>
              <div className="flex flex-wrap gap-2">
                {PROJECT_TYPES.map((t, i) => (
                  <label key={t} className="cursor-pointer" data-cursor="hover">
                    <input
                      type="radio"
                      name="type"
                      value={t}
                      defaultChecked={i === 0}
                      className="peer sr-only"
                    />
                    <span className="inline-block border border-white/10 px-4 py-2 font-mono text-[10px] tracking-[0.2em] text-mist uppercase transition-all duration-300 peer-checked:border-glacier/60 peer-checked:bg-glacier/10 peer-checked:text-white hover:border-white/30">
                      {t}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="message" className="kicker mb-4 block">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                placeholder="Tell me about the idea…"
                className="w-full resize-none border-b border-white/15 bg-transparent pb-3 text-lg text-white placeholder:text-white/20 focus:border-glacier focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="group inline-flex items-center gap-3 border border-white/20 bg-white/[0.04] px-10 py-5 font-mono text-[11px] tracking-[0.3em] text-white uppercase transition-all duration-500 hover:border-glacier/60 hover:bg-glacier/10 hover:shadow-[0_0_50px_rgba(125,180,255,0.2)]"
              data-cursor="hover"
            >
              Send message
              <span className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-0.5">
                ↗
              </span>
            </button>
            {sent && <p className="font-mono text-xs leading-relaxed text-glacier">{sent}</p>}
          </form>

          {/* direct links */}
          <div className="lg:col-span-5" data-reveal data-reveal-delay="0.2">
            <p className="kicker mb-8">Elsewhere</p>
            {socials.length > 0 ? (
              <ul className="space-y-1">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group hairline flex items-center justify-between border-t py-5 last:border-b"
                      data-cursor="hover"
                    >
                      <span className="display text-2xl text-silver transition-colors group-hover:text-white">
                        {s.label}
                      </span>
                      <span className="text-mist transition-transform duration-400 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-glacier">
                        ↗
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="hairline border p-8">
                <p className="leading-relaxed text-mist">
                  Your professional links live in{' '}
                  <code className="font-mono text-xs text-glacier">src/data/profile.ts</code>.
                  Add GitHub, LinkedIn, email or anything else — they'll appear here
                  automatically. Nothing is shown until you add the real links.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function Field({
  label,
  name,
  type,
  placeholder,
}: {
  label: string
  name: string
  type: string
  placeholder: string
}) {
  return (
    <div>
      <label htmlFor={name} className="kicker mb-4 block">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className="w-full border-b border-white/15 bg-transparent pb-3 text-lg text-white placeholder:text-white/20 focus:border-glacier focus:outline-none"
      />
    </div>
  )
}
