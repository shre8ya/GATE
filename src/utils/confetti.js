import confetti from 'canvas-confetti';
import { playSuccessChime, playBell } from './audio';

/**
 * Fires a crisp, micro-confetti burst when a single task/phase/checkbox is completed.
 * Optionally originates from the click event coordinates.
 */
export function fireTaskConfetti(event) {
  try {
    playSuccessChime();
  } catch (e) {
    // Audio context may require prior user interaction
  }

  let origin = { x: 0.5, y: 0.6 };
  if (event && event.clientX && event.clientY) {
    origin = {
      x: Math.max(0.1, Math.min(0.9, event.clientX / window.innerWidth)),
      y: Math.max(0.1, Math.min(0.9, event.clientY / window.innerHeight))
    };
  }

  // Crisp micro burst (30-40 particles)
  confetti({
    particleCount: 35,
    spread: 60,
    startVelocity: 25,
    origin,
    colors: ['#22C55E', '#3B82F6', '#F59E0B', '#EC4899', '#8B5CF6'],
    ticks: 120,
    gravity: 1.2,
    scalar: 0.75,
    disableForReducedMotion: true
  });
}

/**
 * Fires a MASSIVE, multi-stage celebratory confetti explosion
 * when an entire day or major milestone is completed!
 */
export function fireFullDayConfetti() {
  try {
    playBell();
    setTimeout(() => playSuccessChime(), 350);
  } catch (e) {}

  // 1. Center cannon burst
  confetti({
    particleCount: 100,
    spread: 100,
    origin: { y: 0.6 },
    colors: ['#FFD700', '#FFA500', '#10B981', '#3B82F6', '#EC4899'],
    scalar: 1.1,
    ticks: 200
  });

  // 2. Left and Right cannon streams
  const duration = 2.5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 35, spread: 360, ticks: 150, zIndex: 9999 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 40 * (timeLeft / duration);
    // Left burst
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: ['#FFD700', '#10B981', '#6366F1', '#F43F5E']
    });
    // Right burst
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: ['#38BDF8', '#F59E0B', '#84CC16', '#A855F7']
    });
  }, 250);
}
