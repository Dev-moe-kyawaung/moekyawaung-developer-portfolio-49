// Cyber-Nomad field synth — sonar pings, radio clicks, drone rotors, waypoint chimes
class NomadAudio {
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
    if (this.enabled) { this.ensure(); this.waypoint(); }
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

  sonar() { if (this.enabled) { this.ensure(); this.tone("sine", 880, 860, 0.5, 0.045); this.tone("sine", 1760, 1700, 0.3, 0.02, 0.05); } }
  click() { if (this.enabled) { this.ensure(); this.tone("square", 1400, 700, 0.035, 0.03); } }
  radio() { if (this.enabled) { this.ensure(); this.tone("sawtooth", 300, 900, 0.08, 0.02); this.tone("square", 2200, 1800, 0.05, 0.015, 0.06); } }
  waypoint() {
    if (!this.enabled) return;
    this.ensure();
    [523.25, 659.25, 783.99].forEach((f, i) => this.tone("sine", f, f, 0.5, 0.04, i * 0.09));
  }
  drone() { if (this.enabled) { this.ensure(); this.tone("sawtooth", 110, 140, 0.35, 0.025); this.tone("sine", 220, 260, 0.3, 0.02, 0.04); } }
  discover() { if (this.enabled) { this.ensure(); this.tone("triangle", 440, 880, 0.22, 0.05); this.tone("sine", 880, 1320, 0.35, 0.035, 0.12); } }
}
export const scout = new NomadAudio();
