/**
 * ─────────────────────────────────────────────────────────────
 *  SITE CONTENT — this is the only file you need to edit
 *  to change what the site says. Everything else is layout.
 *
 *  Values marked `TODO` are placeholders from the mockup.
 *  Replace them one section at a time.
 * ─────────────────────────────────────────────────────────────
 */

import type { IconName } from '../components/Icon.astro';
import { CAREER_START } from '../lib/experience';

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

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface Service {
  /** short glyph used as the icon — keep it 1–3 characters */
  icon: string;
  title: string;
  body: string;
}

export interface Project {
  /** shown above the title, e.g. "001 / SHORTS" */
  code: string;
  title: string;
  body: string;
  stack: string;
  /** null when the work has no public URL — the card renders unlinked */
  href: string | null;
}

export interface ContactLink {
  label: string;
  value: string;
  href: string;
  icon: IconName;
}

export interface Social {
  title: string;
  href: string;
  icon: IconName;
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
  /* Hues deliberately avoid the 250–330 purple/pink arc. Neighbours in the
     scroll order are kept far apart so the shift between sections reads. */
  nav: [
    { id: 'home', label: 'HOME', hue: 186 },
    { id: 'about', label: 'ABOUT', hue: 212 },
    { id: 'skills', label: 'SKILLS', hue: 42 },
    { id: 'services', label: 'SERVICES', hue: 152 },
    { id: 'projects', label: 'PROJECTS', hue: 20 },
    { id: 'contact', label: 'CONTACT', hue: 96 },
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
    'Solidity · EVM',
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
      { label: 'Working since', value: String(CAREER_START.year) },
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
  },

  /* ─────────── skills ─────────── */
  skills: {
    overline: '// 03 — abilities',
    heading: { lead: 'My', dim: 'skills' },
    /* {years} is filled from CAREER_START — at build time and again in the
       browser, so the number is never stale. */
    intro:
      '{years} years of shipping services other teams build on. No percentage bars — either I have used something in production or it is not on this list.',
    /* Grouped rather than ranked. Order inside a group is roughly how often
       I reach for it. */
    groups: [
      {
        label: 'Languages',
        items: ['Go', 'TypeScript', 'JavaScript', 'SQL'],
      },
      {
        label: 'Architecture',
        items: [
          'Domain-Driven Design',
          'Clean / Hexagonal',
          'Microservices',
          'Event-Driven Systems',
          'RESTful APIs',
          'WebSocket',
          'Real-time & low-latency',
          'High-traffic & spike handling',
        ],
      },
      {
        label: 'Data',
        items: ['PostgreSQL', 'Redis', 'ScyllaDB', 'Cassandra', 'MongoDB', 'MySQL'],
      },
      {
        label: 'Platform',
        items: ['Kafka', 'Docker', 'Kubernetes', 'Linux', 'Git', 'GitLab CI', 'GitHub Actions'],
      },
      {
        label: 'Observability',
        items: ['OpenTelemetry', 'Jaeger', 'Grafana'],
      },
      {
        label: 'Testing',
        items: ['Unit & integration tests', 'testify', 'Mocking', 'Benchmarks', 'pprof profiling'],
      },
      {
        label: 'Blockchain',
        items: [
          'Solidity',
          'go-ethereum',
          'Ethereum / EVM',
          'Event indexers',
          'Node operations',
          'Wallet & key management',
          'TON',
          'Solana',
          'Cosmos',
        ],
      },
      {
        label: 'Leadership',
        items: ['Technical leadership', 'Mentoring', 'Code review'],
      },
    ] satisfies SkillGroup[],
  },

  /* ─────────── services ─────────── */
  /* Worded to read the same to a hiring manager and to a client: what I do,
     not what I will sell you. Six cards because the grid is three wide and
     six strong ones beat nine diluted. */
  services: {
    overline: '// 04 — capabilities',
    heading: { lead: 'What I', dim: 'do' },
    items: [
      {
        icon: '{ }',
        title: 'Backend & API Development',
        body: 'Go services behind REST and WebSocket APIs — built so other teams can integrate without booking a meeting, and so the next person to open the code can follow it.',
      },
      {
        icon: '◫',
        title: 'System Architecture',
        body: 'Domain boundaries, clean and hexagonal layering, and the call on what deserves its own service and which store it belongs in — Postgres, Redis, Scylla or Cassandra.',
      },
      {
        icon: '⇄',
        title: 'Event-Driven & Real-Time',
        body: 'Kafka-backed event flows and WebSocket transports for chat, live updates and device-to-device sync, with backpressure planned rather than discovered.',
      },
      {
        icon: '⌁',
        title: 'High-Traffic & Performance',
        body: 'Systems that hold when a live event starts: hot paths profiled with pprof, traces and dashboards in place before launch, capacity decided ahead of the spike instead of during it.',
      },
      {
        icon: '⬡',
        title: 'Blockchain & Smart Contracts',
        body: 'Solidity contracts, event indexers, node operations and wallet and key handling across EVM chains, TON, Solana and Cosmos.',
      },
      {
        icon: '◈',
        title: 'Technical Leadership',
        body: 'Architecture reviews, mentoring and code review — a second opinion before the expensive decision, and a team that can maintain what it ships.',
      },
    ] satisfies Service[],
  },

