# portfolio

Personal site — Astro, static output, deployed with Dokploy.

## Editing content

Everything the site says lives in one file:

```
src/data/site.ts
```

Sections are in the order they appear on the page: `meta`, `nav`, `hero`,
`ticker`, `about`, `skills`, `services`, `projects`, `contact`, `socials`,
`footer`, `boot`. Values still carrying mockup text are marked `TODO`.

Each nav entry has a `hue` (0–360). That hue drives the accent colour, the
gradients, the glow **and** the WebGL background — the whole theme animates to
it when the section scrolls into view.

## Replacing the CV and the photo

Both live in `public/` and are referenced by filename, so updating them is a
file swap — no code change:

| what   | path                                  |
| ------ | ------------------------------------- |
| CV     | `public/Mohsen-Serajian-Resume.pdf`   |
| photo  | `public/me.png`                       |

Keep the CV's filename the same — it is what the visitor's browser saves.
For the photo use a roughly square image; it is displayed 1:1 and cropped to
fill. If the file is missing the portrait frame removes itself rather than
showing a broken image.

## Commands

```bash
pnpm install     # once
pnpm dev         # dev server on http://localhost:4321
pnpm build       # static output into dist/
pnpm preview     # serve the built output
pnpm check       # astro + typescript diagnostics
```

## Layout of the code

```
src/
  data/site.ts        all copy and content
  pages/index.astro   the single page
  layouts/Base.astro  <head>, global css, script entry
  components/         one per section
  styles/global.css   design tokens + every rule
  scripts/            animation modules
    main.ts           entry: wires modules, owns the rAF loop
    background.ts     WebGL shader + glyph rain
    scroll.ts         scrollspy, hue shift, parallax, pinned h-scroll
    cursor.ts         custom cursor, magnetic buttons, card tilt
    curtain.ts        nav click transition
    reveal.ts         scroll reveals, scramble, counters
    hero.ts           name reveal + typewriter
    boot.ts           terminal boot screen
    sound.ts          WebAudio blips
```

Every module checks `prefers-reduced-motion` and degrades. If WebGL is
unavailable the body gets `.no-gl` and CSS gradient blobs take over.

## Deploying with Dokploy

The repo ships a multi-stage `Dockerfile` (Node build → nginx serve) plus
`nginx.conf` with gzip and immutable caching for hashed assets.

In Dokploy: create an **Application**, point it at this repository, choose
**Dockerfile** as the build type, and expose port **80**. No environment
variables are needed.

Before the first deploy set the real domain in two places:

- `astro.config.mjs` → `site`
- `src/data/site.ts` → `meta.url`

## Contact form

Static hosting can't process a POST. `site.contact.form.endpoint` is `null`,
so the form renders but does nothing. Set it to an external endpoint
(Formspree, Basin, or your own handler) to make it live.
