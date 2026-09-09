// Web Audio Synthesizer for Volcanic Core — rumble, crackle, eruption, thermal pulse
class VolcanicAudio {
  private ctx: AudioContext | null = null;
  public enabled = false;

  private ensure() {
    if (!this.ctx && typeof window !== "undefined") {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AC) this.ctx = new AC();
    }
    if (this.ctx?.state === "suspended") this.ctx.resume().catch(() => {});
  }

  toggle(): boolean {
    this.enabled = !this.enabled;
    if (this.enabled) { this.ensure(); this.rumble(); }
    return this.enabled;
  }

  rumble() {
    if (!this.enabled) return;
    try {
      this.ensure();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(55, now);
      osc.frequency.exponentialRampToValueAtTime(28, now + 0.6);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
      osc.connect(gain); gain.connect(this.ctx.destination);
      osc.start(now); osc.stop(now + 0.62);
    } catch {}
  }

  crackle() {
    if (!this.enabled) return;
    try {
      this.ensure();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(1800 + Math.random() * 1200, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.04);
      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
      osc.connect(gain); gain.connect(this.ctx.destination);
      osc.start(now); osc.stop(now + 0.045);
    } catch {}
  }

  erupt() {
    if (!this.enabled) return;
    try {
      this.ensure();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Sub-bass explosion
      const o1 = this.ctx.createOscillator();
      const g1 = this.ctx.createGain();
      o1.type = "sawtooth";
      o1.frequency.setValueAtTime(90, now);
      o1.frequency.exponentialRampToValueAtTime(22, now + 0.8);
      g1.gain.setValueAtTime(0.1, now);
      g1.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
      o1.connect(g1); g1.connect(this.ctx.destination);
      o1.start(now); o1.stop(now + 0.82);
      // High-frequency magma hiss
      const o2 = this.ctx.createOscillator();
      const g2 = this.ctx.createGain();
      o2.type = "sawtooth";
      o2.frequency.setValueAtTime(400, now);
      o2.frequency.exponentialRampToValueAtTime(2200, now + 0.25);
      g2.gain.setValueAtTime(0.05, now);
      g2.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
      o2.connect(g2); g2.connect(this.ctx.destination);
      o2.start(now); o2.stop(now + 0.32);
    } catch {}
  }

  thermalPulse() {
    if (!this.enabled) return;
    try {
      this.ensure();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.4);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      osc.connect(gain); gain.connect(this.ctx.destination);
      osc.start(now); osc.stop(now + 0.42);
    } catch {}
  }

  ventHiss() {
    if (!this.enabled) return;
    try {
      this.ensure();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(3200, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.06);
      gain.gain.setValueAtTime(0.025, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
      osc.connect(gain); gain.connect(this.ctx.destination);
      osc.start(now); osc.stop(now + 0.065);
    } catch {}
  }
}

export const volcano = new VolcanicAudio();
