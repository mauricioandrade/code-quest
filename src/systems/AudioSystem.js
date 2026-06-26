const ctx = new (window.AudioContext || window.webkitAudioContext)();

function osc(freq, type, duration, gain = 0.2, delay = 0) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.connect(g);
  g.connect(ctx.destination);
  o.type = type;
  o.frequency.setValueAtTime(freq, ctx.currentTime + delay);
  g.gain.setValueAtTime(gain, ctx.currentTime + delay);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
  o.start(ctx.currentTime + delay);
  o.stop(ctx.currentTime + delay + duration);
}

const SFX_MAP = {
  hit() {
    osc(220, 'square', 0.1, 0.3);
    osc(440, 'square', 0.1, 0.2, 0.05);
  },
  miss() {
    osc(120, 'sawtooth', 0.2, 0.3);
    osc(80,  'sawtooth', 0.15, 0.2, 0.1);
  },
  attack() {
    osc(320, 'square', 0.08, 0.2);
    osc(640, 'square', 0.06, 0.15, 0.05);
    osc(280, 'square', 0.1,  0.2,  0.1);
  },
  'enemy-attack'() {
    osc(100, 'sawtooth', 0.15, 0.3);
    osc(60,  'sine',     0.12, 0.2, 0.1);
  },
  streak() {
    [440, 550, 660, 880].forEach((f, i) => osc(f, 'triangle', 0.12, 0.25, i * 0.06));
  },
  'level-up'() {
    [261, 329, 392, 523, 659, 784].forEach((f, i) => osc(f, 'triangle', 0.18, 0.3, i * 0.08));
  },
  victory() {
    [523, 659, 784, 1047].forEach((f, i) => osc(f, 'triangle', 0.3, 0.3, i * 0.1));
    osc(1047, 'triangle', 0.5, 0.25, 0.4);
  },
  defeat() {
    [392, 311, 261, 196].forEach((f, i) => osc(f, 'sawtooth', 0.25, 0.3, i * 0.12));
  },
  select() {
    osc(660, 'triangle', 0.08, 0.2);
    osc(880, 'triangle', 0.06, 0.15, 0.06);
  },
  open() {
    osc(440, 'sine', 0.1, 0.2);
    osc(520, 'sine', 0.08, 0.15, 0.07);
  },
  'text-blip'() {
    osc(1320, 'square', 0.02, 0.05);
  },
};

let ambientInterval = null;
const AMBIENT_NOTES = [130, 146, 174, 196, 220, 246, 261, 293];

export const AudioSystem = {
  muted: false,

  play(sfx) {
    if (this.muted) return;
    if (ctx.state === 'suspended') ctx.resume();
    SFX_MAP[sfx]?.();
  },

  startAmbient() {
    if (ambientInterval) return;
    ambientInterval = setInterval(() => {
      if (this.muted) return;
      if (ctx.state === 'suspended') return;
      const f = AMBIENT_NOTES[Math.floor(Math.random() * AMBIENT_NOTES.length)];
      osc(f, 'sine', 1.2, 0.04);
    }, 800);
  },

  stopAmbient() {
    clearInterval(ambientInterval);
    ambientInterval = null;
  },

  toggleMute() {
    this.muted = !this.muted;
  },
};
