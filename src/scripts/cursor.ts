import { pointer } from './pointer';
import { $, $$, reducedMotion } from './utils';

let dot: HTMLElement | null = null;
let ring: HTMLElement | null = null;

export function initCursor(): void {
  dot = $('.cur-dot');
  ring = $('.cur-ring');

  // buttons drift toward the pointer
  $$<HTMLElement>('.mag').forEach((btn) => {
    btn.addEventListener('pointermove', (e) => {
      const r = btn.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) * 0.28;
      const dy = (e.clientY - r.top - r.height / 2) * 0.4;
      btn.style.transform = `translate(${dx}px,${dy}px)`;
    });
    btn.addEventListener('pointerleave', () => (btn.style.transform = ''));
  });

  // service cards tilt in 3D and light up under the pointer
  $$<HTMLElement>('.card').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
      if (reducedMotion()) return;
      const dx = (e.clientX - r.left) / r.width - 0.5;
      const dy = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `rotateY(${dx * 9}deg) rotateX(${-dy * 9}deg) translateY(-6px)`;
    });
    card.addEventListener('pointerleave', () => (card.style.transform = ''));
  });
}

export function updateCursor(): void {
  if (dot) dot.style.transform = `translate(${pointer.x}px,${pointer.y}px)`;
  if (ring) ring.style.transform = `translate(${pointer.sx}px,${pointer.sy}px)`;
}
