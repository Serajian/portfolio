/**
 * ─────────────────────────────────────────────────────────────
 *  SITE CONTENT — this is the only file you need to edit
 *  to change what the site says. Everything else is layout.
 *
 *  Values marked `TODO` are placeholders from the mockup.
 *  Replace them one section at a time.
 * ─────────────────────────────────────────────────────────────
 */

export interface NavItem {
  /** must match the section's DOM id */
  id: string;
  label: string;
  /** accent hue (0–360) the whole theme animates to on this section */
  hue: number;
}

export interface MetaItem {
  label: string;
  value: string;
}

export interface Skill {
  label: string;
  /** 0–100 */
  value: number;
}

export interface Stat {
  /** the number that counts up */
  value: number;
  /** rendered after the number, e.g. ".9" or "+" */
  suffix?: string;
  label: string;
}

export interface Service {
  /** short glyph used as the icon — keep it 1–3 characters */
  icon: string;
  title: string;
  body: string;
}

export interface Project {
  /** shown above the title, e.g. "001 / LEDGER" */
  code: string;
  title: string;
  body: string;
  stack: string;
  href: string;
}

export interface ContactLink {
  label: string;
  value: string;
  href: string;
}

export interface Social {
  /** 2–3 characters shown in the sidebar */
  label: string;
  title: string;
  href: string;
}

