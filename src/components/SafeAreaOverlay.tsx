import type React from "react";
import { getRemotionEnvironment } from "remotion";
import type { SafeAreaPlatform } from "../schema";

export interface SafeAreaOverlayProps {
  visible?: boolean;
  /**
   * By default the overlay is hidden in final renders (`remotion render`) and only
   * shows in the Studio / Player. Set to true to burn it into an exported frame.
   */
  showInRender?: boolean;
  platform?: SafeAreaPlatform;
  opacity?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const SafeAreaOverlay: React.FC<SafeAreaOverlayProps> = ({
  visible = false,
  showInRender = false,
  platform = "all",
  opacity = 0.85,
  className,
  style,
}) => {
  if (!visible || (!showInRender && getRemotionEnvironment().isRendering)) {
    return null;
  }

  // Common bounds for 1080x1920
  const topCutoff = 200;
  const bottomCutoff = 480;
  const rightRailWidth = 160;
  const leftMargin = 60;

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 1080,
        height: 1920,
        pointerEvents: "none",
        zIndex: 9999,
        opacity,
        fontFamily: "monospace",
        ...style,
      }}
    >
      {/* Top Header UI Zone */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: topCutoff,
          backgroundColor: "rgba(239, 68, 68, 0.22)",
          borderBottom: "2px dashed #ef4444",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fecaca",
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: "0.05em",
        }}
      >
        TOP UI DANGER ZONE (SEARCH, AUDIO, TABS) - {topCutoff}px
      </div>

      {/* Right Sidebar Action Icons Zone */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: topCutoff,
          bottom: bottomCutoff,
          width: rightRailWidth,
          backgroundColor: "rgba(249, 115, 22, 0.25)",
          borderLeft: "2px dashed #f97316",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          padding: 10,
          color: "#fed7aa",
          fontSize: 18,
          fontWeight: 700,
          textAlign: "center",
        }}
      >
        <div>RIGHT UI RAIL</div>
        <div>(LIKE / COMMENT / SHARE / AUDIO)</div>
        <div>{rightRailWidth}px</div>
      </div>

      {/* Bottom Subtitles & Channel UI Zone */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: bottomCutoff,
          backgroundColor: "rgba(239, 68, 68, 0.22)",
          borderTop: "2px dashed #ef4444",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          color: "#fecaca",
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: "0.05em",
        }}
      >
        <div>BOTTOM UI DANGER ZONE (TITLE, CREATOR, SOUND, NAV) - {bottomCutoff}px</div>
        <div style={{ fontSize: 16, color: "#fca5a5" }}>Platform: {platform.toUpperCase()}</div>
      </div>

      {/* Safe Content Zone Box */}
      <div
        style={{
          position: "absolute",
          left: leftMargin,
          top: topCutoff,
          right: rightRailWidth + 20,
          bottom: bottomCutoff,
          border: "3px solid #22c55e",
          boxShadow: "inset 0 0 20px rgba(34, 197, 94, 0.25)",
          borderRadius: 16,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          padding: 16,
        }}
      >
        <span
          style={{
            backgroundColor: "#22c55e",
            color: "#052e16",
            padding: "4px 10px",
            borderRadius: 6,
            fontSize: 18,
            fontWeight: 800,
          }}
        >
          SAFE CONTENT ZONE
        </span>
      </div>
    </div>
  );
};
