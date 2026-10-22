import { describe, expect, it } from "vitest";
import {
  clamp,
  durationToFrames,
  formatTimestamp,
  framesToSeconds,
  secondsToFrames,
} from "../src/helpers/time";

describe("time helpers", () => {
  it("converts seconds to frames correctly", () => {
    expect(secondsToFrames(0, 30)).toBe(0);
    expect(secondsToFrames(1, 30)).toBe(30);
    expect(secondsToFrames(0.5, 30)).toBe(15);
    expect(secondsToFrames(0.333, 30)).toBe(10);
    expect(secondsToFrames(1, 60)).toBe(60);
  });

  it("handles negative seconds gracefully", () => {
    expect(secondsToFrames(-5, 30)).toBe(0);
  });

  it("throws on invalid fps", () => {
    expect(() => secondsToFrames(1, 0)).toThrow();
    expect(() => secondsToFrames(1, -10)).toThrow();
    expect(() => framesToSeconds(30, 0)).toThrow();
  });

  it("converts frames to seconds correctly", () => {
    expect(framesToSeconds(0, 30)).toBe(0);
    expect(framesToSeconds(30, 30)).toBe(1);
    expect(framesToSeconds(45, 30)).toBe(1.5);
    expect(framesToSeconds(60, 60)).toBe(1);
  });

  it("handles negative frames gracefully", () => {
    expect(framesToSeconds(-10, 30)).toBe(0);
  });

  it("calculates duration in frames", () => {
    expect(durationToFrames(0, 2, 30)).toBe(60);
    expect(durationToFrames(1.5, 3.5, 30)).toBe(60);
    expect(durationToFrames(5, 2, 30)).toBe(0);
  });

  it("clamps values between min and max", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
    expect(() => clamp(5, 10, 0)).toThrow();
  });

  it("formats timestamps cleanly", () => {
    expect(formatTimestamp(0)).toBe("00:00.0");
    expect(formatTimestamp(5.5)).toBe("00:05.5");
    expect(formatTimestamp(65.2)).toBe("01:05.2");
  });
});
