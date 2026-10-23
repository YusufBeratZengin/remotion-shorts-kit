import type React from "react";
import timelineJson from "../../examples/second-timeline.json";
import { ExplainerShort } from "../compositions/ExplainerShort.js";
import { parseTimeline } from "../schema.js";

export const siphonTimeline = parseTimeline(timelineJson);
export const SiphonExplainer: React.FC = () => <ExplainerShort timeline={siphonTimeline} />;
