import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Captions } from "../src/components/Captions";
import { Mascot } from "../src/components/Mascot";
import { SafeAreaOverlay } from "../src/components/SafeAreaOverlay";
import { SceneRenderer } from "../src/components/SceneRenderer";
import { ExplainerShort } from "../src/compositions/ExplainerShort";
import { parseTimeline } from "../src/schema";

const state = vi.hoisted(() => ({ frame: 0, isRendering: false }));
vi.mock("remotion", async (importOriginal) => ({
  ...(await importOriginal<typeof import("remotion")>()),
  useCurrentFrame: () => state.frame,
  useVideoConfig: () => ({ fps: 30, width: 1080, height: 1920, durationInFrames: 120 }),
  getRemotionEnvironment: () => ({ isRendering: state.isRendering }),
}));

beforeEach(() => {
  state.frame = 0;
  state.isRendering = false;
});

describe("Captions", () => {
  const words = [
    { text: "Water", start: 0, end: 1 },
    { text: "flows", start: 1, end: 2 },
  ];
  it("renders nothing with no captions", () => {
    expect(renderToStaticMarkup(<Captions captions={[]} />)).toBe("");
  });
  it("renders nothing before the first word", () => {
    expect(
      renderToStaticMarkup(<Captions captions={[{ text: "Later", start: 1, end: 2 }]} />),
    ).toBe("");
  });
  it("breaks words into separate lines at the character limit", () => {
    const markup = renderToStaticMarkup(
      <Captions captions={words} batchingOptions={{ maxCharsPerLine: 5 }} />,
    );
    expect(markup).toMatch(/Water<\/span><\/div><div[^>]*><span[^>]*>flows/);
  });
  it("highlights the active word at an interior frame", () => {
    state.frame = 15;
    const markup = renderToStaticMarkup(<Captions captions={words} />);
    expect(markup).toMatch(/<span[^>]*font-weight:900[^>]*>Water/);
    expect(markup).toMatch(/<span[^>]*font-weight:700[^>]*>flows/);
  });
  it("highlights only the next word at an exact shared boundary", () => {
    state.frame = 30;
    const markup = renderToStaticMarkup(<Captions captions={words} />);
    expect(markup.match(/font-weight:900/g)).toHaveLength(1);
    expect(markup).toMatch(/<span[^>]*font-weight:900[^>]*>flows/);
  });
  it("hides a completed batch after its linger time", () => {
    state.frame = 90;
    expect(renderToStaticMarkup(<Captions captions={words} />)).toBe("");
  });
  it("keeps captions above the bottom UI and inside the right rail", () => {
    const markup = renderToStaticMarkup(<Captions captions={words} />);
    expect(markup).toContain("bottom:500px");
    expect(markup).toContain("padding:0 180px 0 60px");
  });
});

describe("SceneRenderer and composition boundaries", () => {
  const timeline = parseTimeline({
    showProgressBar: false,
    scenes: [
      { id: "first", start: 0, end: 2, background: "#123456", title: "First scene" },
      { id: "second", start: 2, end: 4, background: "#654321", title: "Second scene" },
    ],
  });
  it("renders the supplied scene title and background", () => {
    const scene = timeline.scenes[0];
    if (!scene) throw new Error("Missing scene fixture");
    const markup = renderToStaticMarkup(<SceneRenderer scene={scene} />);
    expect(markup).toContain("First scene");
    expect(markup).toContain("background:#123456");
  });
  it("uses the first SceneRenderer before the boundary", () => {
    state.frame = 59;
    const markup = renderToStaticMarkup(<ExplainerShort timeline={timeline} />);
    expect(markup).toContain("First scene");
    expect(markup).not.toContain("Second scene");
  });
  it("switches SceneRenderer at the exact boundary frame", () => {
    state.frame = 60;
    const markup = renderToStaticMarkup(<ExplainerShort timeline={timeline} />);
    expect(markup).toContain("Second scene");
    expect(markup).not.toContain("First scene");
  });
  it("hides elements at their exclusive end", () => {
    const scene = parseTimeline({
      scenes: [
        {
          id: "s",
          start: 0,
          end: 4,
          background: "#000",
          elements: [
            { type: "callout", id: "card", x: 300, y: 400, text: "Timed card", start: 1, end: 2 },
          ],
        },
      ],
    }).scenes[0];
    if (!scene) throw new Error("Missing scene fixture");
    // Check the last active frame, after the callout's entrance animation.
    state.frame = 59;
    expect(renderToStaticMarkup(<SceneRenderer scene={scene} />)).toContain("Timed card");
    state.frame = 60;
    expect(renderToStaticMarkup(<SceneRenderer scene={scene} />)).not.toContain("Timed card");
  });
});

describe("Mascot", () => {
  it("swaps original SVG artwork with the pose prop", () => {
    const idle = renderToStaticMarkup(<Mascot pose="idle" x={400} y={900} />);
    const thinking = renderToStaticMarkup(<Mascot pose="thinking" x={400} y={900} />);
    expect(idle).toContain('aria-label="Mascot idle pose"');
    expect(thinking).toContain('aria-label="Mascot thinking pose"');
    expect(idle).not.toEqual(thinking);
  });
  it("supports all five poses", () => {
    for (const pose of ["idle", "talking", "explaining", "thinking", "surprised"] as const) {
      expect(renderToStaticMarkup(<Mascot pose={pose} x={400} y={900} />)).toContain(
        `Mascot ${pose} pose`,
      );
    }
  });
});

describe("SafeAreaOverlay", () => {
  it("is hidden by default", () => {
    expect(renderToStaticMarkup(<SafeAreaOverlay />)).toBe("");
  });
  it("is visible in Studio when enabled", () => {
    expect(renderToStaticMarkup(<SafeAreaOverlay visible />)).toContain("SAFE CONTENT ZONE");
  });
  it("is hidden in final renders when enabled", () => {
    state.isRendering = true;
    expect(renderToStaticMarkup(<SafeAreaOverlay visible />)).toBe("");
  });
  it("can be explicitly included in a final render", () => {
    state.isRendering = true;
    expect(renderToStaticMarkup(<SafeAreaOverlay visible showInRender />)).toContain(
      "SAFE CONTENT ZONE",
    );
  });
  it("respects visible=false even with showInRender", () => {
    state.isRendering = true;
    expect(renderToStaticMarkup(<SafeAreaOverlay showInRender />)).toBe("");
  });
});
