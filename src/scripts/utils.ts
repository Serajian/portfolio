export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

/** The user asked the OS to keep motion to a minimum — every module respects this. */
export const reducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Below this width the layout drops the rail, the cursor and the pinned scroller. */
export const MOBILE = 820;

export const isMobile = () => window.innerWidth <= MOBILE;

export const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  root.querySelector<T>(sel);

export const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(sel));
