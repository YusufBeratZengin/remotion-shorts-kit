import type React from "react";
import demoTimelineJson from "../../examples/demo-timeline.json";
import { ExplainerShort } from "../compositions/ExplainerShort.js";
import { type Timeline, parseTimeline } from "../schema.js";

const demoTimeline: Timeline = parseTimeline(demoTimelineJson);

export const ThermosExplainer: React.FC = () => {
  return <ExplainerShort timeline={demoTimeline} />;
};

export { demoTimeline };
