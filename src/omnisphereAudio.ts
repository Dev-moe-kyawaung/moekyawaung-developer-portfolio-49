// Omni-Sphere holographic UI synth — glints, hologram sweeps, data pulses
class OmniAudio {
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
    if (this.enabled) { this.ensure(); this.holoChime(); }
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
    g.gain.exponentialRampToValueAtTime(vol, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    o.connect(g); g.connect(this.ctx.destination);
    o.start(now); o.stop(now + dur + 0.02);
  }

  glint() { if (this.enabled) { this.ensure(); this.tone("sine", 1200, 2400, 0.06, 0.03); } }
  pulse() { if (this.enabled) { this.ensure(); this.tone("triangle", 440, 660, 0.12, 0.05); this.tone("sine", 880, 1320, 0.18, 0.03, 0.05); } }
  sweep() { if (this.enabled) { this.ensure(); this.tone("sawtooth", 300, 1800, 0.4, 0.04); this.tone("sine", 1800, 300, 0.45, 0.03, 0.04); } }
  holoChime() {
    if (!this.enabled) return;
    this.ensure();
    [659.25, 987.77, 1318.5, 1975.5].forEach((f, i) => this.tone("sine", f, f * 1.01, 1.1, 0.04, i * 0.07));
  }
  click() { if (this.enabled) { this.ensure(); this.tone("square", 900, 1400, 0.04, 0.03); } }
  expand() { if (this.enabled) { this.ensure(); this.tone("sine", 200, 1600, 0.35, 0.05); } }
}
export const omni = new OmniAudio();
