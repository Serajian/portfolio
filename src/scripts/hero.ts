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

/** how far each glyph drifts in the idle wave */
const BOB = 5;

/**
 * Two things at once: an idle wave that runs whether or not anyone is
 * touching the mouse, and a lift/glow that follows the pointer. Both end up
 * in the same custom property so they never overwrite each other.
 */
export function updateHero(): void {
  if (!glyphs.length) return;
  // the name only exists in the first viewport; skip the work below it
  if (window.scrollY > window.innerHeight * 1.2) return;

  const t = performance.now() / 1000;
  const px = pointer.x;
  const py = pointer.y + window.scrollY;

  glyphs.forEach((g, i) => {
    let eased = 0;
    if (pointer.live) {
      const d = Math.hypot(g.cx - px, g.cy - py);
      const f = clamp(1 - d / REACH, 0, 1);
      eased = f * f;
    }
    // phase offset per glyph turns the bob into a wave travelling along the name
    const bob = Math.sin(t * 1.5 + i * 0.55) * BOB;
    g.inner.style.setProperty('--lift', `${(bob - eased * LIFT).toFixed(2)}px`);
    g.inner.style.setProperty('--sc', String(1 + eased * 0.12));
    g.inner.style.setProperty('--g', eased.toFixed(3));
  });
}

/**
 * Every few seconds one line of the hero tears — the name splits into its
 * red/cyan ghosts, the fmt.Println line jumps and slices. Random interval and
 * random target so it never looks metronomic.
 */
export function initNameGlitch(): void {
  if (reducedMotion()) return;

  const targets: { el: HTMLElement; cls: string; dur: number }[] = $$<HTMLElement>(
    '.hero h1 .ln',
  ).map((el) => ({ el, cls: 'g', dur: 900 }));

  const typer = $<HTMLElement>('.hero .typer');
  if (typer) targets.push({ el: typer, cls: 'tear', dur: 1000 });

  if (!targets.length) return;

  const schedule = (): void => {
    const wait = 3600 + Math.random() * 4600;
    window.setTimeout(() => {
      // only while the hero is actually on screen
      if (window.scrollY < window.innerHeight) {
        const t = targets[Math.floor(Math.random() * targets.length)]!;
        t.el.classList.add(t.cls);
        window.setTimeout(() => t.el.classList.remove(t.cls), t.dur);
      }
      schedule();
    }, wait);
  };

  schedule();
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
