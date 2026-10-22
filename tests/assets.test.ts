import { describe, expect, it } from "vitest";
import { isExternalUrl, toStaticPath } from "../src/helpers/assets";
import { timelineDurationInFrames } from "../src/helpers/scene";

describe("asset path helpers", () => {
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
  it("uses the latest scene or caption end", () => {
    expect(timelineDurationInFrames({ fps: 30, scenes: [{ end: 4 }, { end: 20 }] })).toBe(600);
    expect(
      timelineDurationInFrames({ fps: 30, scenes: [{ end: 2 }], captions: [{ end: 2.5 }] }),
    ).toBe(75);
  });
});
