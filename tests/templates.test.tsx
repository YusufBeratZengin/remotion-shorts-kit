import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createTemplateShowcase } from "../src/examples/TemplateShowcase";
import {
  BeforeAfterTemplateSchema,
  DEFAULT_CAPTION_STYLE,
  ExplainerShort,
  ListTemplateSchema,
  SceneRenderer,
  SceneTemplateRenderer,
  THEMES,
  ThemeSchema,
  createThemedTimeline,
  parseTimeline,
  validateTimeline,
} from "../src/library";

const state = vi.hoisted(() => ({ frame: 0 }));
vi.mock("remotion", async (importOriginal) => ({
  ...(await importOriginal<typeof import("remotion")>()),
  useCurrentFrame: () => state.frame,
  useVideoConfig: () => ({ fps: 30, width: 1080, height: 1920, durationInFrames: 300 }),
}));
beforeEach(() => {
  state.frame = 0;
});

describe("template validation", () => {
  it("fills timing defaults for both templates", () => {
    expect(
      ListTemplateSchema.parse({ type: "list", heading: "Steps", items: ["One"] }),
    ).toHaveProperty("intervalSeconds", 0.6);
    expect(
      BeforeAfterTemplateSchema.parse({
        type: "before-after",
        heading: "Compare",
        before: { label: "Before", text: "Slow" },
        after: { label: "After", text: "Fast" },
      }),
    ).toHaveProperty("revealSeconds", 1);
  });

  it.each([
    { type: "unknown", heading: "Bad" },
    { type: "list", heading: "Steps", items: [] },
    { type: "list", heading: "Steps", items: Array(6).fill("Too many") },
    { type: "list", heading: "Steps", items: [""] },
    { type: "list", heading: "Steps", items: ["One"], intervalSeconds: 0 },
    { type: "list", heading: "Steps", items: ["One"], intervalSeconds: -1 },
    { type: "before-after", heading: "Compare", before: { label: "Before", text: "Slow" } },
    {
      type: "before-after",
      heading: "Compare",
      before: { label: "Before", text: "Slow" },
      after: { label: "After", text: "Fast" },
      revealSeconds: -1,
    },
  ])("rejects malformed template data with a scene path: %j", (template) => {
    const result = validateTimeline({
      scenes: [{ id: "s", start: 0, end: 5, background: "#000", template }],
    });
    expect(result.ok).toBe(false);
    expect(result.errors.join(" ")).toContain("$.scenes[0].template");
  });
});

describe("themes", () => {
  it.each(Object.entries(THEMES))("validates and renders the %s preset", (_name, theme) => {
    expect(ThemeSchema.safeParse(theme).success).toBe(true);
    const timeline = createTemplateShowcase(theme);
    state.frame = 90;
    const markup = renderToStaticMarkup(<ExplainerShort timeline={timeline} />);
    expect(markup).toContain(`background:${theme.colors.background}`);
    expect(markup).toContain(`background:${theme.colors.surface}`);
    expect(markup).toContain(`color:${theme.colors.accent}`);
    expect(markup).toContain(`background-color:${theme.colors.accent}`);
    expect(markup).toContain(theme.fontFamily.replaceAll("'", "&#x27;"));
    expect(timeline.captionStyle.fontFamily).toBe(theme.fontFamily);
    expect(timeline.captionStyle.highlightColor).toBe(theme.colors.highlight);
  });

  it("fills missing styles without mutating input, while keeping explicit overrides", () => {
    const input = {
      captionStyle: { textColor: "#123456", fontSize: 40 },
      scenes: [
        {
          id: "s",
          start: 0,
          end: 5,
          background: "#abcdef",
          elements: [
            {
              type: "callout" as const,
              id: "c",
              x: 100,
              y: 200,
              text: "Card",
              accentColor: "#654321",
            },
            { type: "arrow" as const, id: "a", fromX: 0, fromY: 0, toX: 100, toY: 100 },
            {
              type: "arrow" as const,
              id: "b",
              fromX: 0,
              fromY: 0,
              toX: 100,
              toY: 100,
              color: "red",
            },
            { type: "zoom" as const, id: "z", targetX: 100, targetY: 100 },
          ],
        },
        { id: "empty", start: 5, end: 6 },
      ],
    };
    const original = structuredClone(input);
    const timeline = createThemedTimeline(input, THEMES.paper);
    expect(input).toEqual(original);
    expect(timeline.scenes[0]?.background).toBe("#abcdef");
    expect(timeline.scenes[1]?.background).toBe(THEMES.paper.colors.background);
    expect(timeline.scenes[0]?.elements[0]).toMatchObject({
      accentColor: "#654321",
      backgroundColor: THEMES.paper.colors.surface,
      textColor: THEMES.paper.colors.text,
    });
    expect(timeline.scenes[0]?.elements[1]).toMatchObject({ color: THEMES.paper.colors.accent });
    expect(timeline.scenes[0]?.elements[2]).toMatchObject({ color: "red" });
    expect(timeline.scenes[0]?.elements[3]).toMatchObject({ type: "zoom", scale: 1.25 });
    expect(timeline.captionStyle).toMatchObject({
      textColor: "#123456",
      fontSize: 40,
      boxColor: THEMES.paper.colors.surface,
    });
    expect(parseTimeline(timeline)).toEqual(timeline);
  });

  it("accepts custom themes and rejects invalid theme tokens through the timeline schema", () => {
    const custom = { ...THEMES.paper, colors: { ...THEMES.paper.colors, accent: "#ff00ff" } };
    expect(createTemplateShowcase(custom).theme?.colors.accent).toBe("#ff00ff");
    const timeline = createTemplateShowcase();
    const result = validateTimeline({ ...timeline, theme: { ...custom, fontFamily: "" } });
    expect(result.errors.join(" ")).toContain("$.theme.fontFamily");
  });

  it("preserves legacy defaults when no theme or template is supplied", () => {
    const timeline = parseTimeline({
      scenes: [{ id: "old", start: 0, end: 5, background: "black" }],
    });
    expect(timeline.theme).toBeUndefined();
    expect(timeline.scenes[0]?.template).toBeUndefined();
    expect(timeline.captionStyle).toEqual(DEFAULT_CAPTION_STYLE);
  });
});

