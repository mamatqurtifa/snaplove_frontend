// Sound utilities for photobooth experience
export const playSound = (type) => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    switch (type) {
      case 'countdown':
        playBeep(audioContext, 800, 0.1);
        break;
      case 'capture':
        playBeep(audioContext, 1200, 0.2);
        break;
      case 'complete':
        playSuccess(audioContext);
        break;
      default:
        break;
    }
  } catch (error) {
    // Silently fail if audio context is not available
    console.log('Audio not available:', error);
  }
};

const playBeep = (audioContext, frequency, duration) => {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  oscillator.type = 'sine';
  
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
};

const playSuccess = (audioContext) => {
  const frequencies = [523, 659, 784]; // C, E, G notes
  
  frequencies.forEach((freq, index) => {
    setTimeout(() => {
      playBeep(audioContext, freq, 0.15);
    }, index * 100);
  });
};

// Vibration feedback for mobile devices
export const vibrateDevice = (pattern = [100]) => {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
};

// Haptic feedback for supported devices
export const triggerHapticFeedback = (type = 'light') => {
  // For iOS devices with haptic feedback
  if (window.navigator && window.navigator.vibrate) {
    switch (type) {
      case 'light':
        vibrateDevice([10]);
        break;
      case 'medium':
        vibrateDevice([50]);
        break;
      case 'heavy':
        vibrateDevice([100]);
        break;
      default:
        vibrateDevice([10]);
    }
  }
};
