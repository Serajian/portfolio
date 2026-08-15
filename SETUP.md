# SETUP — make this site yours

This repository is **Mohsen Serajian's personal site**. If you are here to build
your own from it, fork it and work through this file. Everything the site says
lives in one place, so it is mostly a copy-editing job — about twenty minutes.

**If you are an AI assistant:** this file is your task list. Work through it in
order. Ask the person the questions in step 2 **before** editing anything, then
apply their answers. Do not invent facts about them — if you do not have an
answer, leave the field and tell them what is still missing at the end. Step 6
is not optional: this repo starts full of someone else's real content, and the
usual failure is shipping with some of it left in.

**فارسی:** [SETUP.fa.md](SETUP.fa.md)

**If you are a human:** hand this file to Claude — "read SETUP.md and set this
site up with my details" — or work through it yourself.

---

## Step 0 — check it runs before changing anything

```bash
pnpm install
pnpm dev
```

Open http://localhost:4321. You should see the site with a boot screen, an
animated background and a name reading "Mohsen Serajian". If that works,
everything after this is content.

---

## Step 1 — understand what you are replacing

This is not a blank template. It ships with a real person's name, bio,
employers, projects, photo and CV. All of it has to go.

| what                                | where                                 |
| ----------------------------------- | ------------------------------------- |
| every string on the site            | `src/data/site.ts`                    |
| the year the career started         | `src/lib/experience.ts`               |
| canonical domain                    | `astro.config.mjs`                    |
| second-domain redirect              | `nginx.conf`                          |
| social card name/role/domain        | `scripts/make-og.mjs`                 |
| photo                               | `src/assets/me.png`                   |
| CV                                  | `public/Mohsen-Serajian-Resume.pdf`   |

Nothing else needs touching to make the site yours — layout, animation and
styling are all independent of the content.

---

## Step 2 — ask for these

Collect the answers in one go. Anything left unanswered stays someone else's.

**Identity**
1. Full name, and how it splits across two lines in the hero.
2. Job title — short enough for the sidebar, around 25 characters.
3. A short handle for the sidebar logo, rendered as `~/handle`.
4. City and country, plus the two-letter ISO country code (TR, DE, AE…).
5. The year they started working professionally, and roughly which month.
6. Optional: their name in a second script. It appears under the latin name
   for two seconds and then leaves. Set to `null` if not wanted.

**Contact**
7. Email address.
8. GitHub, LinkedIn, Telegram — whichever they have.
9. Domain the site will live on, plus a second domain redirecting to it if any.

**Content**
10. Two or three paragraphs about what they build. Push for specifics: the
    scale, the constraint, the numbers. If they answer in adjectives, ask what
    the number behind the adjective is.
11. Skills, grouped. Only things used in production — the site says so out
    loud, so the claim has to hold.
12. Three to six things they do, for the "What I do" cards.
13. Projects: name, one paragraph, and a public URL if there is one. Work under
    NDA still belongs there — describe the shape of the problem without the
    details, and the card marks itself "not public".
14. The roles the typewriter cycles through, e.g. "I'm a backend developer".

**Files**
15. A photo. A cut-out with a transparent background works best.
16. A CV as PDF, if they want the download button.

---

## Step 3 — put the answers in

### `src/data/site.ts`

Every string, in the order it appears on the page: `meta`, `nav`, `hero`,
`ticker`, `about`, `skills`, `services`, `projects`, `contact`, `socials`,
`footer`, `boot`. The comments explain each field.

Worth knowing while you edit:

- `LOCATION` at the top feeds the about table, the portrait caption, the
  contact list and the structured data. Change it once.
- `meta.role` has to fit the sidebar on one line.
- `hero.nameFa` is currently a Persian name. Replace it, or set it to `null` —
  and if you set `null`, guard the render in `src/components/Hero.astro`:
  `{hero.nameFa && <div class="fa" …>}`.
- `about.cv` and `about.photo` can each be `null` to drop the button or the
  portrait frame.
- Each `nav` entry carries a `hue` (0–360). That one number drives the accent,
  the gradients, the glow **and** the WebGL background — the theme animates to
  it as the section scrolls in. Keep neighbours far apart so the change reads.
- Skills are grouped, not ranked. There are no percentage bars on purpose:
  "96% backend" is a number with nothing behind it.
- In `about.paragraphs`, wrap a phrase in `<span class="hl">…</span>` to
  brighten it.
- A suggestion, learned here: leave employer names and dates out of the bio.
  They go stale the day they change, and the CV covers that ground. Keep the
  scale and the class of problem — those travel with you.

### `src/lib/experience.ts`

