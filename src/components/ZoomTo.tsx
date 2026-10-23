import type React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { ZoomElement } from "../schema.js";

export interface ZoomToProps extends Partial<Omit<ZoomElement, "type">> {
  targetX: number;
  targetY: number;
  scale?: number;
  startFrame?: number;
  durationFrames?: number;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const ZoomTo: React.FC<ZoomToProps> = ({
  targetX,
  targetY,
  scale = 1.3,
  startFrame = 0,
  durationFrames = 30,
  children,
  className,
  style,
}) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relFrame = Math.max(0, currentFrame - startFrame);

  const zoomProgress = spring({
    frame: relFrame,
    fps,
    durationInFrames: durationFrames,
    config: {
      damping: 16,
      mass: 0.8,
      stiffness: 100,
    },
  });

  const currentScale = interpolate(zoomProgress, [0, 1], [1, scale], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <div
      className={className}
      style={{
        width: "100%",
        height: "100%",
        transformOrigin: `${targetX}px ${targetY}px`,
        transform: `scale(${currentScale})`,
        willChange: "transform",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
