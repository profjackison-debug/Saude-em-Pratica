/**
 * Simple web audio synthesizer for game feedback (clicks, stars, fanfare)
 * Runs safely in browser without external sound assets.
 */
let audioCtx: AudioContext | null = null;

const MUTED_KEY = 'saude_pratica_muted_v1';
let isMuted = (() => {
  try { return localStorage.getItem(MUTED_KEY) === 'true'; } catch { return false; }
})();

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function toggleAudioMute(): boolean {
  isMuted = !isMuted;
  try { localStorage.setItem(MUTED_KEY, String(isMuted)); } catch { /* ignore */ }
  return isMuted;
}

export function setAudioMuted(muted: boolean): void {
  isMuted = muted;
  try { localStorage.setItem(MUTED_KEY, String(isMuted)); } catch { /* ignore */ }
}

export function getAudioMuted(): boolean {
  return isMuted;
}

export function playClickSound() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch {
    // Audio contexts might fail if user has not interacted
  }
}

export function playStarSound() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + index * 0.07);
      gain.gain.setValueAtTime(0.09, now + index * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.07 + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + index * 0.07);
      osc.stop(now + index * 0.07 + 0.22);
    });
  } catch {
    // ignore
  }
}

export function playFanfare() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.09);
      gain.gain.setValueAtTime(0.1, now + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 0.4);
    });
  } catch {
    // ignore
  }
}
