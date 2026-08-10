import { sound } from './sound';
import { $$, reducedMotion } from './utils';

const CHARS = '!<>-_\\/[]{}—=+*^?#01';

/** Remembers each node's real text so a second pass can never lock in a
 *  half-scrambled string as the target. */
const originals = new WeakMap<Node, string>();

/**
 * Settles each text node from random characters into its final string.
 * Calls `done` once every node in the element has landed.
 */
function scramble(el: HTMLElement, done?: () => void): void {
  if (reducedMotion()) {
    done?.();
    return;
  }

  const nodes = Array.from(el.childNodes).filter((n) => {
    if (n.nodeType !== Node.TEXT_NODE && n.nodeName !== 'SPAN') return false;
    // whitespace-only nodes are separators, not content
    return (originals.get(n) ?? n.textContent ?? '').trim().length > 0;
  });

  let pending = nodes.length;
  if (!pending) {
    done?.();
    return;
  }

  nodes.forEach((node) => {
    const target = originals.get(node) ?? node.textContent ?? '';
    originals.set(node, target);
    let frame = 0;
    const queue = [...target].map((c, i) => ({
      c,
      start: i * 2,
      end: i * 2 + 12 + Math.random() * 22,
    }));

    const run = (): void => {
      let out = '';
      let finished = 0;
      queue.forEach((q) => {
        if (frame >= q.end) {
          finished++;
          out += q.c;
        } else if (frame >= q.start) {
          out += CHARS[Math.floor(Math.random() * CHARS.length)];
        } else {
          out += ' ';
        }
      });
      node.textContent = out;

      if (finished < queue.length) {
        frame++;
        requestAnimationFrame(run);
      } else {
        node.textContent = target;
        if (--pending === 0) done?.();
      }
    };

    run();
  });
}

/** Fades sections in, scrambles their headings, then fires a glitch burst. */
export function initReveal(): void {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        el.classList.add('in');

        const heading = el.querySelector<HTMLElement>('[data-scramble]');
        if (heading && !heading.dataset.did) {
          heading.dataset.did = '1';
          scramble(heading, () => {
            heading.classList.add('g');
            sound.tick();
            window.setTimeout(() => heading.classList.remove('g'), 1600);
          });
        }

        io.unobserve(el);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -70px' },
  );

  $$('.sec,.hsec,.rv').forEach((el) => io.observe(el));
}

/** Skill bars fill and stat numbers count up when they scroll into view. */
export function initCounters(): void {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        io.unobserve(el);

        el.querySelectorAll<HTMLElement>('.fill').forEach((fill, i) => {
          window.setTimeout(() => (fill.style.width = `${fill.dataset.w}%`), i * 140);
        });

        el.querySelectorAll<HTMLElement>('[data-c]').forEach((node, i) => {
          const to = Number(node.dataset.c);
          const suffix = node.dataset.suffix ?? '';
          let n = 0;
          window.setTimeout(() => {
            const step = window.setInterval(() => {
              n += Math.max(1, Math.ceil(to / 45));
              if (n >= to) {
                n = to;
                window.clearInterval(step);
              }
              node.textContent = `${n}${suffix}`;
            }, 24);
          }, i * 120);
        });
      });
    },
    { threshold: 0.35 },
  );

  $$('.bars').forEach((el) => io.observe(el));
}
