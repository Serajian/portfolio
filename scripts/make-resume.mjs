/**
 * Renders public/Mohsen-Serajian-Resume.pdf from scripts/resume/resume.html
 * with headless Chrome — the engine the page was laid out in, so what the
 * browser shows is what the PDF gets.
 *
 *   node scripts/make-resume.mjs            → public/Mohsen-Serajian-Resume.pdf
 *   node scripts/make-resume.mjs out.pdf    → somewhere else, to look first
 *
 * Edit the HTML, re-run, read the page count it prints. The layout is sized
 * for two A4 pages; a third one means something has to be cut.
 *
 * Fonts are Avenir Next (ships with macOS) and JetBrains Mono (install it).
 * Anywhere else Chrome falls back to other faces and the line breaks move.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const SOURCE = path.join(root, 'scripts/resume/resume.html');
/* keep the filename — it is what visitors save, and cv.href points at it */
const OUT = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(root, 'public/Mohsen-Serajian-Resume.pdf');

const chrome = [
  process.env.CHROME,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].find((p) => p && existsSync(p));

if (!chrome) {
  console.error('No Chrome found. Set CHROME=/path/to/chrome and re-run.');
  process.exit(1);
}

execFileSync(
  chrome,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-pdf-header-footer',
    `--print-to-pdf=${OUT}`,
    pathToFileURL(SOURCE).href,
  ],
  { stdio: 'ignore' },
);

/* page objects are written uncompressed, so counting them is enough */
const pages = (readFileSync(OUT, 'latin1').match(/\/Type\s*\/Page\b/g) ?? []).length;
console.log(`${path.relative(root, OUT)} — ${pages} page${pages === 1 ? '' : 's'}`);
if (pages > 2) console.warn('More than two pages: trim the HTML.');
