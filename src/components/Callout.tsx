import type React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { CalloutElement } from "../schema";

export interface CalloutProps extends Partial<Omit<CalloutElement, "type">> {
  text: string;
  x: number;
  y: number;
  enterFrame?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const Callout: React.FC<CalloutProps> = ({
  title,
  text,
  icon,
  x,
  y,
  accentColor = "#38bdf8",
  backgroundColor = "rgba(15, 23, 42, 0.90)",
  textColor = "#f8fafc",
  enterFrame,
  className,
  style,
}) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const animFrame = enterFrame !== undefined ? enterFrame : currentFrame;

  const scale = spring({
    frame: animFrame,
    fps,
    config: {
      damping: 12,
      mass: 0.5,
      stiffness: 170,
    },
  });

  const opacity = Math.min(1, Math.max(0, animFrame / 6));

  if (scale <= 0.01) {
    return null;
  }

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${scale})`,
        transformOrigin: "center center",
        opacity,
        backgroundColor,
        color: textColor,
        padding: "24px 32px",
        borderRadius: 24,
        borderLeft: `8px solid ${accentColor}`,
        boxShadow: `0 20px 40px rgba(0, 0, 0, 0.5), 0 0 25px ${accentColor}33`,
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        maxWidth: 720,
        minWidth: 320,
        zIndex: 30,
        pointerEvents: "none",
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 18 }}>
        {icon && (
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              backgroundColor: `${accentColor}26`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              color: accentColor,
              fontWeight: 800,
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {title && (
            <div
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: accentColor,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              {title}
            </div>
          )}
          <div
            style={{
              fontSize: 34,
              fontWeight: 600,
              lineHeight: 1.35,
              color: textColor,
            }}
          >
            {text}
          </div>
        </div>
      </div>
    </div>
  );
};
