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
    name: 'Mohsen Serajian',
    role: 'Senior Backend Developer · Go',
    title: 'Mohsen Serajian — Senior Backend Developer',
    description:
      'Senior backend developer building Go services at the scale of millions of users — event-driven systems, real-time backends and high-throughput pipelines.',
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
  /* a highlight reel rather than a list of logos — numbers say more than
     names do, and these are all from shipped work */
  ticker: [
    'Golang',
    '3M+ users served',
    'Event-driven systems',
    'Blockchain',
    '800k+ concurrent connections',
    'Smart contracts',
    'Domain-driven design',
    '100k+ uploads a day',
    'Web3 backends',
    'Kafka · Kubernetes',
    'Postgres · Redis · Scylla',
  ],

  /* ─────────── about ─────────── */
  about: {
    overline: '// 02 — information',
    heading: { lead: 'About', dim: 'me' },
    /* Each string is a paragraph. Wrap a phrase in <span class="hl">…</span>
       to brighten it. */
    /* Deliberately no employer names or dates — those live in the CV and go
       stale the day they change. What stays is the scale and the class of
       problem, which travel with me. */
    paragraphs: [
      'I build backend systems that a lot of people are on the other end of. Most of my work has been on <span class="hl">high-traffic consumer platforms</span> — video, live sports, real-time messaging — where the interesting problems only show up once you have millions of users and a spike nobody scheduled.',
      'In practice that has meant short-video pipelines taking <span class="hl">100k+ uploads a day</span>, gamification systems for <span class="hl">3M+ users</span> that have to hold the moment a match kicks off, real-time services that let a phone drive a TV across the room, and chat backends carrying <span class="hl">800k+ concurrent connections</span>. Before that, national-scale government platforms where "this cannot go down" was the entire requirement.',
      'Go is my primary language, usually next to Postgres, Redis, Kafka and Scylla, and more recently <span class="hl">blockchain and smart-contract systems</span>. I care about domain boundaries that survive a rewrite, event-driven flows that degrade instead of collapsing, and systems dull enough to sleep through.',
    ],

    /**
     * Portrait next to the text. The image itself lives at
     * `src/assets/me.png` — overwrite that file to change it and Astro
     * re-optimises it (webp + responsive sizes) on the next build.
     * Set to null to drop the frame entirely.
     */
    photo: {
      alt: 'Mohsen Serajian',
      /** the little label in the corner of the frame */
      caption: 'Dubai, UAE',
    } as { alt: string; caption: string } | null,

    meta: [
      { label: 'Location', value: 'Dubai, UAE' },
      { label: 'Working since', value: '2018' },
      { label: 'Languages', value: 'Persian · English' },
      { label: 'Email', value: 'serajian.mohsen@gmail.com' },
    ] satisfies MetaItem[],

    /**
     * The CV lives at `public/Mohsen-Serajian-Resume.pdf`.
     * To publish a new version just overwrite that one file — the filename
     * is what the visitor downloads, so keep the name the same.
     * Set `cv` to null to hide the button entirely.
     */
    cv: { label: 'Download CV ↓', href: '/Mohsen-Serajian-Resume.pdf' } as {
      label: string;
      href: string;
    } | null,

    /**
     * The syntax-highlighted card next to the text.
     * Written as plain lines; `kind` picks the colour.
     *   plain | comment | keyword | fn | string | number
     */
    codeCard: {
      filename: 'about.go',
      lines: [
        [{ t: '// serajian.mohsen@gmail.com', kind: 'comment' }],
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
          { t: '  Name  ', kind: 'plain' },
          { t: 'string', kind: 'keyword' },
        ],
        [
          { t: '  Title ', kind: 'plain' },
          { t: 'string', kind: 'keyword' },
        ],
        [
          { t: '  Since ', kind: 'plain' },
          { t: 'int', kind: 'keyword' },
        ],
        [
          { t: '  Stack []', kind: 'plain' },
          { t: 'string', kind: 'keyword' },
        ],
        [{ t: '}', kind: 'plain' }],
        [],
        [
          { t: 'var ', kind: 'keyword' },
          { t: 'me = Engineer{', kind: 'plain' },
        ],
        [
          { t: '  Name:  ', kind: 'plain' },
          { t: '"Mohsen Serajian"', kind: 'string' },
          { t: ',', kind: 'plain' },
        ],
        [
          { t: '  Title: ', kind: 'plain' },
          { t: '"Senior Backend Developer"', kind: 'string' },
          { t: ',', kind: 'plain' },
        ],
        [
          { t: '  Since: ', kind: 'plain' },
          { t: '2018', kind: 'number' },
          { t: ',', kind: 'plain' },
        ],
        [
          { t: '  Stack: []', kind: 'plain' },
          { t: 'string', kind: 'keyword' },
          { t: '{', kind: 'plain' },
          { t: '"Go"', kind: 'string' },
          { t: ', ', kind: 'plain' },
          { t: '"Kafka"', kind: 'string' },
          { t: ', ', kind: 'plain' },
          { t: '"Scylla"', kind: 'string' },
          { t: '},', kind: 'plain' },
        ],
        [{ t: '}', kind: 'plain' }],
        [],
        [
          { t: 'func ', kind: 'keyword' },
          { t: '(e Engineer) ', kind: 'plain' },
          { t: 'Scale', kind: 'fn' },
          { t: '() ', kind: 'plain' },
          { t: 'string', kind: 'keyword' },
          { t: ' {', kind: 'plain' },
        ],
        [
          { t: '  return ', kind: 'keyword' },
          { t: '"millions of users, one quiet pager"', kind: 'string' },
        ],
        [{ t: '}', kind: 'plain' }],
      ],
    },
  },

  /* ─────────── skills ─────────── */
  skills: {
    overline: '// 03 — abilities',
    heading: { lead: 'My', dim: 'skills' },
    intro:
      'Seven years of shipping services other teams build on. Below is what I reach for before reading the docs.',
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
      {
        label: 'Email',
        value: 'serajian.mohsen@gmail.com',
        href: 'mailto:serajian.mohsen@gmail.com',
      },
      {
        label: 'LinkedIn',
        value: 'in/mohsen-serajian',
        href: 'https://linkedin.com/in/mohsen-serajian',
      },
      { label: 'GitHub', value: 'github.com/Serajian', href: 'https://github.com/Serajian' },
      { label: 'Location', value: 'Dubai, UAE', href: '#' },
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
    { label: 'GH', title: 'GitHub', href: 'https://github.com/Serajian' },
    { label: 'IN', title: 'LinkedIn', href: 'https://linkedin.com/in/mohsen-serajian' },
    { label: '@', title: 'Email', href: 'mailto:serajian.mohsen@gmail.com' },
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
