import { $, $$, reducedMotion } from './utils';

/** Splits each hero line into characters that rise into place one by one. */
export function revealHero(): void {
  $$<HTMLElement>('h1 .ln').forEach((line, li) => {
    if (line.dataset.done) return;
    line.dataset.done = '1';
    const text = line.dataset.t ?? '';
    [...text].forEach((char, i) => {
      const span = document.createElement('span');
      span.className = 'ch';
      span.textContent = char;
      span.style.animationDelay = `${0.1 + li * 0.14 + i * 0.045}s`;
      line.appendChild(span);
    });
  });

  $$<HTMLElement>('.hero .prompt,.hero .typer,.hero .cta,.hero .scroll-cue').forEach((el, i) => {
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
}

/** The `const role = "…"` typewriter. */
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
