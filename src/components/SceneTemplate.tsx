import type React from "react";
import type { SceneTemplate as Template } from "../templates.js";
import { THEMES, type Theme } from "../themes.js";

export interface SceneTemplateProps {
  template: Template;
  /** Scene-local frame, so animations restart at every scene boundary. */
  frame: number;
  fps: number;
  theme?: Theme;
}

/** Pure frame-driven layout; also usable in static previews without Remotion hooks. */
export const SceneTemplateRenderer: React.FC<SceneTemplateProps> = ({
  template,
  frame,
  fps,
  theme = THEMES.midnight,
}) => {
  const { colors, fontFamily } = theme;
  const localFrame = Math.max(0, frame);
  const intervalFrames =
    template.type === "list" ? Math.max(1, Math.round(template.intervalSeconds * fps)) : 1;
  const revealProgress =
    template.type === "before-after"
      ? Math.max(
          0,
          Math.min(
            1,
            (localFrame - Math.round(template.revealSeconds * fps)) /
              Math.max(1, Math.round(0.4 * fps)),
          ),
        )
      : 0;
  const panel: React.CSSProperties = {
    background: colors.surface,
    borderRadius: 24,
    padding: "28px 32px",
    overflowWrap: "anywhere",
  };
  const visibleItems =
    template.type === "list"
      ? Math.min(template.items.length, Math.floor(localFrame / intervalFrames) + 1)
      : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: "6%",
        right: "17%",
        top: "16%",
        height: "53%",
        fontFamily,
        color: colors.text,
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      <div
        style={{
          color: colors.accent,
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: "0.12em",
        }}
      >
        {template.type === "list" ? "CHECKLIST" : "BEFORE / AFTER"}
      </div>
      <h1 style={{ fontSize: 54, lineHeight: 1.12, margin: "0 0 12px", overflowWrap: "anywhere" }}>
        {template.heading}
      </h1>
      {template.type === "list" ? (
        <>
          <div style={{ fontSize: 68, fontWeight: 800, color: colors.highlight }}>
            {visibleItems} / {template.items.length}
          </div>
          <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 18 }}>
            {template.items.map((item, index) => {
              const elapsed = localFrame - index * intervalFrames;
              const progress = Math.max(
                0,
                Math.min(1, elapsed / Math.max(1, Math.round(0.25 * fps))),
              );
              return (
                <li
                  // Items may repeat; their ordered positions are stable within a scene.
                  key={`${index}-${item}`}
                  style={{
                    ...panel,
                    display: "flex",
                    alignItems: "center",
                    gap: 22,
                    opacity: elapsed < 0 ? 0 : 1,
                    transform: `translateY(${(1 - progress) * 20}px)`,
                    fontSize: 30,
                    lineHeight: 1.25,
                  }}
                >
                  <span style={{ color: colors.accent, fontWeight: 800 }}>{index + 1}.</span>
                  {item}
                </li>
              );
            })}
          </ol>
        </>
      ) : (
        <>
          <div style={{ ...panel, borderLeft: `6px solid ${colors.muted}` }}>
            <div style={{ color: colors.muted, fontSize: 22, fontWeight: 700, marginBottom: 16 }}>
              {template.before.label}
            </div>
            <div style={{ fontSize: 34, lineHeight: 1.3 }}>{template.before.text}</div>
          </div>
          <div
            style={{
              ...panel,
              borderLeft: `6px solid ${colors.accent}`,
              opacity: revealProgress,
              transform: `translateY(${(1 - revealProgress) * 24}px)`,
            }}
          >
            <div style={{ color: colors.accent, fontSize: 22, fontWeight: 700, marginBottom: 16 }}>
              {template.after.label}
            </div>
            <div style={{ fontSize: 34, lineHeight: 1.3 }}>{template.after.text}</div>
          </div>
        </>
      )}
    </div>
  );
};
