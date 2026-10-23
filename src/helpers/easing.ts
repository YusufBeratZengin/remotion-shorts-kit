import { clamp } from "./time.js";

/**
 * Standard easing functions normalized for t in [0, 1].
 */
export const easingPresets = {
  linear: (t: number): number => clamp(t, 0, 1),

  easeInQuad: (t: number): number => {
    const clamped = clamp(t, 0, 1);
    return clamped * clamped;
  },

  easeOutQuad: (t: number): number => {
    const clamped = clamp(t, 0, 1);
    return clamped * (2 - clamped);
  },

  easeInOutQuad: (t: number): number => {
    const clamped = clamp(t, 0, 1);
    return clamped < 0.5 ? 2 * clamped * clamped : -1 + (4 - 2 * clamped) * clamped;
  },

  easeInCubic: (t: number): number => {
    const clamped = clamp(t, 0, 1);
    return clamped * clamped * clamped;
  },

  easeOutCubic: (t: number): number => {
    const clamped = clamp(t, 0, 1);
    const f = clamped - 1;
    return f * f * f + 1;
  },

  easeInOutCubic: (t: number): number => {
    const clamped = clamp(t, 0, 1);
    return clamped < 0.5
      ? 4 * clamped * clamped * clamped
      : (clamped - 1) * (2 * clamped - 2) * (2 * clamped - 2) + 1;
  },

  easeOutBack: (t: number, overshoot = 1.70158): number => {
    const clamped = clamp(t, 0, 1);
    const f = clamped - 1;
    return f * f * ((overshoot + 1) * f + overshoot) + 1;
  },

  easeOutBounce: (t: number): number => {
    let clamped = clamp(t, 0, 1);
    const n1 = 7.5625;
    const d1 = 2.75;

    if (clamped < 1 / d1) {
      return n1 * clamped * clamped;
    }
    if (clamped < 2 / d1) {
      clamped -= 1.5 / d1;
      return n1 * clamped * clamped + 0.75;
    }
    if (clamped < 2.5 / d1) {
      clamped -= 2.25 / d1;
      return n1 * clamped * clamped + 0.9375;
    }
    clamped -= 2.625 / d1;
    return n1 * clamped * clamped + 0.984375;
  },
};

/**
 * Linearly interpolates between start and end using an optional easing function.
 */
export function interpolateValue(
  value: number,
  inputRange: [number, number],
  outputRange: [number, number],
  easing: (t: number) => number = easingPresets.linear,
): number {
  const [inMin, inMax] = inputRange;
  const [outMin, outMax] = outputRange;

  if (inMin === inMax) return outMin;

  const rawT = (value - inMin) / (inMax - inMin);
  const progress = clamp(rawT, 0, 1);
  const eased = easing(progress);

  return outMin + (outMax - outMin) * eased;
}
