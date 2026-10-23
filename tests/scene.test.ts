import { describe, expect, it } from "vitest";
import {
  getActiveScene,
  getActiveSceneAtFrame,
  getSceneDurationFrames,
  getSceneLocalFrame,
  getSceneLocalTime,
  getSceneProgress,
} from "../src/helpers/scene";
import type { Scene } from "../src/schema";

describe("scene helpers", () => {
  const sampleScenes: Scene[] = [
    {
      id: "intro",
      start: 0,
      end: 4,
      background: "#0f172a",
      elements: [],
    },
    {
      id: "mechanism",
      start: 4,
      end: 12,
      background: "#1e1b4b",
      elements: [],
    },
    {
      id: "outro",
      start: 12,
      end: 15,
      background: "#042f2e",
      elements: [],
    },
  ];

  it("returns undefined for empty scene list", () => {
    expect(getActiveScene([], 2)).toBeUndefined();
  });

  it("finds the active scene by seconds", () => {
    expect(getActiveScene(sampleScenes, 0)?.id).toBe("intro");
    expect(getActiveScene(sampleScenes, 2)?.id).toBe("intro");
    expect(getActiveScene(sampleScenes, 4)?.id).toBe("mechanism");
    expect(getActiveScene(sampleScenes, 11.9)?.id).toBe("mechanism");
    expect(getActiveScene(sampleScenes, 12)?.id).toBe("outro");
    expect(getActiveScene(sampleScenes, 15)?.id).toBe("outro"); // timeline end boundary
    expect(getActiveScene(sampleScenes, 20)).toBeUndefined();
  });

  it("finds the active scene by frame number", () => {
    expect(getActiveSceneAtFrame(sampleScenes, 0, 30)?.id).toBe("intro");
    expect(getActiveSceneAtFrame(sampleScenes, 120, 30)?.id).toBe("mechanism"); // 120 frames / 30 = 4s
    expect(getActiveSceneAtFrame(sampleScenes, 360, 30)?.id).toBe("outro"); // 360 / 30 = 12s
  });

  it("calculates scene progress properly from 0 to 1", () => {
    const scene = sampleScenes[0];
    if (!scene) throw new Error("Scene missing");
    expect(getSceneProgress(scene, 0)).toBe(0);
    expect(getSceneProgress(scene, 2)).toBe(0.5);
    expect(getSceneProgress(scene, 4)).toBe(1);
    expect(getSceneProgress(scene, 10)).toBe(1); // clamped
    expect(getSceneProgress({ ...scene, end: scene.start }, 0)).toBe(1);
  });

  it("calculates scene duration in frames", () => {
    const s0 = sampleScenes[0];
    const s1 = sampleScenes[1];
    if (!s0 || !s1) throw new Error("Scenes missing");
    expect(getSceneDurationFrames(s0, 30)).toBe(120);
    expect(getSceneDurationFrames(s1, 30)).toBe(240);
  });

  it("calculates local frame offset", () => {
    const scene = sampleScenes[1]; // starts at 4s = frame 120
    if (!scene) throw new Error("Scene missing");
    expect(getSceneLocalFrame(scene, 120, 30)).toBe(0);
    expect(getSceneLocalFrame(scene, 150, 30)).toBe(30);
    expect(getSceneLocalFrame(scene, 100, 30)).toBe(0); // before scene
  });

  it("calculates local time offset", () => {
    const scene = sampleScenes[1]; // starts at 4s
    if (!scene) throw new Error("Scene missing");
    expect(getSceneLocalTime(scene, 4)).toBe(0);
    expect(getSceneLocalTime(scene, 6.5)).toBe(2.5);
    expect(getSceneLocalTime(scene, 2)).toBe(0); // before scene
  });
});
