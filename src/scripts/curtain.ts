import { sound } from './sound';
import { $, $$, reducedMotion } from './utils';

/**
 * Clicking a nav item drops six panels over the viewport, jumps the scroll
 * position behind them, then lifts them in the opposite order.
 */
export function initCurtain(): void {
  const curtain = $('#curtain');
  const label = $('#clabel');
  if (!curtain) return;

  let busy = false;

  $$<HTMLAnchorElement>('nav a').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (busy) return;

      const id = link.dataset.s;
      const target = id ? document.getElementById(id) : null;
      if (!target) return;

      sound.click();

      if (reducedMotion()) {
        target.scrollIntoView();
        return;
      }

      busy = true;
      if (label) label.textContent = id ?? '';
      curtain.classList.remove('out');
      curtain.classList.add('in');
      sound.swipe();

      window.setTimeout(() => {
        const prev = document.documentElement.style.scrollBehavior;
        document.documentElement.style.scrollBehavior = 'auto';
        window.scrollTo(0, target.offsetTop + 2);
        document.documentElement.style.scrollBehavior = prev;

        curtain.classList.remove('in');
        curtain.classList.add('out');
        window.setTimeout(() => {
          curtain.classList.remove('out');
          busy = false;
        }, 820);
      }, 820);
    });
  });
}
