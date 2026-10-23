import type React from "react";
import { useMemo } from "react";
import { Audio, useCurrentFrame, useVideoConfig } from "remotion";
import { Captions, ProgressBar, SafeAreaOverlay, SceneRenderer } from "../components/index.js";
import { resolveAsset } from "../helpers/resolveAsset.js";
import { getActiveScene } from "../helpers/scene.js";
import { framesToSeconds } from "../helpers/time.js";
import { DEFAULT_CAPTION_STYLE, type Timeline, parseTimeline } from "../schema.js";

export type ExplainerShortProps = {
  timeline: Timeline;
  [key: string]: unknown;
};

export const ExplainerShort: React.FC<ExplainerShortProps> = ({ timeline: rawTimeline }) => {
  const currentFrame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const currentTimeSec = framesToSeconds(currentFrame, fps);

  const timeline = useMemo(() => {
    return parseTimeline(rawTimeline);
  }, [rawTimeline]);

  const activeScene = useMemo(() => {
    return getActiveScene(timeline.scenes, currentTimeSec);
  }, [timeline.scenes, currentTimeSec]);

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        backgroundColor: "#000000",
        overflow: "hidden",
        fontFamily: DEFAULT_CAPTION_STYLE.fontFamily,
      }}
    >
      {/* Active Scene Rendering */}
      {activeScene ? (
        <SceneRenderer scene={activeScene} />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#020617",
          }}
        />
      )}

      {/* Captions Overlay */}
      {timeline.captions && timeline.captions.length > 0 && (
        <Captions captions={timeline.captions} style={timeline.captionStyle} />
      )}

      {/* Optional Progress Bar */}
      {timeline.showProgressBar && <ProgressBar />}

      {/* Safe Area Guides (only rendered if showSafeArea is true) */}
      <SafeAreaOverlay visible={timeline.showSafeArea} />

      {/* Optional Audio Track */}
      {timeline.audio && (
        <Audio
          src={resolveAsset(timeline.audio.src)}
          volume={timeline.audio.volume}
          trimBefore={timeline.audio.startOffset ? Math.round(timeline.audio.startOffset * fps) : 0}
        />
      )}
    </div>
  );
};
