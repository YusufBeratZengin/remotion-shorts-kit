import type React from "react";
import { Composition } from "remotion";
import { ExplainerShort } from "./compositions/ExplainerShort";
import { ThermosExplainer, demoTimeline } from "./examples/ThermosExplainer";
import { ExplainerPropsSchema, type Timeline } from "./schema";

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
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* Generic Dynamic Explainer Short with Schema Controls in Studio */}
      <Composition
        id="ExplainerShort"
        component={ExplainerShort}
        schema={ExplainerPropsSchema}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          timeline: demoTimeline,
        }}
      />

      {/* Safe Area Inspection Composition */}
      <Composition
        id="SafeAreaPreview"
        component={ExplainerShort}
        schema={ExplainerPropsSchema}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          timeline: safeAreaDemoTimeline,
        }}
      />
    </>
  );
};
