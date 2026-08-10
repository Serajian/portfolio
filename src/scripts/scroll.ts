import { $, $$, clamp, lerp, MOBILE, reducedMotion } from './utils';

/** Shared scroll state — the shader reads `progress`, the rail reads it too. */
export const scrollState = {
  /** smoothed scrollY */
  y: 0,
  /** 0–1 through the whole document */
  progress: 0,
};

let targetY = 0;
let links: HTMLAnchorElement[] = [];
let sections: (HTMLElement | null)[] = [];
let parallaxHeads: HTMLElement[] = [];
let readout: HTMLElement | null = null;
let lastSection = -1;

// horizontal pinned projects
let hSection: HTMLElement | null = null;
let hPin: HTMLElement | null = null;
let hTrack: HTMLElement | null = null;
let hBar: HTMLElement | null = null;
let hDistance = 0;

export function initScroll(): void {
  scrollState.y = window.scrollY;
  targetY = window.scrollY;

  links = $$<HTMLAnchorElement>('nav a');
  sections = links.map((a) => (a.dataset.s ? document.getElementById(a.dataset.s) : null));
  parallaxHeads = $$<HTMLElement>('.px');
  readout = $('#pv');

  hSection = $('#projects');
  hPin = $('.hpin');
  hTrack = $('#htrack');
  hBar = $('#hbarfill');

  window.addEventListener('scroll', () => (targetY = window.scrollY), { passive: true });
  measureHorizontal();
}

export function measureHorizontal(): void {
  if (!hTrack || !hPin || window.innerWidth <= MOBILE) {
    hDistance = 0;
    return;
  }
  // how far the row has to travel for its last card to reach the right edge
  hDistance = Math.max(0, hTrack.scrollWidth - (hPin.clientWidth - 64) + 40);
}

export function updateScroll(): void {
  scrollState.y = lerp(scrollState.y, targetY, 0.12);

  const probe = scrollState.y + window.innerHeight * 0.34;
  let current = 0;
  sections.forEach((section, i) => {
    if (section && section.offsetTop <= probe) current = i;
  });

  // only touch the DOM when the active section actually changes
  if (current !== lastSection) {
    lastSection = current;
    links.forEach((a, i) => a.classList.toggle('on', i === current));
    const hue = sections[current]?.dataset.hue;
    if (hue) document.documentElement.style.setProperty('--hue', hue);
  }

  const max = Math.max(1, document.body.scrollHeight - window.innerHeight);
  scrollState.progress = clamp(scrollState.y / max, 0, 1);
  document.documentElement.style.setProperty('--progress', `${scrollState.progress * 100}%`);
  if (readout) readout.textContent = String(Math.floor(scrollState.progress * 100)).padStart(2, '0');

  if (!reducedMotion()) {
    parallaxHeads.forEach((head) => {
      const r = head.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        head.style.transform = `translateY(${(r.top - window.innerHeight * 0.5) * -0.06}px)`;
      }
    });
  }

  // vertical scroll drives the projects row sideways
  if (hDistance > 0 && hSection && hTrack && !reducedMotion()) {
    const rect = hSection.getBoundingClientRect();
    const span = Math.max(1, hSection.offsetHeight - window.innerHeight);
    const p = clamp(-rect.top / span, 0, 1);
    hTrack.style.transform = `translateX(${-p * hDistance}px)`;
    if (hBar) hBar.style.width = `${p * 100}%`;
  }
}
