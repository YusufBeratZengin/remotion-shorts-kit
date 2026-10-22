import { describe, expect, it } from "vitest";
import { easingPresets, interpolateValue } from "../src/helpers/easing";

describe("easing helpers", () => {
  it("computes boundary values [0, 1] correctly across all presets", () => {
    const presets = Object.values(easingPresets);
    for (const preset of presets) {
      expect(preset(0)).toBeCloseTo(0, 5);
      expect(preset(1)).toBeCloseTo(1, 5);
    }
  });

  it("computes easeInOutQuad symmetrically", () => {
    expect(easingPresets.easeInOutQuad(0.5)).toBeCloseTo(0.5, 5);
    expect(easingPresets.easeInOutQuad(0.25)).toBeLessThan(0.25);
    expect(easingPresets.easeInOutQuad(0.75)).toBeGreaterThan(0.75);
  });

  it("computes easeOutBack with overshoot", () => {
    // easeOutBack overshoots 1.0 before settling at 1.0
    const val = easingPresets.easeOutBack(0.7);
    expect(val).toBeGreaterThan(0.9);
  });

  it("interpolates value cleanly", () => {
    expect(interpolateValue(5, [0, 10], [0, 100])).toBe(50);
    expect(interpolateValue(0, [0, 10], [0, 100])).toBe(0);
    expect(interpolateValue(10, [0, 10], [0, 100])).toBe(100);
    expect(interpolateValue(15, [0, 10], [0, 100])).toBe(100); // clamped
    expect(interpolateValue(-5, [0, 10], [0, 100])).toBe(0); // clamped
  });

  it("handles identical input bounds gracefully", () => {
    expect(interpolateValue(5, [10, 10], [20, 40])).toBe(20);
  });
});
