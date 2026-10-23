import type React from "react";
import { type CalculateMetadataFunction, Composition } from "remotion";
import { ExplainerShort, type ExplainerShortProps } from "./compositions/ExplainerShort.js";
import { SiphonExplainer, siphonTimeline } from "./examples/SiphonExplainer.js";
import { ThermosExplainer, demoTimeline } from "./examples/ThermosExplainer.js";
import { timelineDurationInFrames } from "./helpers/scene.js";
import { ExplainerPropsSchema, type Timeline } from "./schema.js";

/**
 * Derives fps, size and duration from the timeline itself, so editing the JSON
 * (or the Studio props) never leaves the composition with a stale length.
 */
const calculateTimelineMetadata: CalculateMetadataFunction<ExplainerShortProps> = ({ props }) => {
  const { timeline } = props;
  return {
    fps: timeline.fps,
    width: timeline.width,
    height: timeline.height,
    durationInFrames: timelineDurationInFrames(timeline),
  };
};

const safeAreaDemoTimeline: Timeline = {
  ...demoTimeline,
  showSafeArea: true,
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Primary Demo Composition: How a Thermos Works (20 seconds) */}
      <Composition
        id="ThermosExplainer"
        component={ThermosExplainer}
        durationInFrames={timelineDurationInFrames(demoTimeline)}
        fps={demoTimeline.fps}
        width={demoTimeline.width}
        height={demoTimeline.height}
      />

      <Composition
        id="SiphonExplainer"
        component={SiphonExplainer}
        durationInFrames={timelineDurationInFrames(siphonTimeline)}
        fps={siphonTimeline.fps}
        width={siphonTimeline.width}
        height={siphonTimeline.height}
      />

      {/* Generic Dynamic Explainer Short with Schema Controls in Studio */}
      <Composition
        id="ExplainerShort"
        component={ExplainerShort}
        schema={ExplainerPropsSchema}
        calculateMetadata={calculateTimelineMetadata}
        durationInFrames={timelineDurationInFrames(demoTimeline)}
        fps={demoTimeline.fps}
        width={demoTimeline.width}
        height={demoTimeline.height}
        defaultProps={{
          timeline: demoTimeline,
        }}
      />

      {/* Safe Area Inspection Composition */}
      <Composition
        id="SafeAreaPreview"
        component={ExplainerShort}
        schema={ExplainerPropsSchema}
        calculateMetadata={calculateTimelineMetadata}
        durationInFrames={timelineDurationInFrames(demoTimeline)}
        fps={demoTimeline.fps}
        width={demoTimeline.width}
        height={demoTimeline.height}
        defaultProps={{
          timeline: safeAreaDemoTimeline,
        }}
      />
    </>
  );
};
