import type { Scene } from "../schema";
import { clamp, framesToSeconds, secondsToFrames } from "./time";

/**
 * Finds the scene active at the given timestamp in seconds.
 * If timestamp matches the exact end boundary of the last scene, returns the last scene.
 */
export function getActiveScene(scenes: Scene[], currentTimeSec: number): Scene | undefined {
  if (!scenes || scenes.length === 0) return undefined;

  for (const scene of scenes) {
    if (currentTimeSec >= scene.start && currentTimeSec < scene.end) {
      return scene;
    }
  }

  // Handle exact end of timeline
  const lastScene = scenes[scenes.length - 1];
  if (lastScene && Math.abs(currentTimeSec - lastScene.end) < 0.001) {
    return lastScene;
  }

  return undefined;
}

/**
 * Finds the active scene at a given frame number and fps.
 */
export function getActiveSceneAtFrame(
  scenes: Scene[],
  frame: number,
  fps: number,
): Scene | undefined {
  const currentTimeSec = framesToSeconds(frame, fps);
  return getActiveScene(scenes, currentTimeSec);
}

/**
 * Calculates the local progress (0 to 1) within the given scene.
 */
export function getSceneProgress(scene: Scene, currentTimeSec: number): number {
  const duration = scene.end - scene.start;
  if (duration <= 0) return 1;
  const elapsed = currentTimeSec - scene.start;
  return clamp(elapsed / duration, 0, 1);
}

/**
 * Calculates the total duration in frames for a given scene.
 */
export function getSceneDurationFrames(scene: Scene, fps: number): number {
  return secondsToFrames(scene.end - scene.start, fps);
}

/**
 * Calculates the local frame offset within a scene from the global frame.
 */
export function getSceneLocalFrame(scene: Scene, globalFrame: number, fps: number): number {
  const sceneStartFrame = secondsToFrames(scene.start, fps);
  return Math.max(0, globalFrame - sceneStartFrame);
}

/**
 * Calculates the local time in seconds within a scene.
 */
export function getSceneLocalTime(scene: Scene, currentTimeSec: number): number {
  return Math.max(0, currentTimeSec - scene.start);
}
