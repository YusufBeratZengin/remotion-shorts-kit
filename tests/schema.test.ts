import { describe, expect, it } from "vitest";
import { parseTimeline, safeParseTimeline, validateTimeline } from "../src/schema";

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
    const timeline = parseTimeline(minimalValid);
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

    const parsed = parseTimeline(data);
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
  const scene = { id: "s", start: 0, end: 5, background: "#000" };
  const fixtures: { name: string; value: unknown; path: string }[] = [
    {
      name: "unsorted captions",
      value: {
        scenes: [scene],
        captions: [
          { text: "Later", start: 2, end: 3 },
          { text: "Earlier", start: 0, end: 1 },
        ],
      },
      path: "$.captions[1].start",
    },
    {
      name: "overlapping captions",
      value: {
        scenes: [scene],
        captions: [
          { text: "One", start: 0, end: 2 },
          { text: "Two", start: 1, end: 3 },
        ],
      },
      path: "$.captions[1].start",
    },
    {
      name: "overlapping scenes",
      value: { scenes: [scene, { ...scene, id: "s2", start: 4, end: 8 }] },
      path: "$.scenes[1].start",
    },
    {
      name: "nested overlap in unordered scenes",
      value: {
        scenes: [
          { ...scene, start: 3, end: 4 },
          { ...scene, end: 10 },
        ],
      },
      path: "$.scenes[0].start",
    },
    {
      name: "negative timestamp",
      value: { scenes: [scene], captions: [{ text: "Bad", start: -1, end: 1 }] },
      path: "$.captions[0].start",
    },
    {
      name: "reversed word",
      value: { scenes: [scene], captions: [{ text: "Bad", start: 2, end: 1 }] },
      path: "$.captions[0].end",
    },
    {
      name: "zero-length scene",
      value: { scenes: [{ ...scene, end: 0 }] },
      path: "$.scenes[0].end",
    },
    {
      name: "invalid element",
      value: { scenes: [{ ...scene, elements: [{ type: "unknown" }] }] },
      path: "$.scenes[0].elements[0].type",
    },
    { name: "missing scenes", value: {}, path: "$.scenes" },
    { name: "invalid root", value: null, path: "$:" },
  ];
  it.each(fixtures)("reports the JSON path for $name", ({ value, path }) => {
    const result = validateTimeline(value);
    expect(result.ok).toBe(false);
    expect(result.errors.some((message) => message.includes(path))).toBe(true);
  });
  it("returns defaults and an empty error list for valid input", () => {
    const result = validateTimeline({ scenes: [scene] });
    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
    if (result.ok) expect(result.data.fps).toBe(30);
  });
  it("allows touching scene and word boundaries", () => {
    expect(
      validateTimeline({
        scenes: [
          { ...scene, end: 1 },
          { ...scene, id: "s2", start: 1, end: 2 },
        ],
        captions: [
          { text: "One", start: 0, end: 1 },
          { text: "Two", start: 1, end: 2 },
        ],
      }).ok,
    ).toBe(true);
  });
  it("allows unordered nonoverlapping scenes without mutating the input", () => {
    const input = { scenes: [{ ...scene, id: "later", start: 5, end: 10 }, scene] };
    expect(validateTimeline(input).ok).toBe(true);
    expect(input.scenes[0]?.id).toBe("later");
  });
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
  it("accepts the second bundled timeline", async () => {
    const example = await import("../examples/second-timeline.json");
    expect(validateTimeline(example.default).ok).toBe(true);
  });
});
