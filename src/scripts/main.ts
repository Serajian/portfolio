import { initBackground, resizeBackground, updateBackground } from './background';
import { runBoot } from './boot';
import { initCurtain } from './curtain';
import { initCursor, updateCursor } from './cursor';
import { initTyper, revealHero } from './hero';
import { initPointer, updatePointer } from './pointer';
import { initCounters, initReveal } from './reveal';
import { initScroll, measureHorizontal, updateScroll } from './scroll';
import { initSound } from './sound';
import { reducedMotion } from './utils';

function frame(): void {
  updatePointer();
  updateScroll();
  updateCursor();
  updateBackground();
  requestAnimationFrame(frame);
}

function main(): void {
  initPointer();
  initSound();
  initCursor();
  initCurtain();
  initScroll();
  initReveal();
  initCounters();
  initTyper();
  initBackground();

  window.addEventListener('resize', () => {
    resizeBackground();
    measureHorizontal();
  });

  // the hero only animates once the boot curtain has lifted
  void runBoot().then(revealHero);

  if (reducedMotion()) {
    updateScroll();
  } else {
    requestAnimationFrame(frame);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main, { once: true });
} else {
  main();
}
