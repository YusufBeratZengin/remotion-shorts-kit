import { afterEach, describe, expect, it, vi } from "vitest";
import {
  isExternalUrl,
  resolveAsset,
  timelineDurationInFrames,
  toStaticPath,
} from "../src/helpers";

describe("asset path helpers", () => {
  afterEach(() => vi.unstubAllGlobals());
  it("names the missing public file in its error", () => {
    vi.stubGlobal("window", { remotion_staticFiles: [] });
    expect(() => resolveAsset("./images/missing.png")).toThrow(
      "Missing asset: public/images/missing.png",
    );
  });
  it("resolves files present in the public manifest", () => {
    vi.stubGlobal("window", {
      remotion_staticFiles: [{ name: "images/diagram.svg", src: "/static/images/diagram.svg" }],
    });
    expect(resolveAsset("/images/diagram.svg")).toBe("/static/images/diagram.svg");
  });
  it("passes external URLs through without consulting the manifest", () => {
    vi.stubGlobal("window", { remotion_staticFiles: [] });
    expect(resolveAsset("https://example.com/image.png")).toBe("https://example.com/image.png");
  });
  it("preserves staticFile behavior without a browser manifest", () => {
    expect(resolveAsset("image.png")).toBe("/image.png");
    vi.stubGlobal("window", {});
    expect(resolveAsset("image.png")).toBe("/image.png");
  });
  it("detects external URLs", () => {
    expect(isExternalUrl("https://example.com/a.mp3")).toBe(true);
    expect(isExternalUrl("data:image/png;base64,AAAA")).toBe(true);
    expect(isExternalUrl("/narration.mp3")).toBe(false);
    expect(isExternalUrl("narration.mp3")).toBe(false);
  });

  it("strips leading slashes so staticFile() receives a public/-relative path", () => {
    expect(toStaticPath("/narration.mp3")).toBe("narration.mp3");
    expect(toStaticPath("./img/bg.png")).toBe("img/bg.png");
    expect(toStaticPath("audio/x.mp3")).toBe("audio/x.mp3");
  });
});

describe("timelineDurationInFrames", () => {
  it("returns at least one frame for an empty timeline", () => {
    expect(timelineDurationInFrames({ fps: 30, scenes: [] })).toBe(1);
  });
  it("uses the latest scene or caption end", () => {
    expect(timelineDurationInFrames({ fps: 30, scenes: [{ end: 4 }, { end: 20 }] })).toBe(600);
    expect(
      timelineDurationInFrames({ fps: 30, scenes: [{ end: 2 }], captions: [{ end: 2.5 }] }),
    ).toBe(75);
  });
});
