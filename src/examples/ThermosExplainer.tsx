import type React from "react";
import demoTimelineJson from "../../examples/demo-timeline.json";
import { ExplainerShort } from "../compositions/ExplainerShort";
import { type Timeline, validateTimeline } from "../schema";

const demoTimeline: Timeline = validateTimeline(demoTimelineJson);

export const ThermosExplainer: React.FC = () => {
  return <ExplainerShort timeline={demoTimeline} />;
};

export { demoTimeline };
