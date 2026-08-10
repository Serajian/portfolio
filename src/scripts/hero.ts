import { pointer } from './pointer';
import { $, $$, clamp, reducedMotion } from './utils';

/** how far from a glyph the pointer still has an effect */
const REACH = 300;
/** how far a glyph lifts when the pointer is right on it */
const LIFT = 28;

interface Glyph {
  inner: HTMLElement;
  /** centre in document space, so scrolling doesn't need a re-measure */
  cx: number;
  cy: number;
}

let glyphs: Glyph[] = [];

/**
 * Splits each hero line into characters that rise into place one by one,
 * and the Persian line into words. Each gets an inner span the pointer
 * reaction can transform without fighting the entrance animation.
 */
export function revealHero(): void {
  let index = 0;
  const h1 = $<HTMLElement>('.hero h1');
  $$<HTMLElement>('h1 .ln').forEach((line, li) => {
    if (line.dataset.done) return;
    line.dataset.done = '1';
    const chars = [...(line.dataset.t ?? '')];
    // the second line keeps counting where the first left off, so the
    // shine sweeps diagonally across the whole name
    chars.forEach((char, i) => {
      const wrap = document.createElement('span');
      wrap.className = 'ch';
      wrap.style.setProperty('--d', `${0.1 + li * 0.14 + i * 0.045}s`);
      const inner = document.createElement('span');
      inner.className = 'chi';
      inner.textContent = char;
      inner.style.setProperty('--i', String(index++));
      wrap.appendChild(inner);
      line.appendChild(wrap);
    });
  });

  // once the letters have landed, stop clipping the lines so the hover
  // glow can spill outside them
  if (h1) window.setTimeout(() => h1.classList.add('landed'), 1800);

  const fa = $<HTMLElement>('.hero .fa');
  if (fa && !fa.dataset.done) {
    fa.dataset.done = '1';
    const words = (fa.textContent ?? '').trim().split(/\s+/);
    fa.textContent = '';
    words.forEach((word, i) => {
      const wrap = document.createElement('span');
      wrap.className = 'w';
      wrap.style.setProperty('--d', `${0.95 + i * 0.12}s`);
      const inner = document.createElement('span');
      inner.className = 'wi';
      inner.textContent = word;
      inner.style.setProperty('--i', String(i));
      wrap.appendChild(inner);
      fa.appendChild(wrap);
      if (i < words.length - 1) fa.appendChild(document.createTextNode(' '));
    });
  }

  $$<HTMLElement>('.hero .prompt,.hero .typer,.hero .scroll-cue').forEach((el, i) => {
    el.style.opacity = '0';
    el.animate(
      [
        { opacity: 0, transform: 'translateY(16px)' },
        { opacity: 1, transform: 'none' },
      ],
      {
        duration: 700,
        delay: 600 + i * 120,
        easing: 'cubic-bezier(.16,1,.3,1)',
        fill: 'forwards',
      },
    );
  });

  // measure after the entrance settles, when nothing is mid-transform
  window.setTimeout(measureHero, 2000);
}

/** Caches glyph centres. Cheap — there are only ~16 of them. */
export function measureHero(): void {
  if (reducedMotion()) {
    glyphs = [];
    return;
  }
  glyphs = $$<HTMLElement>('.hero h1 .chi, .hero .fa .wi').map((inner) => {
    const r = inner.getBoundingClientRect();
    return {
      inner,
      cx: r.left + r.width / 2,
      cy: r.top + r.height / 2 + window.scrollY,
    };
  });
}

/** Letters lift and glow as the pointer passes over the name. */
export function updateHero(): void {
  if (!glyphs.length) return;
  // the name only exists in the first viewport; skip the work below it
  if (window.scrollY > window.innerHeight * 1.2) return;

  const px = pointer.x;
  const py = pointer.y + window.scrollY;

  glyphs.forEach((g) => {
    const d = Math.hypot(g.cx - px, g.cy - py);
    const f = clamp(1 - d / REACH, 0, 1);
    const eased = f * f;
    g.inner.style.setProperty('--lift', `${(-eased * LIFT).toFixed(2)}px`);
    g.inner.style.setProperty('--sc', String(1 + eased * 0.12));
    g.inner.style.setProperty('--g', eased.toFixed(3));
  });
}

/** The `fmt.Println("…")` typewriter. */
export function initTyper(): void {
  const el = $<HTMLElement>('#tw');
  if (!el) return;

  const words: string[] = JSON.parse(el.dataset.roles ?? '[]');
  if (!words.length) return;

  if (reducedMotion()) {
    el.textContent = words[0]!;
    return;
  }

  let w = 0;
  let i = 0;
  let deleting = false;

  const tick = (): void => {
    const word = words[w]!;
    el.textContent = deleting ? word.slice(0, --i) : word.slice(0, ++i);

    let delay = deleting ? 40 : 80;
    if (!deleting && i === word.length) {
      delay = 1500;
      deleting = true;
    } else if (deleting && i === 0) {
      deleting = false;
      w = (w + 1) % words.length;
      delay = 240;
    }
    window.setTimeout(tick, delay);
  };

  tick();
}
