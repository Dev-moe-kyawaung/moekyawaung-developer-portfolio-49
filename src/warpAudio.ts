// Interstellar warp-drive synth — hails, warp engage, subspace clicks, tractor beams
class WarpAudio {
  private ctx: AudioContext | null = null;
  enabled = false;

  private ensure() {
    if (!this.ctx && typeof window !== "undefined") {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AC) this.ctx = new AC();
    }
    if (this.ctx?.state === "suspended") this.ctx.resume().catch(() => {});
  }

  toggle(): boolean {
    this.enabled = !this.enabled;
    if (this.enabled) { this.ensure(); this.hail(); }
    return this.enabled;
  }

  private tone(type: OscillatorType, f0: number, f1: number, dur: number, vol: number, delay = 0) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime + delay;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(Math.max(20, f0), now);
    o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), now + dur);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(vol, now + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    o.connect(g); g.connect(this.ctx.destination);
    o.start(now); o.stop(now + dur + 0.02);
  }

  // Subspace click
  click() { if (this.enabled) { this.ensure(); this.tone("square", 1400, 700, 0.04, 0.03); } }

  // Incoming hail tone
  hail() { if (this.enabled) { this.ensure(); this.tone("sine", 440, 880, 0.3, 0.04); this.tone("sine", 880, 1320, 0.25, 0.025, 0.15); } }

  // Warp engage — deep rumble up to high whine
  warp() {
    if (!this.enabled) return;
    this.ensure();
    this.tone("sawtooth", 80, 1800, 0.55, 0.04);
    this.tone("sine", 220, 2400, 0.6, 0.03, 0.08);
  }

  // Tractor beam lock
  tractor() { if (this.enabled) { this.ensure(); this.tone("triangle", 180, 320, 0.4, 0.03); } }

  // Mission complete chime
  chime() {
    if (!this.enabled) return;
    this.ensure();
    [659.25, 830.61, 987.77].forEach((f, i) => this.tone("sine", f, f, 0.45, 0.04, i * 0.09));
  }

  // Red alert
  alert() { if (this.enabled) { this.ensure(); this.tone("square", 880, 880, 0.15, 0.04); this.tone("square", 660, 660, 0.15, 0.04, 0.18); } }
}
export const warp = new WarpAudio();
