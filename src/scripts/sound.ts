/**
 * Tiny WebAudio blip engine — no audio files, everything is synthesised.
 * Browsers block audio until the first user gesture, so nothing is heard
 * until the visitor clicks once. Gains are deliberately very low.
 */
class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled = true;
  private lastHover = 0;

  private get context(): AudioContext | null {
    const Ctor =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    if (!this.ctx) this.ctx = new Ctor();
    if (this.ctx.state === 'suspended') void this.ctx.resume();
    return this.ctx;
  }

  private tone(
    freq: number,
    dur: number,
    vol: number,
    type: OscillatorType = 'sine',
    slideTo?: number,
    /** seconds from now — scheduled on the audio clock, not setTimeout, so a
     *  two-part sound lands the same way every time */
    delay = 0,
  ): void {
    if (!this.enabled) return;
    const c = this.context;
    if (!c) return;

    const t0 = c.currentTime + delay;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);

    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.03);
  }

  /** throttled so sweeping across a card grid doesn't machine-gun */
  hover(): void {
    const now = performance.now();
    if (now - this.lastHover < 70) return;
    this.lastHover = now;
    this.tone(760, 0.03, 0.01, 'sine');
  }

  /** a dry two-part click: the body, then a low thump under it */
  click(): void {
    this.tone(420, 0.045, 0.05, 'triangle', 170);
    this.tone(110, 0.09, 0.035, 'sine', undefined, 0.01);
  }

  /** the curtain sweep — falling rather than rising, like a heavy door */
  swipe(): void {
    this.tone(320, 0.26, 0.045, 'sine', 90);
  }

  /** a heading finishing its scramble */
  tick(): void {
    this.tone(900, 0.018, 0.018, 'sine');
  }

  toggle(): boolean {
    this.enabled = !this.enabled;
    if (this.enabled) void this.context;
    return this.enabled;
  }

  get on(): boolean {
    return this.enabled;
  }
}

export const sound = new SoundEngine();

export function initSound(): void {
  const btn = document.getElementById('snd');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const on = sound.toggle();
    btn.classList.toggle('off', !on);
    const label = on ? 'Sound on' : 'Sound off';
    btn.setAttribute('title', label);
    btn.setAttribute('aria-label', label);
    if (on) sound.click();
  });

  // hover + click feedback across every interactive element
  document.querySelectorAll('a,button,.chip,.card,.pcard').forEach((el) => {
    el.addEventListener('pointerenter', () => sound.hover());
  });
  document.addEventListener('click', (e) => {
    const t = e.target as Element | null;
    // nav links and the toggle play their own sounds
    if (t?.closest('nav a') || t?.closest('#snd')) return;
    if (t?.closest('a,button,.chip')) sound.click();
  });
}