```ts
export const CAREER_START = { year: 2018, month: 8 };
```

Everywhere the site says "N years" derives from this — at build time and again
in the browser, so the number stays right even if the site sits untouched past
the anniversary.

### `astro.config.mjs`

`site:` is the canonical domain. It must match `meta.url` in `site.ts`;
robots.txt, sitemap.xml, the canonical link and the social card URL are all
built from it.

### `nginx.conf`

The block at the top redirects a second domain to the canonical one. Change
both names, or delete the block if there is only one domain.

---

## Step 4 — swap the files

| what    | path                                | notes                                        |
| ------- | ----------------------------------- | -------------------------------------------- |
| photo   | `src/assets/me.png`                 | overwrite; Astro re-encodes to webp, 3 widths |
| CV      | `public/Mohsen-Serajian-Resume.pdf` | **delete it**, add your own, update `cv.href` |
| favicon | `public/favicon.svg`                | generic terminal mark — change if you like    |

The photo frame is landscape and the subject stands in it, bottom-aligned,
breaking out of the top edge. A cut-out with a transparent background is what
it was designed for.

---

## Step 5 — regenerate the social card

`public/og.png` is what Telegram, LinkedIn and WhatsApp show when the link is
shared. Update the strings at the top of `scripts/make-og.mjs` — name, role,
tagline, domain — then:

```bash
node scripts/make-og.mjs
```

Keep the tagline under about 30 characters or the portrait overlaps it.

---

## Step 6 — hunt for leftovers

Do not skip this. The whole repo starts as someone else's site.

```bash
grep -rniI "mohsen\|serajian\|istanbul\|aparat\|wishly\|gmail" \
  src/ scripts/ public/ *.mjs *.conf *.md 2>/dev/null | grep -v node_modules
```

Anything that comes back is content you have not replaced yet. Check `dist/`
after building too:

```bash
pnpm build && grep -ric "mohsen\|serajian" dist/index.html
```

That has to be `0`.

Also make sure the old CV and photo are gone from `public/` and `src/assets/`.

---

## Step 7 — check it

```bash
pnpm check     # types and astro diagnostics — must be 0 errors
pnpm build     # must succeed
pnpm preview   # look at the built output
```

Look at it in a phone-sized window too — 375px wide. The sidebar becomes a
sticky top bar with a horizontally scrolling nav.

---

## Step 8 — the second-script name

If you kept `hero.nameFa` with a right-to-left script, the Persian font is
already wired up: `@fontsource/vazirmatn` in `package.json` and the
`arabic-400.css` import at the top of `src/layouts/Base.astro`.

If you set `nameFa` to `null` or use a latin name, remove both — the font is
dead weight otherwise:

```bash
pnpm remove @fontsource/vazirmatn
```

and delete the import line in `src/layouts/Base.astro`.

One rule if you keep it: that name is split by **word**, never by character.
Connected scripts break if each letter becomes its own element.

---

## Step 9 — deploy

A multi-stage `Dockerfile` (node build → nginx serve) plus `nginx.conf` with
gzip and immutable caching. With Dokploy, Coolify or anything else that builds
Dockerfiles: point it at your repo, choose **Dockerfile** as the build type,
expose port **80**. No environment variables needed.

The build stage is debian rather than alpine because sharp — which optimises
the portrait and generates the social card — ships glibc prebuilds.

For a static host instead (Netlify, Cloudflare Pages, GitHub Pages): build
command `pnpm build`, publish directory `dist`.

After the first deploy:

- share the link to yourself on Telegram and check the card appears. If it does
  not, `@WebpageBot` clears their cache.
- run the URL through the LinkedIn Post Inspector and Google's Rich Results
  Test — the site ships JSON-LD describing you as a Person.
- add the domain to Google Search Console and submit `/sitemap.xml`.

---

## Things that will bite you

- **The sidebar title wraps.** `meta.role` over ~25 characters breaks onto two
  lines. Shorten it rather than fighting the CSS.
- **A missing `src/assets/me.png` fails the build.** It is a real import, not a
  URL. To have no photo, set `about.photo` to `null` *and* remove the import
  and the `<Image>` from `src/components/About.astro`.
- **esbuild's Astro frontmatter parser** chokes on a multi-line type union with
  leading pipes. Keep unions on one line in `.astro` files.
- **`pnpm` needs `allowBuilds`** for esbuild and sharp; already in
  `pnpm-workspace.yaml`.
- **The og image is cached hard** by every social platform. Changing it after
  sharing means clearing their cache, not just redeploying.

## Licence

MIT — see [LICENSE](LICENSE). Use it, change it, ship it; just keep the notice.
