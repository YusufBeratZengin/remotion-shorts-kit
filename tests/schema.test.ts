import { describe, expect, it } from "vitest";
import { safeParseTimeline, validateTimeline } from "../src/schema";

describe("timeline schema validation", () => {
  const minimalValid = {
    scenes: [
      {
        id: "s1",
        start: 0,
        end: 5,
        background: "#000000",
      },
    ],
  };

  it("validates and applies defaults for a minimal timeline", () => {
    const timeline = validateTimeline(minimalValid);
    expect(timeline.fps).toBe(30);
    expect(timeline.width).toBe(1080);
    expect(timeline.height).toBe(1920);
    expect(timeline.showSafeArea).toBe(false);
    expect(timeline.showProgressBar).toBe(true);
    expect(timeline.scenes).toHaveLength(1);
    expect(timeline.scenes[0]?.elements).toEqual([]);
    expect(timeline.captions).toEqual([]);
  });

  it("validates scenes with mascot and elements", () => {
    const data = {
      fps: 60,
      width: 1080,
      height: 1920,
      scenes: [
        {
          id: "intro",
          start: 0,
          end: 3,
          background: "#1e293b",
          mascot: {
            pose: "talking",
            x: 540,
            y: 1200,
            scale: 1.2,
          },
          elements: [
            {
              type: "callout",
              id: "c1",
              x: 200,
              y: 600,
              title: "Vacuum Layer",
              text: "Blocks conduction heat loss",
            },
            {
              type: "arrow",
              id: "a1",
              fromX: 200,
              fromY: 700,
              toX: 540,
              toY: 900,
              label: "Zero heat transfer",
            },
            {
              type: "zoom",
              id: "z1",
              targetX: 540,
              targetY: 900,
              scale: 1.3,
            },
          ],
        },
      ],
      captions: [
        { text: "Vacuum", start: 0.2, end: 0.6 },
        { text: "stops", start: 0.6, end: 0.9 },
        { text: "heat.", start: 0.9, end: 1.4 },
      ],
    };

    const parsed = validateTimeline(data);
    expect(parsed.fps).toBe(60);
    expect(parsed.scenes[0]?.elements).toHaveLength(3);
    expect(parsed.captions).toHaveLength(3);
  });

  it("rejects invalid timeline (empty scenes)", () => {
    const result = safeParseTimeline({
      scenes: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid mascot pose", () => {
    const result = safeParseTimeline({
      scenes: [
        {
          id: "s1",
          start: 0,
          end: 2,
          background: "#000",
          mascot: {
            pose: "flying-disco-robot", // invalid pose
            x: 100,
            y: 100,
          },
        },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative time in words", () => {
    const result = safeParseTimeline({
      scenes: [{ id: "s1", start: 0, end: 2, background: "#000" }],
      captions: [{ text: "Negative", start: -1, end: 2 }],
    });
    expect(result.success).toBe(false);
  });
});

describe("timeline schema ordering rules", () => {
  it("rejects scenes whose end is not after start", () => {
    const result = safeParseTimeline({
      scenes: [{ id: "bad", start: 3, end: 3, background: "#000" }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects words that end before they start", () => {
    const result = safeParseTimeline({
      scenes: [{ id: "s", start: 0, end: 2, background: "#000" }],
      captions: [{ text: "hi", start: 1, end: 0.5 }],
    });
    expect(result.success).toBe(false);
  });

  it("accepts the bundled demo timeline", async () => {
    const demo = await import("../examples/demo-timeline.json");
    expect(safeParseTimeline(demo.default).success).toBe(true);
  });
});
