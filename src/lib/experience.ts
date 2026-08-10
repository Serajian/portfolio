/**
 * One source of truth for "how long have I been doing this".
 *
 * Used at build time to render the copy, and again in the browser so the
 * number is right even on a build that has been sitting on the server since
 * last year.
 */

/** First month of the first job — see `meta.workingSince` in site.ts. */
export const CAREER_START = { year: 2018, month: 8 } as const;

/** Full years elapsed, counted from the starting month rather than Jan 1. */
export function yearsOfExperience(
  start: { year: number; month: number } = CAREER_START,
  now: Date = new Date(),
): number {
  let years = now.getFullYear() - start.year;
  if (now.getMonth() + 1 < start.month) years -= 1;
  return Math.max(0, years);
}

const WORDS = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
  'twenty',
];

/** "Eight" reads better than "8" in prose; falls back to digits past twenty. */
export function inWords(n: number): string {
  const word = WORDS[n];
  if (!word) return String(n);
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/** e.g. "2018-8" → the same string the build rendered */
export function parseSince(value: string): { year: number; month: number } | null {
  const [year, month] = value.split('-').map(Number);
  if (!year || !month) return null;
  return { year, month };
}

/** Re-renders any [data-years] span in case the build is a year old. */
export function initYears(): void {
  document.querySelectorAll<HTMLElement>('[data-years]').forEach((el) => {
    const start = parseSince(el.dataset.years ?? '');
    if (!start) return;
    el.textContent = inWords(yearsOfExperience(start));
  });
}