export const site = {
  /* ─────────── identity / <head> ─────────── */
  meta: {
    // TODO: real name
    name: 'Mohsen Serajian',
    // TODO: real title
    role: 'Backend Engineer · Go',
    // TODO: shown in the browser tab and search results
    title: 'Mohsen Serajian — Backend Engineer',
    description:
      'Backend engineer building APIs, distributed systems and data pipelines in Go.',
    // sidebar logo: rendered as ~/handle
    handle: 'mohsen',
    /** canonical domain — keep in sync with `site` in astro.config.mjs */
    url: 'https://mohsenserajian.ir',
    /** points at the canonical one; nginx 301s it */
    aliasDomain: 'serajianmohsen.ir',
    /** shown next to the pulsing green dot in the sidebar */
    availability: 'available for work',
  },

  /* ─────────── navigation + per-section accent colour ─────────── */
  nav: [
    { id: 'home', label: 'HOME', hue: 186 },
    { id: 'about', label: 'ABOUT', hue: 212 },
    { id: 'skills', label: 'SKILLS', hue: 268 },
    { id: 'services', label: 'SERVICES', hue: 152 },
    { id: 'projects', label: 'PROJECTS', hue: 28 },
    { id: 'contact', label: 'CONTACT', hue: 322 },
  ] satisfies NavItem[],

  /* ─────────── hero ─────────── */
  hero: {
    prompt: 'mohsen@serajian:~',
    /** the name, split into lines — the second line gets the gradient */
    lines: ['Mohsen', 'Serajian'],
    /**
     * Persian name under the latin one. Rendered small and dim, revealed
     * right-to-left. Never split into characters — Persian is a connected
     * script and per-letter spans would break the joining forms.
     */
    nameFa: 'محسن سراجیان',
    /** cycled by the typewriter inside fmt.Println() */
    roles: [
      "I'm a backend developer",
      "I'm a software engineer",
      "I'm a blockchain developer",
      "I'm a distributed systems engineer",
      "I'm a freelancer",
    ],
  },

  /* ─────────── the infinite marquee under the hero ─────────── */
  ticker: [
    'Go',
    'PostgreSQL',
    'Redis',
    'Kafka',
    'gRPC',
    'Kubernetes',
    'Terraform',
    'Prometheus',
  ],

  /* ─────────── about ─────────── */
  about: {
    overline: '// 02 — information',
    heading: { lead: 'About', dim: 'me' },
    // TODO: your own words — each string is a paragraph.
    // Wrap a phrase in <span class="hl">…</span> to brighten it.
    paragraphs: [
      'I build the parts of a product nobody sees but everybody depends on — <span class="hl">APIs, data pipelines, queues</span>, and the boring machinery that has to stay up at 3am.',
      'Most of my work is in Go, usually next to Postgres, Redis and Docker. I care about systems simple enough to reason about, observable enough to debug, and dull enough to sleep through.',
    ],
    meta: [
      { label: 'Location', value: 'Tehran, Iran' },
      { label: 'Experience', value: '6+ years' },
      { label: 'Languages', value: 'Persian / English' },
      { label: 'Email', value: 'hello@example.com' },
    ] satisfies MetaItem[],
    // set to null to hide the button
    cv: { label: 'Download CV ↓', href: '/cv.pdf' } as { label: string; href: string } | null,

    /**
     * The syntax-highlighted card next to the text.
     * Written as plain lines; `kind` picks the colour.
     *   plain | comment | keyword | fn | string | number
     */
    codeCard: {
      filename: 'about.go',
      lines: [
        [{ t: "// who's behind the keyboard", kind: 'comment' }],
        [],
        [
          { t: 'package ', kind: 'keyword' },
          { t: 'main', kind: 'fn' },
        ],
        [],
        [
          { t: 'type ', kind: 'keyword' },
          { t: 'Engineer ', kind: 'fn' },
          { t: 'struct', kind: 'keyword' },
          { t: ' {', kind: 'plain' },
        ],
        [
          { t: '  Name   ', kind: 'plain' },
          { t: 'string', kind: 'keyword' },
        ],
        [
          { t: '  Role   ', kind: 'plain' },
          { t: 'string', kind: 'keyword' },
        ],
        [
          { t: '  Stack  []', kind: 'plain' },
          { t: 'string', kind: 'keyword' },
        ],
        [
          { t: '  Coffee ', kind: 'plain' },
          { t: 'int', kind: 'keyword' },
        ],
        [{ t: '}', kind: 'plain' }],
        [],
        [
          { t: 'func ', kind: 'keyword' },
          { t: 'New', kind: 'fn' },
          { t: '() *Engineer {', kind: 'plain' },
        ],
        [
          { t: '  return ', kind: 'keyword' },
          { t: '&Engineer{', kind: 'plain' },
        ],
        [
          { t: '    Name:   ', kind: 'plain' },
          { t: '"Mohsen Serajian"', kind: 'string' },
          { t: ',', kind: 'plain' },
        ],
        [
          { t: '    Role:   ', kind: 'plain' },
          { t: '"Backend Engineer"', kind: 'string' },
          { t: ',', kind: 'plain' },
        ],
        [
          { t: '    Stack:  []', kind: 'plain' },
          { t: 'string', kind: 'keyword' },
          { t: '{', kind: 'plain' },
          { t: '"Go"', kind: 'string' },
          { t: ', ', kind: 'plain' },
          { t: '"Postgres"', kind: 'string' },
          { t: ', ', kind: 'plain' },
          { t: '"Redis"', kind: 'string' },
          { t: '},', kind: 'plain' },
        ],
        [
          { t: '    Coffee: ', kind: 'plain' },
          { t: '3', kind: 'number' },
          { t: ', ', kind: 'plain' },
          { t: '// per day, minimum', kind: 'comment' },
        ],
        [{ t: '  }', kind: 'plain' }],
        [{ t: '}', kind: 'plain' }],
      ],
    },

    stats: [
      { value: 6, suffix: '+', label: 'Years shipping' },
      { value: 40, suffix: '+', label: 'Services in prod' },
      { value: 99, suffix: '.9', label: 'Uptime %' },
      { value: 12, label: 'Open source repos' },
    ] satisfies Stat[],
  },

  /* ─────────── skills ─────────── */
  skills: {
    overline: '// 03 — abilities',
    heading: { lead: 'My', dim: 'skills' },
    intro:
      'A decade of shipping services other teams build on. Below is what I reach for before reading the docs.',
    bars: [
      { label: 'Backend & APIs', value: 96 },
      { label: 'Distributed systems', value: 88 },
      { label: 'Databases', value: 92 },
      { label: 'DevOps & infra', value: 84 },
    ] satisfies Skill[],
    chips: [
      'Go',
      'gRPC',
      'PostgreSQL',
      'Redis',
      'Kafka',
      'NATS',
      'Docker',
      'Kubernetes',
      'Terraform',
      'Prometheus',
      'GitLab CI',
      'Linux',
    ],
  },

  /* ─────────── services ─────────── */
  services: {
    overline: '// 04 — what i do',
    heading: { lead: 'Services', dim: '' },
    items: [
      {
        icon: '{ }',
        title: 'API Development',
        body: 'Secure, well-documented HTTP and gRPC APIs that teams actually enjoy using.',
      },
      {
        icon: '◫',
        title: 'System Architecture',
        body: 'Scalable service topologies that survive traffic spikes without waking anyone up.',
      },
      {
        icon: '⌁',
        title: 'Performance Tuning',
        body: 'Profiling, query optimization and caching strategies — measured, not guessed.',
      },
      {
        icon: '⊞',
        title: 'Data Pipelines',
        body: 'Event streaming and batch pipelines with at-least-once delivery and clean backpressure.',
      },
      {
        icon: '↻',
        title: 'DevOps & CI/CD',
        body: 'Reproducible builds, containerized deploys, pipelines that fail loudly and early.',
      },
      {
        icon: '◈',
        title: 'Technical Consulting',
        body: 'Architecture reviews and second opinions before the expensive decision gets made.',
      },
    ] satisfies Service[],
  },

  /* ─────────── projects (horizontal scroller) ─────────── */
  projects: {
    overline: '// 05 — selected work',
    heading: { lead: 'Projects', dim: '' },
    hint: '↔ scroll to move sideways',
    items: [
      {
        code: '001 / LEDGER',
        title: 'Ledger API',
        body: 'Double-entry accounting service handling 4k req/s with strict consistency guarantees and an audit trail you can actually replay.',
        stack: 'Go · Postgres',
        href: '#',
      },
      {
        code: '002 / RELAY',
        title: 'Stream Relay',
        body: 'Fan-out message broker with at-least-once delivery, backpressure-aware consumers and zero-downtime rebalancing.',
        stack: 'Go · NATS',
        href: '#',
      },
      {
        code: '003 / RAFT',
        title: 'Raft KV Store',
        body: 'A small distributed key-value store built to understand consensus from first principles — leader election, log compaction, the lot.',
        stack: 'Go · Raft',
        href: '#',
      },
      {
        code: '004 / QUEUE',
        title: 'Job Queue',
        body: 'Durable background runner with retries, dead-letter handling, cron-style scheduling and a tiny web dashboard.',
        stack: 'Go · Redis',
        href: '#',
      },
      {
        code: '005 / OBSERV',
        title: 'Trace Collector',
        body: 'OpenTelemetry ingest pipeline sampling 12M spans a day into columnar storage without dropping the interesting ones.',
        stack: 'Go · ClickHouse',
        href: '#',
      },
    ] satisfies Project[],
    /** the dashed card at the end of the row */
    outro: {
      title: 'Your project<br>next?',
      body: 'Always up for a hard backend problem.',
      cta: "Let's talk",
      href: '#contact',
    },
  },

  /* ─────────── contact ─────────── */
  contact: {
    overline: '// 06 — location',
    heading: { lead: 'Contact', dim: 'me' },
    links: [
      { label: 'Email', value: 'hello@example.com', href: 'mailto:hello@example.com' },
      { label: 'Phone', value: '+98 —— —— ——', href: 'tel:+98' },
      { label: 'Address', value: 'Tehran, Iran', href: '#' },
      { label: 'GitHub', value: 'github.com/mohsen', href: 'https://github.com/' },
    ] satisfies ContactLink[],
    form: {
      filename: 'message.sh',
      /**
       * Where the form posts. Static hosting can't process forms, so this
       * needs an external endpoint (Formspree / Basin / your own handler).
       * Leave null and the form stays a non-submitting mockup.
       */
      endpoint: null as string | null,
      submitLabel: 'Send message ↵',
    },
  },

  /* ─────────── sidebar socials + footer ─────────── */
  socials: [
    { label: 'GH', title: 'GitHub', href: 'https://github.com/' },
    { label: 'IN', title: 'LinkedIn', href: 'https://linkedin.com/' },
    { label: 'TG', title: 'Telegram', href: 'https://t.me/' },
    { label: '@', title: 'Email', href: 'mailto:hello@example.com' },
  ] satisfies Social[],

  footer: {
    left: '© 2026 Mohsen Serajian — built with too much coffee',
    links: [
      { label: 'Impressum', href: '#' },
      { label: 'Privacy', href: '#' },
    ],
  },

  /* ─────────── boot sequence ─────────── */
  boot: {
    lines: [
      '> booting portfolio.sh',
      '> mounting /dev/experience',
      '> loading go modules …ok',
      '> compiling shaders …ok',
      '> starting server on :2026',
    ],
  },
} as const;

export type Site = typeof site;
