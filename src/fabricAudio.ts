// ============================================================
// Web Audio Synthesizer for Digital Loom & Fiber Harmonics
// Pure browser audio synthesis — no external assets required
// ============================================================

class LoomSynthesizer {
  private ctx: AudioContext | null = null;
  public enabled = false;

  private ensure() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  public toggle(): boolean {
    this.enabled = !this.enabled;
    if (this.enabled) {
      this.ensure();
      this.tensionChime();
    }
    return this.enabled;
  }

  // Yarn string pluck (Harp / Silk filament vibration)
  public pluckThread(freq = 520) {
    if (!this.enabled) return;
    try {
      this.ensure();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.96, now + 0.18);

      gain.gain.setValueAtTime(0.045, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.24);
    } catch {}
  }

  // Shuttle passing through warp shed (silky whoosh)
  public shuttlePass() {
    if (!this.enabled) return;
    try {
      this.ensure();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.16);
      osc.frequency.exponentialRampToValueAtTime(310, now + 0.35);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.03, now + 0.14);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } catch {}
  }

  // Tactile loom shuttle click / stitch lock
  public loomClick() {
    if (!this.enabled) return;
    try {
      this.ensure();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(840, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.045);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch {}
  }

  // Resonant textile chord (when opening a case study or completing pattern analysis)
  public tensionChime() {
    if (!this.enabled) return;
    try {
      this.ensure();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const frequencies = [440, 554.37, 659.25, 880]; // A major silk harmonic

      frequencies.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);
        gain.gain.setValueAtTime(0.03, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 0.7);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.72);
      });
    } catch {}
  }
}

export const loomAudio = new LoomSynthesizer();
