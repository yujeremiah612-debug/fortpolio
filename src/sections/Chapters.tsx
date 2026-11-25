import { Chapter, SplitHeading } from '../components/ui'
import { capabilities } from '../data/profile'

/* 01 — THE INTRODUCTION */
export function Intro() {
  return (
    <section className="relative mx-auto max-w-[1600px] px-6 py-32 md:px-12 md:py-48">
      <Chapter no="01" label="The Introduction" />
      <SplitHeading
        lines={['EVERY GREAT DIGITAL', 'EXPERIENCE STARTS', 'WITH AN IDEA.']}
        className="mt-10 text-5xl font-medium text-white sm:text-6xl lg:text-8xl"
      />
      <div className="mt-14 grid gap-10 md:grid-cols-2">
        <p className="max-w-xl text-lg leading-relaxed text-mist" data-reveal>
          I'm a developer who turns those ideas into working software — modern websites,
          business systems, and digital solutions that people actually use every day.
        </p>
        <p className="max-w-xl text-lg leading-relaxed text-mist" data-reveal data-reveal-delay="0.15">
          From a restaurant's first website to a multi-platform integration pipeline, every build
          starts the same way: understand the problem, then engineer the cleanest path through it.
        </p>
      </div>
    </section>
  )
}

/* 02 — THE PURPOSE */
export function Purpose() {
  return (
    <section className="hairline relative border-t">
      <div className="mx-auto max-w-[1600px] px-6 py-32 md:px-12 md:py-48">
        <Chapter no="02" label="The Purpose" />
        <SplitHeading
          lines={['NOT JUST WEBSITES.', 'SOLUTIONS THAT WORK.']}
          className="mt-10 text-5xl font-medium text-white sm:text-6xl lg:text-8xl"
        />
        <div className="mt-16 grid gap-px bg-white/5 md:grid-cols-3">
          {[
            {
              t: 'Business Websites',
              d: 'Sites built around a business goal — presence, trust, and conversion for real companies.',
            },
            {
              t: 'Applications & Systems',
              d: 'Custom web applications: booking systems, management tools, internal platforms.',
            },
            {
              t: 'Integration & Automation',
              d: 'Backends that connect platforms — payments, orders, deliveries, affiliates — and run themselves.',
            },
          ].map((c, i) => (
            <div
              key={c.t}
              className="group bg-void p-10 transition-colors duration-500 hover:bg-graphite/60"
              data-reveal
              data-reveal-delay={`${i * 0.12}`}
            >
              <span className="font-mono text-xs text-glacier">0{i + 1}</span>
              <h3 className="display mt-4 text-2xl text-white">{c.t}</h3>
              <p className="mt-4 leading-relaxed text-mist">{c.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* Capabilities — expanded after the ascent */
export function WhatIBuild() {
  return (
    <section className="hairline relative border-t" id="expertise">
      <div className="mx-auto max-w-[1600px] px-6 py-32 md:px-12 md:py-48">
        <Chapter no="01" label="Capabilities" />
        <SplitHeading
          lines={['EVERYTHING I BUILD', 'FOR REAL BUSINESSES.']}
          className="mt-10 text-5xl font-medium text-white sm:text-6xl lg:text-8xl"
        />
        <ul className="mt-20">
          {capabilities.map((c, i) => (
            <li
              key={c.title}
              className="group hairline flex flex-col gap-2 border-t py-8 transition-all duration-500 last:border-b hover:pl-4 md:flex-row md:items-baseline md:gap-10"
              data-reveal
              data-reveal-delay={`${i * 0.05}`}
              data-cursor="hover"
            >
              <span className="w-10 shrink-0 font-mono text-xs text-glacier/70">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="display w-full text-3xl font-medium text-silver transition-colors duration-500 group-hover:text-white md:w-1/2 md:text-4xl">
                {c.title}
              </h3>
              <p className="text-sm leading-relaxed text-mist/70 transition-colors duration-500 group-hover:text-mist md:max-w-sm">
                {c.note}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
