// Native Web Audio API Sound Generator & Synthesizer
// Zero external assets required — completely offline and instantaneous

let audioCtx = null;
let currentAmbientNode = null;
let ambientGainNode = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Gentle Tibetan/Zen study bell
export function playBell() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    
    // Fundamental frequencies for bell resonance
    const freqs = [523.25, 783.99, 1046.50, 1567.98]; // C5, G5, C6, G6
    const gains = [0.25, 0.15, 0.08, 0.04];
    
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      
      gain.gain.setValueAtTime(gains[idx], now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now);
      osc.stop(now + 3.2);
    });
  } catch (err) {
    console.warn("Audio bell playback error:", err);
  }
}

// Success Arpeggio
export function playSuccessChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    
    const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
    notes.forEach((freq, i) => {
      const noteTime = now + (i * 0.09);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);
      
      gain.gain.setValueAtTime(0.2, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 1.2);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(noteTime);
      osc.stop(noteTime + 1.3);
    });
  } catch (err) {
    console.warn("Success chime error:", err);
  }
}

// Subtle tactile UI click
export function playClick() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
    
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.05);
  } catch (err) {
    // silent fallback
  }
}

// Ambient Focus Sound Synthesizer
export function startAmbientSound(type = 'drone', volume = 0.3) {
  stopAmbientSound();
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    ambientGainNode = ctx.createGain();
    ambientGainNode.gain.setValueAtTime(0.001, ctx.currentTime);
    ambientGainNode.gain.linearRampToValueAtTime(volume * 0.15, ctx.currentTime + 1.5);
    ambientGainNode.connect(ctx.destination);
    
    if (type === 'white_noise') {
      // White / Pink noise buffer
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        output[i] = (b0 + b1 + b2 + white * 0.5362) * 0.11;
      }
      
      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;
      
      // Low pass filter to make it pleasant rain-like
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      
      whiteNoise.connect(filter);
      filter.connect(ambientGainNode);
      whiteNoise.start();
      currentAmbientNode = whiteNoise;
      
    } else if (type === 'binaural_40hz') {
      // 40Hz Gamma Focus Tone (200Hz left, 240Hz right)
      const merger = ctx.createChannelMerger(2);
      
      const oscL = ctx.createOscillator();
      oscL.type = 'sine';
      oscL.frequency.setValueAtTime(200, ctx.currentTime);
      
      const oscR = ctx.createOscillator();
      oscR.type = 'sine';
      oscR.frequency.setValueAtTime(240, ctx.currentTime);
      
      oscL.connect(merger, 0, 0);
      oscR.connect(merger, 0, 1);
      merger.connect(ambientGainNode);
      
      oscL.start();
      oscR.start();
      currentAmbientNode = {
        stop: () => {
          oscL.stop();
          oscR.stop();
        }
      };
    } else {
      // Deep Space / Study Drone (108Hz + 112Hz harmonics)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(108, ctx.currentTime);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(162, ctx.currentTime);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, ctx.currentTime);
      
      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(ambientGainNode);
      
      osc1.start();
      osc2.start();
      currentAmbientNode = {
        stop: () => {
          osc1.stop();
          osc2.stop();
        }
      };
    }
  } catch (err) {
    console.warn("Ambient sound error:", err);
  }
}

export function stopAmbientSound() {
  if (currentAmbientNode) {
    try {
      currentAmbientNode.stop();
    } catch (e) {}
    currentAmbientNode = null;
  }
}
