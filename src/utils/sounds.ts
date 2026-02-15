const audioCtx = typeof window !== 'undefined' ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;

function playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.3) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.type = type;
  osc.frequency.value = frequency;
  gain.gain.value = volume;
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

export function playCorrectSound() {
  playTone(523, 0.15, 'sine');
  setTimeout(() => playTone(659, 0.15, 'sine'), 100);
  setTimeout(() => playTone(784, 0.2, 'sine'), 200);
}

export function playWrongSound() {
  playTone(200, 0.3, 'sawtooth', 0.2);
  setTimeout(() => playTone(150, 0.3, 'sawtooth', 0.15), 150);
}

export function playWinSound() {
  [523, 659, 784, 1047].forEach((f, i) => {
    setTimeout(() => playTone(f, 0.3, 'sine', 0.25), i * 150);
  });
}

export function playTickSound() {
  playTone(800, 0.05, 'square', 0.1);
}

export function playFreezeSound() {
  playTone(100, 0.5, 'sawtooth', 0.15);
}

export function playStreakSound() {
  [784, 988, 1175, 1319].forEach((f, i) => {
    setTimeout(() => playTone(f, 0.2, 'triangle', 0.2), i * 80);
  });
}
