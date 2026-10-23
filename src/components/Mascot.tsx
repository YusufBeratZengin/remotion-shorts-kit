import type React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { MascotPose } from "../schema.js";
import { POSE_COMPONENTS } from "./mascot/MascotSvgs.js";

export interface MascotProps {
  pose: MascotPose;
  x: number;
  y: number;
  scale?: number;
  flip?: boolean;
  /**
   * Local scene frame or global frame offset to trigger entrance squash/bounce.
   * Defaults to useCurrentFrame().
   */
  enterFrame?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const Mascot: React.FC<MascotProps> = ({
  pose,
  x,
  y,
  scale = 1,
  flip = false,
  enterFrame,
  className,
  style,
}) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Local frame since this pose or scene began
  const animFrame = enterFrame !== undefined ? enterFrame : currentFrame;

  // Spring entrance pop & bounce
  const entranceSpring = spring({
    frame: animFrame,
    fps,
    config: {
      damping: 11,
      mass: 0.5,
      stiffness: 160,
    },
  });

  // Squash & stretch curve during entrance / pose change
  const squashX = interpolate(animFrame, [0, 5, 12, 22], [1.25, 1.15, 0.95, 1.0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const squashY = interpolate(animFrame, [0, 5, 12, 22], [0.75, 0.85, 1.05, 1.0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Subtle living breathing oscillation
  const breatheY = Math.sin((currentFrame / fps) * Math.PI * 2) * 5;

  const PoseComponent = POSE_COMPONENTS[pose] ?? POSE_COMPONENTS.idle;

  // Final transforms: position, flip, scale, squash, breathing
  const finalScaleX = scale * (flip ? -1 : 1) * squashX * entranceSpring;
  const finalScaleY = scale * squashY * entranceSpring;

  const width = 240;
  const height = 320;

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        left: x - width / 2,
        top: y - height / 2 + breatheY,
        width,
        height,
        transformOrigin: "50% 100%",
        transform: `scale(${finalScaleX}, ${finalScaleY})`,
        pointerEvents: "none",
        zIndex: 20,
        ...style,
      }}
    >
      <PoseComponent />
    </div>
  );
};
