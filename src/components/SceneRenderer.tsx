import type React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { resolveAsset } from "../helpers/resolveAsset.js";
import { framesToSeconds, secondsToFrames } from "../helpers/time.js";
import type { Scene } from "../schema.js";
import { Arrow } from "./Arrow.js";
import { Callout } from "./Callout.js";
import { Mascot } from "./Mascot.js";
import { ZoomTo } from "./ZoomTo.js";

export interface SceneRendererProps {
  scene: Scene;
  className?: string;
  style?: React.CSSProperties;
}

export const SceneRenderer: React.FC<SceneRendererProps> = ({ scene, className, style }) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTimeSec = framesToSeconds(currentFrame, fps);

  // Local frame count since this scene started
  const sceneStartFrame = secondsToFrames(scene.start, fps);
  const localSceneFrame = Math.max(0, currentFrame - sceneStartFrame);

  // Background styling
  const isImageBg =
    scene.background.startsWith("http://") ||
    scene.background.startsWith("https://") ||
    /\.(png|jpg|jpeg|webp|svg)$/i.test(scene.background);

  const bgStyle: React.CSSProperties = isImageBg
    ? {
        backgroundImage: `url("${resolveAsset(scene.background)}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {
        background: scene.background,
      };

  // Check if any active zoom element exists for this scene
  const activeZoom = scene.elements?.find((el) => {
    if (el.type !== "zoom") return false;
    const elStartSec = scene.start + (el.start ?? 0);
    const elEndSec = el.end !== undefined ? scene.start + el.end : scene.end;
    return currentTimeSec >= elStartSec && currentTimeSec < elEndSec;
  });

  const content = (
    <div
      className={className}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        ...bgStyle,
        ...style,
      }}
    >
      {/* Optional Scene Title Badge */}
      {scene.title && (
        <div
          style={{
            position: "absolute",
            top: 140,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(15, 23, 42, 0.75)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            padding: "10px 24px",
            borderRadius: 30,
            color: "#94a3b8",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            zIndex: 15,
            backdropFilter: "blur(10px)",
          }}
        >
          {scene.title}
        </div>
      )}

      {/* Mascot Layer */}
      {scene.mascot && (
        <Mascot
          pose={scene.mascot.pose}
          x={scene.mascot.x}
          y={scene.mascot.y}
          scale={scene.mascot.scale}
          flip={scene.mascot.flip}
          enterFrame={localSceneFrame}
        />
      )}

      {/* Elements Layer */}
      {scene.elements?.map((el) => {
        const elStartSec = scene.start + (el.start ?? 0);
        const elEndSec = el.end !== undefined ? scene.start + el.end : scene.end;

        // Is this element currently active in time?
        if (currentTimeSec < elStartSec || currentTimeSec >= elEndSec) {
          return null;
        }

        const elStartFrame = secondsToFrames(elStartSec, fps);
        const elEnterFrame = Math.max(0, currentFrame - elStartFrame);

        if (el.type === "callout") {
          return (
            <Callout
              key={el.id}
              title={el.title}
              text={el.text}
              icon={el.icon}
              x={el.x}
              y={el.y}
              accentColor={el.accentColor}
              backgroundColor={el.backgroundColor}
              textColor={el.textColor}
              enterFrame={elEnterFrame}
            />
          );
        }

        if (el.type === "arrow") {
          return (
            <Arrow
              key={el.id}
              fromX={el.fromX}
              fromY={el.fromY}
              toX={el.toX}
              toY={el.toY}
              label={el.label}
              color={el.color}
              strokeWidth={el.strokeWidth}
              curvature={el.curvature}
              enterFrame={elEnterFrame}
            />
          );
        }

        return null;
      })}
    </div>
  );

  if (activeZoom && activeZoom.type === "zoom") {
    const zoomStartSec = scene.start + (activeZoom.start ?? 0);
    const zoomStartFrame = secondsToFrames(zoomStartSec, fps);
    return (
      <ZoomTo
        targetX={activeZoom.targetX}
        targetY={activeZoom.targetY}
        scale={activeZoom.scale}
        startFrame={zoomStartFrame}
        durationFrames={activeZoom.durationFrames}
      >
        {content}
      </ZoomTo>
    );
  }

  return content;
};
