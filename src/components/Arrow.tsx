import type React from "react";
import { useMemo } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { ArrowElement } from "../schema";

export interface ArrowProps extends Partial<Omit<ArrowElement, "type">> {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  enterFrame?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const Arrow: React.FC<ArrowProps> = ({
  fromX,
  fromY,
  toX,
  toY,
  label,
  color = "#f59e0b",
  strokeWidth = 8,
  curvature = 0,
  enterFrame,
  className,
  style,
}) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const animFrame = enterFrame !== undefined ? enterFrame : currentFrame;

  // Spring entrance progress (0 to 1)
  const drawProgress = spring({
    frame: animFrame,
    fps,
    config: {
      damping: 15,
      mass: 0.6,
      stiffness: 120,
    },
  });

  // Pulse pointing bounce along arrow axis once drawn
  const pulseFactor = animFrame > 15 ? Math.sin(((animFrame - 15) / fps) * Math.PI * 4) * 8 : 0;

  const dx = toX - fromX;
  const dy = toY - fromY;
  const distance = Math.hypot(dx, dy);

  // Normalized direction
  const nx = distance > 0 ? dx / distance : 0;
  const ny = distance > 0 ? dy / distance : 0;

  // Pulsed target point
  const currentToX = toX + nx * pulseFactor;
  const currentToY = toY + ny * pulseFactor;

  // Control point for quadratic curve
  const midX = (fromX + currentToX) / 2 - ny * curvature;
  const midY = (fromY + currentToY) / 2 + nx * curvature;

  // Arrowhead angle at tip
  const tipAngle = Math.atan2(currentToY - midY, currentToX - midX);
  const headLength = strokeWidth * 3.5;
  const headAngle = Math.PI / 6; // 30 degrees

  const headLeftX = currentToX - headLength * Math.cos(tipAngle - headAngle);
  const headLeftY = currentToY - headLength * Math.sin(tipAngle - headAngle);
  const headRightX = currentToX - headLength * Math.cos(tipAngle + headAngle);
  const headRightY = currentToY - headLength * Math.sin(tipAngle + headAngle);

  const pathD =
    curvature === 0
      ? `M ${fromX} ${fromY} L ${currentToX} ${currentToY}`
      : `M ${fromX} ${fromY} Q ${midX} ${midY} ${currentToX} ${currentToY}`;

  // Approximate path length for stroke dasharray
  const approxLength = Math.max(distance, 10);
  const strokeDashoffset = interpolate(drawProgress, [0, 1], [approxLength, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const arrowHeadScale = interpolate(drawProgress, [0.7, 1], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Arrowhead scale
  // Label position
  const labelX = (fromX + currentToX) / 2;
  const labelY = (fromY + currentToY) / 2 - 24;

  const arrowMarkerId = useMemo(
    () => `arrow-glow-${Math.round(fromX)}-${Math.round(toX)}`,
    [fromX, toX],
  );

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 25,
        ...style,
      }}
    >
      <svg
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
          overflow: "visible",
        }}
        viewBox="0 0 1080 1920"
        role="img"
        aria-label="Directional arrow"
      >
        <defs>
          <filter id={arrowMarkerId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="rgba(0,0,0,0.5)" />
          </filter>
        </defs>

        {/* Shaft */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={approxLength}
          strokeDashoffset={strokeDashoffset}
          filter={`url(#${arrowMarkerId})`}
        />

        {/* Arrow Head */}
        {arrowHeadScale > 0.05 && (
          <polygon
            points={`${currentToX},${currentToY} ${headLeftX},${headLeftY} ${headRightX},${headRightY}`}
            fill={color}
            transform={`scale(${arrowHeadScale})`}
            style={{
              transformOrigin: `${currentToX}px ${currentToY}px`,
            }}
            filter={`url(#${arrowMarkerId})`}
          />
        )}
      </svg>

      {/* Optional Label */}
      {label && drawProgress > 0.6 && (
        <div
          style={{
            position: "absolute",
            left: labelX,
            top: labelY,
            transform: "translate(-50%, -50%)",
            backgroundColor: "rgba(15, 23, 42, 0.85)",
            color: "#f8fafc",
            border: `2px solid ${color}`,
            borderRadius: 14,
            padding: "8px 16px",
            fontSize: 24,
            fontWeight: 700,
            whiteSpace: "nowrap",
            boxShadow: "0 8px 16px rgba(0,0,0,0.4)",
            backdropFilter: "blur(8px)",
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};
