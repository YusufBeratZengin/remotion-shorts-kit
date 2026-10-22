/**
 * Converts a time in seconds to an integer frame number at the given FPS.
 */
export function secondsToFrames(seconds: number, fps: number): number {
  if (fps <= 0) {
    throw new Error(`FPS must be greater than 0, received ${fps}`);
  }
  if (seconds < 0) {
    return 0;
  }
  return Math.round(seconds * fps);
}

/**
 * Converts a frame number to a time in seconds at the given FPS.
 */
export function framesToSeconds(frame: number, fps: number): number {
  if (fps <= 0) {
    throw new Error(`FPS must be greater than 0, received ${fps}`);
  }
  if (frame < 0) {
    return 0;
  }
  return frame / fps;
}

/**
 * Calculates duration in frames between start and end seconds.
 */
export function durationToFrames(startSec: number, endSec: number, fps: number): number {
  if (endSec < startSec) {
    return 0;
  }
  return secondsToFrames(endSec - startSec, fps);
}

/**
 * Clamps a number between min and max bounds.
 */
export function clamp(value: number, min: number, max: number): number {
  if (min > max) {
    throw new Error(`min (${min}) cannot be greater than max (${max})`);
  }
  return Math.min(Math.max(value, min), max);
}

/**
 * Formats a time in seconds as MM:SS.ms.
 */
export function formatTimestamp(seconds: number): string {
  const safeSec = Math.max(0, seconds);
  const minutes = Math.floor(safeSec / 60);
  const remainingSec = safeSec % 60;
  const wholeSec = Math.floor(remainingSec);
  const tenths = Math.floor((remainingSec - wholeSec) * 10);

  const mm = String(minutes).padStart(2, "0");
  const ss = String(wholeSec).padStart(2, "0");
  return `${mm}:${ss}.${tenths}`;
}