describe("frame-driven templates", () => {
  const list = ListTemplateSchema.parse({
    type: "list",
    heading: "Steps",
    items: ["One", "Two", "Three"],
    intervalSeconds: 1,
  });
  const renderList = (frame: number) =>
    renderToStaticMarkup(<SceneTemplateRenderer template={list} frame={frame} fps={30} />);

  it("reveals list rows and advances the counter at exact local boundaries, clamping at the total", () => {
    expect(renderList(0)).toContain("1 / 3");
    expect(renderList(29)).toContain("1 / 3");
    expect(renderList(30)).toContain("2 / 3");
    expect(renderList(60)).toContain("3 / 3");
    expect(renderList(300)).toContain("3 / 3");
    expect(renderList(29)).toMatch(/<li[^>]*opacity:0[^>]*><span[^>]*>2\.<\/span>Two/);
    expect(renderList(30)).toMatch(/<li[^>]*opacity:1[^>]*><span[^>]*>2\.<\/span>Two/);
    expect(
      renderToStaticMarkup(<SceneTemplateRenderer template={list} frame={60} fps={60} />),
    ).toContain("2 / 3");
  });

  it("fades in the after panel after its local reveal delay", () => {
    const template = BeforeAfterTemplateSchema.parse({
      type: "before-after",
      heading: "Compare",
      before: { label: "Before", text: "Slow" },
      after: { label: "After", text: "Fast" },
    });
    const render = (frame: number) =>
      renderToStaticMarkup(<SceneTemplateRenderer template={template} frame={frame} fps={30} />);
    expect(render(29)).toMatch(/opacity:0[^>]*><div[^>]*>After/);
    expect(render(36)).toMatch(/opacity:0\.5[^>]*><div[^>]*>After/);
    expect(render(42)).toMatch(/opacity:1[^>]*><div[^>]*>After/);
    expect(render(43)).toMatch(/opacity:1[^>]*><div[^>]*>After/);
  });

  it("restarts the counter using scene-local frames and retains annotation layers", () => {
    const scene = parseTimeline({
      scenes: [
        {
          id: "later",
          start: 5,
          end: 10,
          background: "black",
          template: list,
          elements: [{ type: "callout", id: "c", x: 100, y: 200, text: "Annotation" }],
        },
      ],
    }).scenes[0];
    if (!scene) throw new Error("Missing fixture");
    state.frame = 150;
    expect(renderToStaticMarkup(<SceneRenderer scene={scene} />)).toContain("1 / 3");
    state.frame = 180;
    const markup = renderToStaticMarkup(<SceneRenderer scene={scene} />);
    expect(markup).toContain("2 / 3");
    expect(markup).toContain("Annotation");
  });

  it("switches templates at an exact scene boundary", () => {
    const timeline = createTemplateShowcase();
    state.frame = 149;
    expect(renderToStaticMarkup(<ExplainerShort timeline={timeline} />)).toContain("CHECKLIST");
    state.frame = 150;
    const markup = renderToStaticMarkup(<ExplainerShort timeline={timeline} />);
    expect(markup).toContain("BEFORE / AFTER");
    expect(markup).not.toContain("CHECKLIST");
    expect(markup).toMatch(/opacity:0[^>]*><div[^>]*>AFTER/);
  });
});
