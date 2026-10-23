import type React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { clamp } from "../helpers/time.js";

export interface ProgressBarProps {
  position?: "top" | "bottom";
  height?: number;
  color?: string;
  backgroundColor?: string;
  borderRadius?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  position = "bottom",
  height = 8,
  color = "#38bdf8",
  backgroundColor = "rgba(255, 255, 255, 0.18)",
  borderRadius = 4,
  className,
  style,
}) => {
  const currentFrame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = clamp(currentFrame / Math.max(1, durationInFrames - 1), 0, 1);

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        [position]: 0,
        height,
        backgroundColor,
        zIndex: 90,
        pointerEvents: "none",
        ...style,
      }}
    >
      <div
        style={{
          width: `${progress * 100}%`,
          height: "100%",
          backgroundColor: color,
          borderRadius,
          boxShadow: `0 0 10px ${color}99`,
        }}
      />
    </div>
  );
};
