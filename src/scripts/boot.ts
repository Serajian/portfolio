import { reducedMotion } from './utils';

/**
 * The terminal boot screen. Resolves once the curtain has lifted so the hero
 * animation only starts when it is actually visible.
 */
export function runBoot(): Promise<void> {
  return new Promise((resolve) => {
    const boot = document.getElementById('boot');
    if (!boot) return resolve();

    if (reducedMotion()) {
      boot.remove();
      return resolve();
    }

    const lines = Array.from(boot.querySelectorAll<HTMLElement>('.l'));
    lines.forEach((l, i) => (l.style.animationDelay = `${i * 0.16}s`));

    const pct = boot.querySelector<HTMLElement>('.pct');
    const track = boot.querySelector<HTMLElement>('.track i');

    let p = 0;
    const timer = window.setInterval(() => {
      p += Math.random() * 13 + 5;
      if (p >= 100) {
        p = 100;
        window.clearInterval(timer);
        window.setTimeout(() => {
          boot.classList.add('done');
          resolve();
          window.setTimeout(() => boot.remove(), 1100);
        }, 260);
      }
      if (pct) pct.textContent = `${String(Math.floor(p)).padStart(2, '0')}%`;
      if (track) track.style.width = `${p}%`;
    }, 95);
  });
}
