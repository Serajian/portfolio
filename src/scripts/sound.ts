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
  ): void {
    if (!this.enabled) return;
    const c = this.context;
    if (!c) return;

    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, c.currentTime);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, c.currentTime + dur);

    gain.gain.setValueAtTime(0.0001, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(vol, c.currentTime + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);

    osc.connect(gain);
    gain.connect(c.destination);
    osc.start();
    osc.stop(c.currentTime + dur + 0.03);
  }

  /** throttled so sweeping across a card grid doesn't machine-gun */
  hover(): void {
    const now = performance.now();
    if (now - this.lastHover < 70) return;
    this.lastHover = now;
    this.tone(1750, 0.028, 0.012, 'sine');
  }

  click(): void {
    this.tone(680, 0.05, 0.05, 'triangle', 300);
    window.setTimeout(() => this.tone(240, 0.06, 0.03, 'sine'), 36);
  }

  /** the curtain sweep */
  swipe(): void {
    this.tone(180, 0.5, 0.045, 'sawtooth', 900);
  }

  /** a heading finishing its scramble */
  tick(): void {
    this.tone(1200, 0.02, 0.02, 'square');
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
    btn.textContent = `♪ sound: ${on ? 'on' : 'off'}`;
    btn.classList.toggle('off', !on);
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
