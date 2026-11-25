/**
 * ─────────────────────────────────────────────────────────────
 *  PERSONAL PROFILE — edit everything here.
 *  Links left as empty strings are hidden on the site,
 *  so nothing is ever invented on your behalf.
 * ─────────────────────────────────────────────────────────────
 */

export const profile = {
  name: 'JEREMIAH',
  headline: 'BUILDING DIGITAL EXPERIENCES. ENGINEERING REAL SOLUTIONS.',
  roles: ['Web Developer', 'Software Developer', 'Digital Solutions Builder'],
  intro:
    'I transform ideas into functional websites, business systems, and digital experiences.',

  about: {
    headline: 'THE PERSON BEHIND THE CODE.',
    paragraphs: [
      "I'm Jeremiah, a developer passionate about creating digital experiences and practical technology solutions.",
      'My work involves building modern websites, developing business systems, connecting third-party platforms, integrating APIs, and managing deployment environments.',
      'I enjoy solving technical challenges and transforming business requirements into functional digital products.',
      'I also work with AI tools to move faster — using them as assistance while I design, develop, debug, and ship real client projects.',
    ],
    facets: [
      {
        label: 'Background',
        text: 'A developer shaped by real client work — websites, integrations, and business systems shipped for businesses across industries.',
      },
      {
        label: 'What I Do',
        text: 'I design, build, integrate and deploy: from marketing sites to custom web applications, payment systems, and backend automations.',
      },
      {
        label: 'Approach',
        text: 'Understand the business first. Build the simplest system that solves the problem well, then refine it until it feels effortless.',
      },
      {
        label: 'AI-Assisted Work',
        text: 'I use AI as a development assistant across my projects — speeding up coding, debugging, content structure, and problem-solving while I stay in control of the build, decisions, and delivery.',
      },
      {
        label: 'Technical Interests',
        text: 'API integrations, automation pipelines, e-commerce platforms, and the craft of fast, elegant interfaces.',
      },
      {
        label: 'Goals',
        text: 'To keep building digital products that businesses genuinely rely on — and to keep raising the bar on every build.',
      },
    ],
  },

  /** Replace with your own photo: put it at /public/profile.jpg */
  photo: '/profile.jpg',

  /**
   * CONTACT & SOCIAL — fill these in with your real links.
   * Empty string = the link is not rendered.
   */
  links: {
    email: 'mailto:yu.jeremiah612@gmail.com',
    github: 'https://github.com/yujeremiah612-debug',
    linkedin: '',
    other: [] as { label: string; url: string }[],
  },
}

export const capabilities = [
  { title: 'Website Development', note: 'Marketing sites, brand sites, restaurant & service businesses.' },
  { title: 'Web Application Development', note: 'Custom tools, dashboards, spreadsheet-style systems.' },
  { title: 'Backend Development', note: 'PHP & Node.js services, authentication, data layers.' },
  { title: 'API Integration', note: 'GloriaFood, DoorDash, and third-party platform connections.' },
  { title: 'E-Commerce Solutions', note: 'Storefronts, payments, and order flows for local businesses.' },
  { title: 'Business Automation', note: 'Webhooks, scheduled jobs, platform-to-platform sync.' },
  { title: 'Hosting & Deployment', note: 'cPanel, Render, DNS, domains, CI with GitHub Actions.' },
]

export const stack: { group: string; items: string[] }[] = [
  { group: 'Frontend', items: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Tailwind CSS'] },
  { group: 'Backend', items: ['PHP', 'Node.js', 'REST APIs', 'Webhooks'] },
  { group: 'Database', items: ['MySQL', 'Database Management', 'CRUD Operations'] },
  { group: 'Tools', items: ['GitHub', 'Cursor', 'AI Assistants', 'WordPress', 'Docker', 'cPanel', 'Render'] },
  { group: 'Platforms & Integrations', items: ['GloriaFood', 'DoorDash'] },
  { group: 'Hosting & Deployment', items: ['GitHub Actions', 'cPanel', 'DNS Management', 'Domain Management', 'Website Deployment'] },
]

export const process = [
  {
    step: '01',
    title: 'DISCOVER',
    text: 'Understanding business requirements and project goals.',
  },
  {
    step: '02',
    title: 'DESIGN',
    text: 'Planning layouts, user experience, and system architecture.',
  },
  {
    step: '03',
    title: 'DEVELOP',
    text: 'Building websites, applications, APIs, and integrations.',
  },
  {
    step: '04',
    title: 'DEPLOY',
    text: 'Testing, deployment, optimization, and maintenance.',
  },
]
