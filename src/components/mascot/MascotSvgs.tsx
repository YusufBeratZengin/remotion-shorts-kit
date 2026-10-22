import type React from "react";
import type { MascotPose } from "../../schema";

interface MascotSvgProps {
  className?: string;
  style?: React.CSSProperties;
}

export const MascotIdle: React.FC<MascotSvgProps> = ({ style }) => (
  <svg
    viewBox="0 0 240 320"
    width="100%"
    height="100%"
    style={{ overflow: "visible", ...style }}
    role="img"
    aria-label="Mascot idle pose"
  >
    <defs>
      <linearGradient id="bodyGradIdle" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#0284c7" />
      </linearGradient>
      <linearGradient id="bellyGradIdle" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#f8fafc" />
        <stop offset="100%" stopColor="#e2e8f0" />
      </linearGradient>
    </defs>
    <ellipse cx="120" cy="305" rx="55" ry="10" fill="rgba(0,0,0,0.25)" />
    <line
      x1="120"
      y1="45"
      x2="120"
      y2="20"
      stroke="#0369a1"
      strokeWidth="6"
      strokeLinecap="round"
    />
    <circle cx="120" cy="16" r="10" fill="#f59e0b" />
    <circle cx="118" cy="13" r="3" fill="#fef3c7" />
    <ellipse cx="90" cy="295" rx="20" ry="12" fill="#0369a1" />
    <ellipse cx="150" cy="295" rx="20" ry="12" fill="#0369a1" />
    <path
      d="M 50 140 Q 30 180 45 210"
      fill="none"
      stroke="#0284c7"
      strokeWidth="16"
      strokeLinecap="round"
    />
    <circle cx="45" cy="210" r="11" fill="#38bdf8" />
    <path
      d="M 190 140 Q 210 180 195 210"
      fill="none"
      stroke="#0284c7"
      strokeWidth="16"
      strokeLinecap="round"
    />
    <circle cx="195" cy="210" r="11" fill="#38bdf8" />
    <rect x="50" y="45" width="140" height="240" rx="70" fill="url(#bodyGradIdle)" />
    <rect x="75" y="160" width="90" height="95" rx="30" fill="url(#bellyGradIdle)" />
    <circle cx="120" cy="205" r="8" fill="#10b981" />
    <rect x="68" y="80" width="104" height="60" rx="26" fill="#0f172a" />
    <ellipse cx="98" cy="110" rx="10" ry="12" fill="#38bdf8" />
    <circle cx="95" cy="106" r="4" fill="#ffffff" />
    <ellipse cx="142" cy="110" rx="10" ry="12" fill="#38bdf8" />
    <circle cx="139" cy="106" r="4" fill="#ffffff" />
    <path
      d="M 112 124 Q 120 130 128 124"
      fill="none"
      stroke="#38bdf8"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

export const MascotTalking: React.FC<MascotSvgProps> = ({ style }) => (
  <svg
    viewBox="0 0 240 320"
    width="100%"
    height="100%"
    style={{ overflow: "visible", ...style }}
    role="img"
    aria-label="Mascot talking pose"
  >
    <defs>
      <linearGradient id="bodyGradTalk" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#0284c7" />
      </linearGradient>
      <linearGradient id="bellyGradTalk" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#f8fafc" />
        <stop offset="100%" stopColor="#e2e8f0" />
      </linearGradient>
    </defs>
    <ellipse cx="120" cy="305" rx="55" ry="10" fill="rgba(0,0,0,0.25)" />
    <line
      x1="120"
      y1="45"
      x2="126"
      y2="19"
      stroke="#0369a1"
      strokeWidth="6"
      strokeLinecap="round"
    />
    <circle cx="128" cy="15" r="10" fill="#f59e0b" />
    <circle cx="126" cy="12" r="3" fill="#fef3c7" />
    <ellipse cx="90" cy="295" rx="20" ry="12" fill="#0369a1" />
    <ellipse cx="150" cy="295" rx="20" ry="12" fill="#0369a1" />
    <path
      d="M 50 140 Q 20 120 28 95"
      fill="none"
      stroke="#0284c7"
      strokeWidth="16"
      strokeLinecap="round"
    />
    <circle cx="28" cy="95" r="11" fill="#38bdf8" />
    <path
      d="M 190 140 Q 210 180 195 210"
      fill="none"
      stroke="#0284c7"
      strokeWidth="16"
      strokeLinecap="round"
    />
    <circle cx="195" cy="210" r="11" fill="#38bdf8" />
    <rect x="50" y="45" width="140" height="240" rx="70" fill="url(#bodyGradTalk)" />
    <rect x="75" y="160" width="90" height="95" rx="30" fill="url(#bellyGradTalk)" />
    <circle cx="120" cy="205" r="8" fill="#10b981" />
    <path d="M 104 225 L 136 225" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
    <rect x="68" y="80" width="104" height="60" rx="26" fill="#0f172a" />
    <path
      d="M 88 112 Q 98 100 108 112"
      fill="none"
      stroke="#38bdf8"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <path
      d="M 132 112 Q 142 100 152 112"
      fill="none"
      stroke="#38bdf8"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <ellipse cx="120" cy="124" rx="10" ry="6" fill="#38bdf8" />
  </svg>
);

export const MascotExplaining: React.FC<MascotSvgProps> = ({ style }) => (
  <svg
    viewBox="0 0 240 320"
    width="100%"
    height="100%"
    style={{ overflow: "visible", ...style }}
    role="img"
    aria-label="Mascot explaining pose"
  >
    <defs>
      <linearGradient id="bodyGradExplain" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#0284c7" />
      </linearGradient>
      <linearGradient id="bellyGradExplain" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#f8fafc" />
        <stop offset="100%" stopColor="#e2e8f0" />
      </linearGradient>
    </defs>
    <ellipse cx="120" cy="305" rx="55" ry="10" fill="rgba(0,0,0,0.25)" />
    <line
      x1="120"
      y1="45"
      x2="120"
      y2="20"
      stroke="#0369a1"
      strokeWidth="6"
      strokeLinecap="round"
    />
    <circle cx="120" cy="16" r="10" fill="#f59e0b" />
    <circle cx="118" cy="13" r="3" fill="#fef3c7" />
    <ellipse cx="90" cy="295" rx="20" ry="12" fill="#0369a1" />
    <ellipse cx="150" cy="295" rx="20" ry="12" fill="#0369a1" />
    <path
      d="M 50 140 Q 30 160 52 180"
      fill="none"
      stroke="#0284c7"
      strokeWidth="16"
      strokeLinecap="round"
    />
    <circle cx="52" cy="180" r="11" fill="#38bdf8" />
    <path
      d="M 190 140 Q 220 110 225 65"
      fill="none"
      stroke="#0284c7"
      strokeWidth="16"
      strokeLinecap="round"
    />
    <circle cx="225" cy="65" r="11" fill="#38bdf8" />
    <line
      x1="225"
      y1="65"
      x2="232"
      y2="45"
      stroke="#38bdf8"
      strokeWidth="7"
      strokeLinecap="round"
    />
    <circle cx="234" cy="40" r="5" fill="#f59e0b" />
    <rect x="50" y="45" width="140" height="240" rx="70" fill="url(#bodyGradExplain)" />
    <rect x="75" y="160" width="90" height="95" rx="30" fill="url(#bellyGradExplain)" />
    <circle cx="120" cy="205" r="8" fill="#10b981" />
    <rect x="68" y="80" width="104" height="60" rx="26" fill="#0f172a" />
    <ellipse cx="102" cy="108" rx="9" ry="11" fill="#38bdf8" />
    <circle cx="104" cy="105" r="3.5" fill="#ffffff" />
    <ellipse cx="146" cy="108" rx="9" ry="11" fill="#38bdf8" />
    <circle cx="148" cy="105" r="3.5" fill="#ffffff" />
    <path
      d="M 115 124 Q 124 130 134 122"
      fill="none"
      stroke="#38bdf8"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

export const MascotThinking: React.FC<MascotSvgProps> = ({ style }) => (
  <svg
    viewBox="0 0 240 320"
    width="100%"
    height="100%"
    style={{ overflow: "visible", ...style }}
    role="img"
    aria-label="Mascot thinking pose"
  >
    <defs>
      <linearGradient id="bodyGradThink" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#0284c7" />
      </linearGradient>
      <linearGradient id="bellyGradThink" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#f8fafc" />
        <stop offset="100%" stopColor="#e2e8f0" />
      </linearGradient>
    </defs>
    <ellipse cx="120" cy="305" rx="55" ry="10" fill="rgba(0,0,0,0.25)" />
    <line
      x1="120"
      y1="45"
      x2="110"
      y2="18"
      stroke="#0369a1"
      strokeWidth="6"
      strokeLinecap="round"
    />
    <circle cx="108" cy="14" r="10" fill="#f59e0b" />
    <circle cx="106" cy="11" r="3" fill="#fef3c7" />
    <circle cx="175" cy="40" r="5" fill="#f59e0b" />
    <circle cx="190" cy="25" r="3" fill="#f59e0b" />
    <ellipse cx="90" cy="295" rx="20" ry="12" fill="#0369a1" />
    <ellipse cx="150" cy="295" rx="20" ry="12" fill="#0369a1" />
    <path
      d="M 50 140 Q 40 180 85 185"
      fill="none"
      stroke="#0284c7"
      strokeWidth="16"
      strokeLinecap="round"
    />
    <circle cx="85" cy="185" r="11" fill="#38bdf8" />
    <path
      d="M 190 140 Q 180 180 135 150"
      fill="none"
      stroke="#0284c7"
      strokeWidth="16"
      strokeLinecap="round"
    />
    <circle cx="130" cy="145" r="12" fill="#38bdf8" />
    <rect x="50" y="45" width="140" height="240" rx="70" fill="url(#bodyGradThink)" />
    <rect x="75" y="160" width="90" height="95" rx="30" fill="url(#bellyGradThink)" />
    <circle cx="120" cy="205" r="8" fill="#f59e0b" />
    <rect x="68" y="80" width="104" height="60" rx="26" fill="#0f172a" />
    <ellipse cx="96" cy="104" rx="9" ry="11" fill="#38bdf8" />
    <circle cx="94" cy="99" r="3.5" fill="#ffffff" />
    <ellipse cx="140" cy="104" rx="9" ry="11" fill="#38bdf8" />
    <circle cx="138" cy="99" r="3.5" fill="#ffffff" />
    <path
      d="M 114 126 Q 120 123 126 128"
      fill="none"
      stroke="#38bdf8"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

export const MascotSurprised: React.FC<MascotSvgProps> = ({ style }) => (
  <svg
    viewBox="0 0 240 320"
    width="100%"
    height="100%"
    style={{ overflow: "visible", ...style }}
    role="img"
    aria-label="Mascot surprised pose"
  >
    <defs>
      <linearGradient id="bodyGradSurprise" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#0284c7" />
      </linearGradient>
      <linearGradient id="bellyGradSurprise" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#f8fafc" />
        <stop offset="100%" stopColor="#e2e8f0" />
      </linearGradient>
    </defs>
    <ellipse cx="120" cy="305" rx="55" ry="10" fill="rgba(0,0,0,0.25)" />
    <line
      x1="120"
      y1="45"
      x2="120"
      y2="15"
      stroke="#0369a1"
      strokeWidth="6"
      strokeLinecap="round"
    />
    <circle cx="120" cy="12" r="11" fill="#ef4444" />
    <circle cx="118" cy="9" r="3.5" fill="#fee2e2" />
    <line x1="100" y1="10" x2="90" y2="2" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
    <line x1="140" y1="10" x2="150" y2="2" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
    <ellipse cx="88" cy="295" rx="20" ry="12" fill="#0369a1" />
    <ellipse cx="152" cy="295" rx="20" ry="12" fill="#0369a1" />
    <path
      d="M 50 140 Q 20 110 32 80"
      fill="none"
      stroke="#0284c7"
      strokeWidth="16"
      strokeLinecap="round"
    />
    <circle cx="32" cy="80" r="11" fill="#38bdf8" />
    <path
      d="M 190 140 Q 220 110 208 80"
      fill="none"
      stroke="#0284c7"
      strokeWidth="16"
      strokeLinecap="round"
    />
    <circle cx="208" cy="80" r="11" fill="#38bdf8" />
    <rect x="50" y="45" width="140" height="240" rx="70" fill="url(#bodyGradSurprise)" />
    <rect x="75" y="160" width="90" height="95" rx="30" fill="url(#bellyGradSurprise)" />
    <circle cx="120" cy="205" r="9" fill="#ef4444" />
    <rect x="68" y="78" width="104" height="64" rx="26" fill="#0f172a" />
    <circle cx="96" cy="106" r="14" fill="#38bdf8" />
    <circle cx="96" cy="106" r="6" fill="#ffffff" />
    <circle cx="144" cy="106" r="14" fill="#38bdf8" />
    <circle cx="144" cy="106" r="6" fill="#ffffff" />
    <circle cx="120" cy="126" r="7" fill="#38bdf8" />
  </svg>
);

export const POSE_COMPONENTS: Record<MascotPose, React.FC<MascotSvgProps>> = {
  idle: MascotIdle,
  talking: MascotTalking,
  explaining: MascotExplaining,
  thinking: MascotThinking,
  surprised: MascotSurprised,
};
