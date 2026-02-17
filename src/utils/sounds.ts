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

export function playMudSplashSound() {
  if (!audioCtx) return;
  // Low thud impact
  playTone(80, 0.4, 'sine', 0.4);
  // Noise burst for splash texture
  const bufferSize = audioCtx.sampleRate * 0.3;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.15));
  }
  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 600;
  const gain = audioCtx.createGain();
  gain.gain.value = 0.3;
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);
  noise.start();
  // Secondary bubble sounds
  setTimeout(() => playTone(120, 0.15, 'sine', 0.15), 200);
  setTimeout(() => playTone(90, 0.2, 'sine', 0.1), 350);
}

export function playVictoryFanfare() {
  // Triumphant ascending fanfare
  const notes = [523, 659, 784, 880, 1047, 1319, 1568];
  notes.forEach((f, i) => {
    setTimeout(() => playTone(f, 0.25, 'sine', 0.25), i * 120);
  });
  // Harmony layer
  setTimeout(() => {
    [659, 784, 1047, 1319].forEach((f, i) => {
      setTimeout(() => playTone(f, 0.3, 'triangle', 0.15), i * 150);
    });
  }, 100);
  // Final chord
  setTimeout(() => {
    playTone(523, 0.6, 'sine', 0.2);
    playTone(659, 0.6, 'sine', 0.15);
    playTone(784, 0.6, 'sine', 0.15);
    playTone(1047, 0.6, 'sine', 0.1);
  }, 900);
}
