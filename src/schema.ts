import { z } from "zod";

/**
 * Supported mascot poses.
 */
export const MascotPoseSchema = z.enum(["idle", "talking", "explaining", "thinking", "surprised"]);
export type MascotPose = z.infer<typeof MascotPoseSchema>;

/**
 * Mascot placement and appearance inside a scene.
 */
export const MascotConfigSchema = z.object({
  pose: MascotPoseSchema,
  x: z.number().describe("Horizontal center position in pixels (0 to width)"),
  y: z.number().describe("Vertical center position in pixels (0 to height)"),
  scale: z.number().positive().default(1),
  flip: z.boolean().default(false).describe("Flip horizontally if true"),
});
export type MascotConfig = z.infer<typeof MascotConfigSchema>;

/**
 * Single word timestamped for animated captions (e.g. from Whisper or TTS).
 */
export const WordSchema = z
  .object({
    text: z.string().min(1),
    start: z.number().min(0).describe("Start time in seconds"),
    end: z.number().min(0).describe("End time in seconds"),
    confidence: z.number().min(0).max(1).optional(),
  })
  .refine((word) => word.end >= word.start, {
    message: "Word end must not be before start",
    path: ["end"],
  });
export type Word = z.infer<typeof WordSchema>;

/**
 * Visual callout element (highlight card / bubble).
 */
export const CalloutElementSchema = z.object({
  type: z.literal("callout"),
  id: z.string(),
  start: z.number().min(0).optional().describe("Local start offset in seconds"),
  end: z.number().min(0).optional().describe("Local end offset in seconds"),
  x: z.number().describe("Horizontal position in pixels"),
  y: z.number().describe("Vertical position in pixels"),
  title: z.string().optional(),
  text: z.string(),
  icon: z.string().optional(),
  accentColor: z.string().default("#38bdf8"),
  backgroundColor: z.string().default("rgba(15, 23, 42, 0.85)"),
  textColor: z.string().default("#f8fafc"),
});
export type CalloutElement = z.infer<typeof CalloutElementSchema>;

/**
 * Directional animated arrow pointing to a mechanism or area.
 */
export const ArrowElementSchema = z.object({
  type: z.literal("arrow"),
  id: z.string(),
  start: z.number().min(0).optional(),
  end: z.number().min(0).optional(),
  fromX: z.number(),
  fromY: z.number(),
  toX: z.number(),
  toY: z.number(),
  label: z.string().optional(),
  color: z.string().default("#f59e0b"),
  strokeWidth: z.number().positive().default(8),
  curvature: z.number().default(0).describe("Curvature offset in px, 0 for straight"),
});
export type ArrowElement = z.infer<typeof ArrowElementSchema>;

/**
 * Camera zoom & pan effect during a scene.
 */
export const ZoomElementSchema = z.object({
  type: z.literal("zoom"),
  id: z.string(),
  start: z.number().min(0).optional(),
  end: z.number().min(0).optional(),
  targetX: z.number().describe("Horizontal focus anchor in pixels"),
  targetY: z.number().describe("Vertical focus anchor in pixels"),
  scale: z.number().min(1).default(1.25),
  durationFrames: z.number().int().positive().default(30),
});
export type ZoomElement = z.infer<typeof ZoomElementSchema>;

/**
 * Union of all scene elements.
 */
export const SceneElementSchema = z.discriminatedUnion("type", [
  CalloutElementSchema,
  ArrowElementSchema,
  ZoomElementSchema,
]);
export type SceneElement = z.infer<typeof SceneElementSchema>;

/**
 * Single scene definition inside a timeline.
 */
export const SceneSchema = z
  .object({
    id: z.string().min(1),
    start: z.number().min(0).describe("Scene start time in seconds"),
    end: z.number().min(0).describe("Scene end time in seconds"),
    background: z.string().describe("Hex color, CSS gradient, or image URL"),
    title: z.string().optional(),
    mascot: MascotConfigSchema.optional(),
    elements: z.array(SceneElementSchema).default([]),
  })
  .refine((scene) => scene.end > scene.start, {
    message: "Scene end must be greater than start",
    path: ["end"],
  });
export type Scene = z.infer<typeof SceneSchema>;

export const DEFAULT_CAPTION_STYLE = {
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  fontSize: 54,
  textColor: "#ffffff",
  highlightColor: "#facc15",
  boxColor: "rgba(15, 23, 42, 0.85)",
  boxPadding: 20,
  borderRadius: 20,
  maxCharsPerLine: 18,
  maxLines: 2,
  positionBottom: 500,
  uppercase: true,
};

/**
 * Visual styling options for animated captions.
 */
export const CaptionStyleSchema = z.object({
  fontFamily: z.string().default(DEFAULT_CAPTION_STYLE.fontFamily),
  fontSize: z.number().positive().default(DEFAULT_CAPTION_STYLE.fontSize),
  textColor: z.string().default(DEFAULT_CAPTION_STYLE.textColor),
  highlightColor: z.string().default(DEFAULT_CAPTION_STYLE.highlightColor),
  boxColor: z.string().default(DEFAULT_CAPTION_STYLE.boxColor),
  boxPadding: z.number().min(0).default(DEFAULT_CAPTION_STYLE.boxPadding),
  borderRadius: z.number().min(0).default(DEFAULT_CAPTION_STYLE.borderRadius),
  maxCharsPerLine: z.number().int().positive().default(DEFAULT_CAPTION_STYLE.maxCharsPerLine),
  maxLines: z.number().int().positive().default(DEFAULT_CAPTION_STYLE.maxLines),
  positionBottom: z.number().min(0).default(DEFAULT_CAPTION_STYLE.positionBottom),
  uppercase: z.boolean().default(DEFAULT_CAPTION_STYLE.uppercase),
});
export type CaptionStyle = z.infer<typeof CaptionStyleSchema>;

/**
 * Optional audio track configuration.
 */
export const AudioConfigSchema = z.object({
  src: z.string().min(1),
  volume: z.number().min(0).max(1).default(1),
  startOffset: z.number().min(0).default(0),
});
export type AudioConfig = z.infer<typeof AudioConfigSchema>;

/**
 * Safe area overlay platforms.
 */
export const SafeAreaPlatformSchema = z.enum([
  "all",
  "youtube-shorts",
  "tiktok",
  "instagram-reels",
]);
export type SafeAreaPlatform = z.infer<typeof SafeAreaPlatformSchema>;

/**
 * Complete timeline schema describing the entire vertical short.
 */
export const TimelineSchema = z.object({
  fps: z.number().int().positive().default(30),
  width: z.number().int().positive().default(1080),
  height: z.number().int().positive().default(1920),
  scenes: z.array(SceneSchema).min(1),
  captions: z.array(WordSchema).default([]),
  audio: AudioConfigSchema.optional(),
  captionStyle: CaptionStyleSchema.default(DEFAULT_CAPTION_STYLE),
  showSafeArea: z.boolean().default(false),
  showProgressBar: z.boolean().default(true),
});
export type Timeline = z.infer<typeof TimelineSchema>;

export const ExplainerPropsSchema = z.object({
  timeline: TimelineSchema,
});
export type ExplainerProps = z.infer<typeof ExplainerPropsSchema>;

/**
 * Validates unknown timeline data against TimelineSchema.
 * Throws ZodError if validation fails.
 */
export function validateTimeline(data: unknown): Timeline {
  return TimelineSchema.parse(data);
}

/**
 * Safely parses unknown timeline data against TimelineSchema.
 */
export function safeParseTimeline(data: unknown) {
  return TimelineSchema.safeParse(data);
}
