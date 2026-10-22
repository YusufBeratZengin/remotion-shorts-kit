import type React from "react";
import { useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import {
  type BatchingOptions,
  findActiveCaptionBatch,
  groupWordsIntoBatches,
} from "../helpers/captions";
import { framesToSeconds } from "../helpers/time";
import type { CaptionStyle, Word } from "../schema";

export interface CaptionsProps {
  captions: Word[];
  style?: Partial<CaptionStyle>;
  batchingOptions?: BatchingOptions;
  className?: string;
}

const DEFAULT_STYLE: CaptionStyle = {
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  fontSize: 54,
  textColor: "#ffffff",
  highlightColor: "#facc15",
  boxColor: "rgba(15, 23, 42, 0.85)",
  boxPadding: 20,
  borderRadius: 20,
  maxCharsPerLine: 24,
  maxLines: 2,
  positionBottom: 420,
  uppercase: true,
};

export const Captions: React.FC<CaptionsProps> = ({
  captions,
  style: userStyle,
  batchingOptions,
  className,
}) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTimeSec = framesToSeconds(currentFrame, fps);

  const mergedStyle: CaptionStyle = useMemo(
    () => ({
      ...DEFAULT_STYLE,
      ...userStyle,
    }),
    [userStyle],
  );

  const batches = useMemo(() => {
    return groupWordsIntoBatches(captions, {
      maxCharsPerLine: mergedStyle.maxCharsPerLine,
      maxLines: mergedStyle.maxLines,
      ...batchingOptions,
    });
  }, [captions, mergedStyle.maxCharsPerLine, mergedStyle.maxLines, batchingOptions]);

  const activeBatch = useMemo(
    () => findActiveCaptionBatch(batches, currentTimeSec),
    [batches, currentTimeSec],
  );

  if (!activeBatch) {
    return null;
  }

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: mergedStyle.positionBottom,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 60px",
        pointerEvents: "none",
        zIndex: 50,
      }}
    >
      <div
        style={{
          backgroundColor: mergedStyle.boxColor,
          padding: `${mergedStyle.boxPadding}px ${mergedStyle.boxPadding * 1.5}px`,
          borderRadius: mergedStyle.borderRadius,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          maxWidth: 960,
          border: "1px solid rgba(255, 255, 255, 0.12)",
        }}
      >
        {activeBatch.lines.map((line, lineIndex) => {
          const lineKey = `line-${lineIndex}-${line[0]?.start ?? 0}`;
          return (
            <div
              key={lineKey}
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px 14px",
              }}
            >
              {line.map((word) => {
                const isActive = currentTimeSec >= word.start && currentTimeSec <= word.end;
                const isPast = currentTimeSec > word.end;

                let color = mergedStyle.textColor;
                let scale = 1;
                let fontWeight: React.CSSProperties["fontWeight"] = 700;
                let background = "transparent";
                let textShadow = "0 2px 8px rgba(0, 0, 0, 0.7)";

                if (isActive) {
                  color = mergedStyle.highlightColor;
                  scale = 1.08;
                  fontWeight = 900;
                  textShadow = `0 0 16px ${mergedStyle.highlightColor}66, 0 2px 10px rgba(0, 0, 0, 0.9)`;
                  background = "rgba(250, 204, 21, 0.15)";
                } else if (!isPast) {
                  color = "rgba(255, 255, 255, 0.65)";
                }

                return (
                  <span
                    key={`${word.text}-${word.start}`}
                    style={{
                      fontFamily: mergedStyle.fontFamily,
                      fontSize: mergedStyle.fontSize,
                      fontWeight,
                      color,
                      textTransform: mergedStyle.uppercase ? "uppercase" : "none",
                      transform: `scale(${scale})`,
                      transition: "transform 0.08s ease-out, color 0.08s ease-out",
                      display: "inline-block",
                      padding: "2px 8px",
                      borderRadius: 8,
                      background,
                      textShadow,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {word.text}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
