/**
 * Renders public/og.png — the 1200×630 card that Telegram, LinkedIn,
 * WhatsApp and X show when the link is shared.
 *
 *   node scripts/make-og.mjs
 *
 * Re-run it after changing the name, title or domain in src/data/site.ts.
 */

import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const root = fileURLToPath(new URL('..', import.meta.url));
const PORTRAIT = path.join(root, 'src/assets/me.png');
const OUT = path.join(root, 'public/og.png');

const W = 1200;
const H = 630;

/* kept in step with src/data/site.ts by hand — this script runs rarely */
const NAME_TOP = 'Mohsen';
const NAME_BOTTOM = 'Serajian';
const ROLE = 'SENIOR BACKEND ENGINEER';
/* keep under ~30 characters — the portrait starts around x=490 */
const TAGLINE = 'Go · event-driven systems';
const DOMAIN = 'mohsenserajian.ir';

/* the site's home hue */
const ACCENT = '#3ecfe0';
const ACCENT2 = '#59a6f0';

const grid = [];
for (let x = 0; x <= W; x += 40) grid.push(`<line x1="${x}" y1="0" x2="${x}" y2="${H}"/>`);
for (let y = 0; y <= H; y += 40) grid.push(`<line x1="0" y1="${y}" x2="${W}" y2="${y}"/>`);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="name" x1="0" y1="0" x2="1" y2="0.3">
      <stop offset="0%" stop-color="${ACCENT}"/>
      <stop offset="100%" stop-color="${ACCENT2}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.62" cy="0.42" r="0.6">
      <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="${ACCENT}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="vig" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#05070c" stop-opacity="0"/>
      <stop offset="100%" stop-color="#05070c" stop-opacity="0.85"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="#05070c"/>
  <g stroke="#7aa2f7" stroke-opacity="0.06" stroke-width="1">${grid.join('')}</g>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect width="${W}" height="${H}" fill="url(#vig)"/>

  <text x="80" y="150" font-family="Menlo, monospace" font-size="22" fill="#9ece6a"
        letter-spacing="1">$</text>
  <text x="106" y="150" font-family="Menlo, monospace" font-size="22" fill="#6b7590"
        letter-spacing="1">whoami</text>

  <text x="80" y="290" font-family="Helvetica, Arial, sans-serif" font-size="118"
        font-weight="bold" fill="#eef3ff" letter-spacing="-4">${NAME_TOP}</text>
  <text x="80" y="405" font-family="Helvetica, Arial, sans-serif" font-size="118"
        font-weight="bold" fill="url(#name)" letter-spacing="-4">${NAME_BOTTOM}</text>

  <text x="80" y="468" font-family="Menlo, monospace" font-size="21" fill="#8b93b8"
        letter-spacing="4">${ROLE}</text>

  <text x="80" y="530" font-family="Helvetica, Arial, sans-serif" font-size="26"
        fill="#6b7590">${TAGLINE}</text>

  <rect x="80" y="556" width="52" height="2" fill="${ACCENT}"/>
  <text x="80" y="592" font-family="Menlo, monospace" font-size="20" fill="${ACCENT}"
        letter-spacing="2">${DOMAIN}</text>
</svg>`;

const layers = [];

if (existsSync(PORTRAIT)) {
  const portrait = await sharp(PORTRAIT)
    .resize({ height: 560, fit: 'inside' })
    .grayscale()
    .modulate({ brightness: 0.95 })
    .png()
    .toBuffer();
  const meta = await sharp(portrait).metadata();
  layers.push({
    input: portrait,
    left: W - (meta.width ?? 0) - 40,
    top: H - (meta.height ?? 0),
  });
}

await sharp(Buffer.from(svg)).composite(layers).png({ compressionLevel: 9 }).toFile(OUT);

const out = await sharp(OUT).metadata();
console.log(`og.png  ${out.width}×${out.height}  ${(out.size / 1024).toFixed(0)}kB`);
