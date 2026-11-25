/**
 * ─────────────────────────────────────────────────────────────
 *  PROJECTS — fully editable.
 *
 *  · To add a screenshot: drop an image into  /public/projects/
 *    named  <slug>.jpg  (or set `cover` to any path/URL).
 *    Extra gallery shots: set `gallery: ['/projects/slug-2.jpg', …]`
 *  · `url` / `caseStudyUrl`: leave '' to hide the button.
 *  · `status`: 'live' | 'ongoing' | 'completed' | 'archived'
 *  · `featured: true` puts the project in the cinematic showcase;
 *    everything else lives in the expandable archive.
 * ─────────────────────────────────────────────────────────────
 */

export type ProjectStatus = 'live' | 'ongoing' | 'completed' | 'archived'

export interface Project {
  slug: string
  index: string
  name: string
  category: string
  description: string
  role: string
  stack: string[]
  status: ProjectStatus
  url?: string
  caseStudyUrl?: string
  cover?: string
  gallery?: string[]
  featured?: boolean
}

export const projects: Project[] = [
  {
    slug: 'kai-sushi',
    index: '01',
    name: 'KAI SUSHI',
    category: 'Restaurant Website Development',
    description:
      'A restaurant website built for a sushi dining experience — menu presentation, location details, and ordering pathways in a clean, fast layout.',
    role: 'Design & development, deployment.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    status: 'live',
    url: '',
    caseStudyUrl: '',
    cover: '/projects/kai-sushi.jpg',
    featured: true,
  },
  {
    slug: 'korea-house',
    index: '02',
    name: 'KOREA HOUSE',
    category: 'Restaurant Website Development',
    description:
      'A Korean restaurant website with clear menu presentation, brand storytelling, and customer-facing contact pathways.',
    role: 'Design & development, deployment.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    status: 'live',
    url: '',
    caseStudyUrl: '',
    cover: '/projects/korea-house.jpg',
    featured: true,
  },
  {
    slug: 'daldal-bunsik',
    index: '03',
    name: 'DALDAL BUNSIK',
    category: 'Restaurant Website Development',
    description:
      'A Korean street-food restaurant website — menu, location, and ordering-friendly presentation built for a fast-casual brand.',
    role: 'Design & development, deployment.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    status: 'live',
    url: '',
    caseStudyUrl: '',
    cover: '/projects/daldal-bunsik.jpg',
    featured: true,
  },
  {
    slug: 'pikes-poke-bowl',
    index: '04',
    name: 'PIKES POKE BOWL',
    category: 'Restaurant Website Development',
    description:
      'A poke restaurant website with menu presentation, brand visuals, and clear pathways for customers to find the location and order.',
    role: 'Design & development, deployment.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    status: 'live',
    url: '',
    caseStudyUrl: '',
    cover: '/projects/pikes-poke-bowl.jpg',
    featured: true,
  },
  {
    slug: 'hoshi-ramen',
    index: '05',
    name: 'HOSHI RAMEN',
    category: 'Restaurant Website Development',
    description:
      'A ramen restaurant website focused on menu presentation, atmosphere, and ordering pathways.',
    role: 'Design & development, deployment.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    status: 'live',
    url: '',
    caseStudyUrl: '',
    cover: '/projects/hoshi-ramen.jpg',
    featured: true,
  },
  {
    slug: 'big-sky-burger',
    index: '06',
    name: 'BIG SKY BURGER',
    category: 'Restaurant Website Development',
    description:
      'A fast-casual burger restaurant website with menu, location details, and a clean customer-facing layout.',
    role: 'Design & development, deployment.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    status: 'live',
    url: '',
    caseStudyUrl: '',
    cover: '/projects/big-sky-burger.jpg',
    featured: true,
  },
  {
    slug: 'el-potrillo',
    index: '07',
    name: 'EL POTRILLO',
    category: 'Restaurant Website Development',
    description:
      'A Mexican restaurant website with menu presentation and local business information.',
    role: 'Design & development, deployment.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    status: 'live',
    url: '',
    caseStudyUrl: '',
    cover: '/projects/el-potrillo.jpg',
    featured: true,
  },
  {
    slug: 'top-sushi',
    index: '08',
    name: 'TOP SUSHI',
    category: 'Restaurant Website Development',
    description:
      'A sushi restaurant website build — menu, brand presentation, and contact pathways for diners.',
    role: 'Design & development, deployment.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    status: 'live',
    url: '',
    caseStudyUrl: '',
    cover: '/projects/top-sushi.jpg',
    featured: true,
  },
  {
    slug: 'samwon-garden',
    index: '09',
    name: 'SAMWON GARDEN',
    category: 'Restaurant Website Development',
    description:
      'A Korean BBQ restaurant website with menu presentation and location-focused customer experience.',
    role: 'Design & development, deployment.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    status: 'live',
    url: '',
    caseStudyUrl: '',
    cover: '/projects/samwon-garden.jpg',
    featured: true,
  },
  {
    slug: 'so-gong-dong',
    index: '10',
    name: 'SO GONG DONG TOFU HOUSE',
    category: 'Restaurant Website Development',
    description:
      'A Korean tofu house restaurant website — services, menu, and booking-friendly information presented clearly.',
    role: 'Design & development, deployment.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    status: 'live',
    url: '',
    caseStudyUrl: '',
    cover: '/projects/so-gong-dong.jpg',
    featured: true,
  },

  /* ─────────── ARCHIVE — additional website projects ─────────── */

  {
    slug: 'gloriafood-doordash',
    index: 'A1',
    name: 'GLORIAFOOD → DOORDASH',
    category: 'Backend Integration & Automation',
    description:
      'A headless integration service that receives GloriaFood orders and dispatches DoorDash deliveries automatically — webhook ingestion, order translation, and status sync.',
    role: 'System design, backend development, API orchestration, deployment.',
    stack: ['Node.js', 'TypeScript', 'REST APIs', 'Webhooks', 'Render'],
    status: 'live',
  },
  {
    slug: 'mechanics-mv',
    index: 'A2',
    name: 'MECHANICS MV',
    category: 'Automotive Business Website',
    description:
      'A website for an automotive service business — services, trust signals and contact flows.',
    role: 'Design & development, deployment.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    status: 'live',
  },
  {
    slug: 'dermaphi-usa',
    index: 'A3',
    name: 'DERMAPHI USA',
    category: 'Business Website Development',
    description:
      'A clean web presence for a professional beauty & skincare business — brand-first presentation with clear service pathways.',
    role: 'Design & development, deployment.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    status: 'live',
  },
  {
    slug: 'coway-dallas',
    index: 'A4',
    name: 'COWAY DALLAS',
    category: 'Business Website Development',
    description:
      'A product-led business website for a Coway dealer — product presentation, inquiry flows and local business information.',
    role: 'Design & development, deployment.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    status: 'live',
  },
  {
    slug: 'pan-asian-noodle',
    index: 'A5',
    name: 'PAN ASIAN NOODLE',
    category: 'Restaurant Website',
    description: 'Asian noodle restaurant website build.',
    role: 'Design & development.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    status: 'live',
  },
  {
    slug: 'lpc-qr-platform',
    index: 'A6',
    name: 'LPC QR PLATFORM',
    category: 'Multi-Location QR / Landing System',
    description:
      'A family of QR-driven landing experiences deployed for 25+ restaurant, salon and retail locations — one system, many branded deployments.',
    role: 'System build, per-location deployments.',
    stack: ['HTML', 'CSS', 'JavaScript', 'cPanel'],
    status: 'live',
  },
  {
    slug: 'inventory-system',
    index: 'A7',
    name: 'INVENTORY SYSTEM',
    category: 'Custom Web Application',
    description: 'An internal inventory management application with database-backed stock tracking.',
    role: 'Full-stack development.',
    stack: ['PHP', 'MySQL', 'JavaScript'],
    status: 'ongoing',
  },
  {
    slug: 'trusted-waiver-form',
    index: 'A8',
    name: 'TRUSTED WAIVER FORM',
    category: 'Digital Forms & Workflow',
    description: 'A digital waiver capture system replacing paper forms with a validated online flow.',
    role: 'Development & deployment.',
    stack: ['PHP', 'MySQL', 'JavaScript'],
    status: 'live',
  },
  {
    slug: 'sms-campaigns',
    index: 'A9',
    name: 'SMS CAMPAIGNS',
    category: 'Business Automation',
    description: 'Campaign tooling for business SMS outreach and customer re-engagement.',
    role: 'Development.',
    stack: ['Node.js', 'APIs'],
    status: 'ongoing',
  },
  {
    slug: 'celine-medical-spa',
    index: 'A10',
    name: 'CELINE MEDICAL SPA',
    category: 'Business Website',
    description: 'Website for a medical spa — services, brand presentation and booking pathways.',
    role: 'Design & development.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    status: 'live',
  },
  {
    slug: '5th-ave-nail-spa',
    index: 'A11',
    name: '5TH AVE NAIL SPA',
    category: 'Beauty Business Website',
    description: 'Nail spa website with services and booking information.',
    role: 'Design & development.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    status: 'live',
  },
  {
    slug: 'pearl-nail-bar',
    index: 'A12',
    name: 'PEARL NAIL BAR',
    category: 'Beauty Business Website',
    description: 'Nail bar website build.',
    role: 'Design & development.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    status: 'live',
  },
  {
    slug: 'pink-nail-and-spa',
    index: 'A13',
    name: 'PINK NAIL & SPA',
    category: 'Beauty Business Website',
    description: 'Nail salon website build.',
    role: 'Design & development.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    status: 'live',
  },
  {
    slug: 'royal-beauty-care',
    index: 'A14',
    name: 'ROYAL BEAUTY CARE',
    category: 'Beauty Business Website',
    description: 'Beauty care business website.',
    role: 'Design & development.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    status: 'live',
  },
  {
    slug: 'jc-wigs',
    index: 'A15',
    name: 'JC WIGS',
    category: 'Retail Website',
    description: 'Retail website for a wig and beauty products business.',
    role: 'Design & development.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    status: 'live',
  },
  {
    slug: 'havana-sauna',
    index: 'A16',
    name: 'HAVANA SAUNA',
    category: 'Service Business Website',
    description: 'Sauna and wellness business website.',
    role: 'Design & development.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    status: 'live',
  },
  {
    slug: 'bustos-battery',
    index: 'A17',
    name: 'BUSTOS BATTERY',
    category: 'Automotive Business Website',
    description: 'Battery and automotive services business website.',
    role: 'Design & development.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    status: 'live',
  },
  {
    slug: 'champa-liquor',
    index: 'A18',
    name: 'CHAMPA LIQUOR',
    category: 'Retail Website',
    description: 'Liquor store business website.',
    role: 'Design & development.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    status: 'live',
  },
  {
    slug: 'super-wash-and-dry',
    index: 'A19',
    name: 'SUPER WASH & DRY',
    category: 'Service Business Website',
    description: 'Laundromat business website.',
    role: 'Design & development.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    status: 'live',
  },
  {
    slug: 'townsquare-laundromat',
    index: 'A20',
    name: 'TOWN SQUARE LAUNDROMAT',
    category: 'Service Business Website',
    description: 'Laundromat business website.',
    role: 'Design & development.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    status: 'live',
  },
  {
    slug: 'dryclean-pickup-delivery',
    index: 'A21',
    name: 'DRYCLEAN PICKUP & DELIVERY',
    category: 'Service Business Website',
    description: 'Dry cleaning pickup & delivery service website.',
    role: 'Design & development.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    status: 'live',
  },
  {
    slug: 'evergreen',
    index: 'A22',
    name: 'EVERGREEN',
    category: 'Business Website',
    description: 'Business website build.',
    role: 'Design & development.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    status: 'live',
  },
  {
    slug: 'vista',
    index: 'A23',
    name: 'VISTA',
    category: 'Business Website',
    description: 'Business website build.',
    role: 'Design & development.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    status: 'live',
  },
]

export const featuredProjects = projects.filter((p) => p.featured)
export const archiveProjects = projects.filter((p) => !p.featured)
export const getProject = (slug: string) => projects.find((p) => p.slug === slug)
