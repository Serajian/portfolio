import { initBackground, resizeBackground, updateBackground } from './background';
import { runBoot } from './boot';
import { initCurtain } from './curtain';
import { initCursor, updateCursor } from './cursor';
import { initNameGlitch, initTyper, measureHero, revealHero, updateHero } from './hero';
import { initPointer, updatePointer } from './pointer';
import { initReveal } from './reveal';
import { initScroll, measureHorizontal, updateScroll } from './scroll';
import { initSound } from './sound';
import { reducedMotion } from './utils';

function frame(): void {
  updatePointer();
  updateScroll();
  updateCursor();
  updateHero();
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
  initTyper();
  initBackground();

  window.addEventListener('resize', () => {
    resizeBackground();
    measureHorizontal();
    measureHero();
  });

  // glyph boxes move once the webfont swaps in
  void document.fonts?.ready.then(measureHero);

  // the hero only animates once the boot curtain has lifted
  void runBoot().then(() => {
    revealHero();
    initNameGlitch();
  });

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