  /* ─────────── projects (horizontal scroller) ─────────── */
  projects: {
    overline: '// 05 — selected work',
    heading: { lead: 'Selected', dim: 'work' },
    /* A backend portfolio has nothing to screenshot, so each card states the
       constraint, what was built and the stack. The product is context; the
       system is the work. */
    note: 'A selection — these are the ones with a public URL. Most of what I build never gets one.',
    scrollHint: '↔ scroll',
    items: [
      {
        code: '001 / SHORTS',
        title: 'Aparat Shorts',
        body: 'The backend behind a Reels-style short-video feed — upload, processing and delivery. Carries 100k+ uploads a day and had to stay predictable while the product shipped weekly.',
        stack: 'Go · Microservices',
        href: 'https://www.aparat.com/shorts',
      },
      {
        code: '002 / GAME CLUB',
        title: 'Game Club — Aparat Sport',
        body: 'A gamification platform on top of live sports: scoring, predictions, quizzes, missions, leagues and rankings for 3M+ users. Event-driven on Kafka and built for the spike that lands the second a match kicks off.',
        stack: 'Go · Kafka',
        href: 'https://www.aparatsport.ir/',
      },
      {
        code: '003 / CAST',
        title: 'Apollo Cast',
        body: 'A real-time service that turns a phone into a remote and a TV into a screen. WebSocket transport with device pairing and state sync, where anything past a few hundred milliseconds is felt rather than measured.',
        stack: 'Go · WebSocket',
        href: null,
      },
      {
        code: '004 / CHAT',
        title: 'Chat Service',
        body: 'Messaging across channels: chat APIs and workflows on WebSocket and event-driven patterns, holding 800k+ concurrent connections without the tail latency creeping up.',
        stack: 'Go · WebSocket',
        href: null,
      },
      {
        code: '005 / WISHLY',
        title: 'Wishly',
        body: 'My own product. Wishlists and birthday reminders — friends see what you actually want, without spoilers or duplicates, and get nudged by email or SMS a few days ahead. Three languages, Persian included.',
        stack: 'Go',
        href: 'https://wishly.info',
      },
      {
        code: '006 / GOV',
        title: 'National education platforms',
        body: "National-scale services for Iran's largest government organisation: financial aid, loans, registration and core administrative systems. The requirement that shaped every decision was that they cannot go down.",
        stack: 'Go · Microservices',
        href: null,
      },
    ] satisfies Project[],
    /** the dashed card that closes the row — {years} is filled from CAREER_START */
    outro: {
      title: '+ plenty<br>more',
      body: '{years} years of services that never got a landing page — internal APIs, data migrations, integrations, ops tooling. Plus <span class="hl">blockchain and crypto work an NDA keeps me from describing</span>.',
      cta: 'The CV has the full list',
      href: '/Mohsen-Serajian-Resume.pdf',
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
        icon: 'mail',
      },
      {
        label: 'Telegram',
        value: '@mohsenserajian',
        href: 'https://t.me/mohsenserajian',
        icon: 'telegram',
      },
      {
        label: 'LinkedIn',
        value: 'in/mohsen-serajian',
        href: 'https://linkedin.com/in/mohsen-serajian',
        icon: 'linkedin',
      },
      {
        label: 'GitHub',
        value: 'github.com/Serajian',
        href: 'https://github.com/Serajian',
        icon: 'github',
      },
      { label: 'Location', value: 'Dubai, UAE', href: '#', icon: 'location' },
    ] satisfies ContactLink[],
    /* No form: a static site can't send mail on its own, and a contact form
       that needs a third party to work is worse than an address that always
       does. */
    lead: 'Email or Telegram is the fastest way to reach me.',
  },

  /* ─────────── sidebar socials + footer ─────────── */
  socials: [
    { title: 'GitHub', href: 'https://github.com/Serajian', icon: 'github' },
    { title: 'LinkedIn', href: 'https://linkedin.com/in/mohsen-serajian', icon: 'linkedin' },
    { title: 'Telegram', href: 'https://t.me/mohsenserajian', icon: 'telegram' },
    { title: 'Email', href: 'mailto:serajian.mohsen@gmail.com', icon: 'mail' },
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
