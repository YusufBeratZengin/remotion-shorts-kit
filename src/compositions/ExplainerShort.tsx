import type React from "react";
import { useMemo } from "react";
import { Audio, useCurrentFrame, useVideoConfig } from "remotion";
import { Captions, ProgressBar, SafeAreaOverlay, SceneRenderer } from "../components";
import { getActiveScene } from "../helpers/scene";
import { framesToSeconds } from "../helpers/time";
import { type Timeline, validateTimeline } from "../schema";

export type ExplainerShortProps = {
  timeline: Timeline;
  [key: string]: unknown;
};

export const ExplainerShort: React.FC<ExplainerShortProps> = ({ timeline: rawTimeline }) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTimeSec = framesToSeconds(currentFrame, fps);

  const timeline = useMemo(() => {
    return validateTimeline(rawTimeline);
  }, [rawTimeline]);

  const activeScene = useMemo(() => {
    return getActiveScene(timeline.scenes, currentTimeSec);
  }, [timeline.scenes, currentTimeSec]);

  return (
    <div
      style={{
        position: "relative",
        width: 1080,
        height: 1920,
        backgroundColor: "#000000",
        overflow: "hidden",
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
          src={timeline.audio.src}
          volume={timeline.audio.volume}
          startFrom={timeline.audio.startOffset ? Math.round(timeline.audio.startOffset * fps) : 0}
        />
      )}
    </div>
  );
};
