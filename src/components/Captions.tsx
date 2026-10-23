import type React from "react";
import { useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Easing, interpolate } from "remotion";
import {
  type BatchingOptions,
  findActiveCaptionBatch,
  groupWordsIntoBatches,
} from "../helpers/captions.js";
import { framesToSeconds } from "../helpers/time.js";
import { type CaptionStyle, DEFAULT_CAPTION_STYLE, type Word } from "../schema.js";

export interface CaptionsProps {
  captions: Word[];
  style?: Partial<CaptionStyle>;
  batchingOptions?: BatchingOptions;
  className?: string;
}

const DEFAULT_STYLE: CaptionStyle = { ...DEFAULT_CAPTION_STYLE };

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

  const maxCharsPerLine = batchingOptions?.maxCharsPerLine ?? mergedStyle.maxCharsPerLine;
  const maxLines = batchingOptions?.maxLines ?? mergedStyle.maxLines;
  const pauseThresholdSec = batchingOptions?.pauseThresholdSec;
  const lingerDurationSec = batchingOptions?.lingerDurationSec;
  const batches = useMemo(() => {
    return groupWordsIntoBatches(captions, {
      maxCharsPerLine,
      maxLines,
      ...(pauseThresholdSec === undefined ? {} : { pauseThresholdSec }),
      ...(lingerDurationSec === undefined ? {} : { lingerDurationSec }),
    });
  }, [captions, maxCharsPerLine, maxLines, pauseThresholdSec, lingerDurationSec]);

  const activeBatch = useMemo(
    () => findActiveCaptionBatch(batches, currentTimeSec),
    [batches, currentTimeSec],
  );
  const words = activeBatch?.lines;
  const lineLayout = useMemo(
    () =>
      words?.map((line, lineIndex) => ({
        key: `line-${lineIndex}-${line[0]?.start ?? 0}`,
        words: line.map((word, wordIndex) => ({ word, key: `${wordIndex}-${word.start}` })),
      })) ?? [],
    [words],
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
        // Keep captions inside the safe box: 60px left margin, 180px right (UI rail).
        padding: "0 180px 0 60px",
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
          maxWidth: 840,
          border: "1px solid rgba(255, 255, 255, 0.12)",
        }}
      >
        {lineLayout.map((line) => {
          return (
            <div
              key={line.key}
              style={{
                display: "flex",
                flexWrap: "nowrap",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px 14px",
              }}
            >
              {line.words.map(({ word, key }) => {
                // End is exclusive so that back-to-back words never highlight together.
                const isActive = currentTimeSec >= word.start && currentTimeSec < word.end;
                const isPast = currentTimeSec >= word.end;

                let color = mergedStyle.textColor;
                let scale = 1;
                let fontWeight: React.CSSProperties["fontWeight"] = 700;
                let background = "transparent";
                let textShadow = "0 2px 8px rgba(0, 0, 0, 0.7)";

                if (isActive) {
                  color = mergedStyle.highlightColor;
                  // Frame-driven pop (CSS transitions are not deterministic in renders).
                  scale = interpolate(currentTimeSec - word.start, [0, 0.08], [1, 1.08], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.out(Easing.quad),
                  });
                  fontWeight = 900;
                  textShadow = `0 0 16px ${mergedStyle.highlightColor}66, 0 2px 10px rgba(0, 0, 0, 0.9)`;
                  background = `${mergedStyle.highlightColor}26`;
                } else if (!isPast) {
                  color = "rgba(255, 255, 255, 0.65)";
                }

                return (
                  <span
                    key={key}
                    style={{
                      fontFamily: mergedStyle.fontFamily,
                      fontSize: mergedStyle.fontSize,
                      fontWeight,
                      color,
                      textTransform: mergedStyle.uppercase ? "uppercase" : "none",
                      transform: `scale(${scale})`,
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
