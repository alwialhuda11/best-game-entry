// WebAudio sound effects — synthesized, no asset files, no network.
let ctx = null;
let muted = false;

function ac() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  return ctx;
}

function tone(freq, dur, type, gain, slide) {
  if (muted) return;
  try {
    const a = ac();
    const o = a.createOscillator();
    const g = a.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, a.currentTime);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, a.currentTime + dur);
    g.gain.setValueAtTime(gain || 0.08, a.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + dur);
    o.connect(g); g.connect(a.destination);
    o.start(); o.stop(a.currentTime + dur);
  } catch (e) { /* audio unavailable */ }
}

export const Sound = {
  rotate() { tone(420, 0.09, 'triangle', 0.05, 620); },
  crystal() { tone(880, 0.14, 'sine', 0.07, 1320); },
  levelWin() { tone(523, 0.18, 'sine', 0.08, 784); setTimeout(() => tone(784, 0.24, 'sine', 0.08, 1046), 120); },
  win() { [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => tone(f, 0.4, 'triangle', 0.09), i * 150)); },
  lose() { tone(300, 0.5, 'sawtooth', 0.06, 90); },
  click() { tone(660, 0.06, 'square', 0.03); },
  toggle() { muted = !muted; return muted; },
  isMuted() { return muted; },
};
