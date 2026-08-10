import { lerp } from './utils';

/**
 * Single source of truth for the pointer.
 * `x/y` follow the mouse exactly, `sx/sy` trail behind — the shader glow and
 * the cursor ring both read the smoothed pair so they feel weighted.
 */
export const pointer = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
  sx: window.innerWidth / 2,
  sy: window.innerHeight / 2,
  /** false until the pointer has actually moved — the assumed centre would
   *  otherwise sit on the hero and hold letters up before anyone touched it */
  live: false,
};

export function initPointer(): void {
  window.addEventListener(
    'pointermove',
    (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      if (!pointer.live) {
        pointer.live = true;
        // jump the trailing ring to the first known position instead of
        // sliding it in from the middle of the screen
        pointer.sx = e.clientX;
        pointer.sy = e.clientY;
        document.body.classList.add('pointer-live');
      }
      const hot = (e.target as Element | null)?.closest?.(
        'a,button,.chip,.card,.pcard,input,textarea',
      );
      document.body.classList.toggle('hot', !!hot);
    },
    { passive: true },
  );
}

export function updatePointer(): void {
  pointer.sx = lerp(pointer.sx, pointer.x, 0.16);
  pointer.sy = lerp(pointer.sy, pointer.y, 0.16);
}
