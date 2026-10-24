import type { z } from "zod";
import { type SceneSchema, type Timeline, type TimelineSchema, parseTimeline } from "../schema.js";
import { type Theme, ThemeSchema } from "../themes.js";

export type ThemedTimelineInput = Omit<z.input<typeof TimelineSchema>, "scenes"> & {
  scenes: (Omit<z.input<typeof SceneSchema>, "background"> & { background?: string })[];
};

/** Fill only missing style values before schema defaults. Explicit author styles win. */
export function createThemedTimeline(input: ThemedTimelineInput, theme: Theme): Timeline {
  const resolved = ThemeSchema.parse(theme);
  const { colors, fontFamily } = resolved;
  return parseTimeline({
    ...input,
    theme: resolved,
    captionStyle: {
      fontFamily,
      textColor: colors.text,
      highlightColor: colors.highlight,
      boxColor: colors.surface,
      ...input.captionStyle,
    },
    scenes: input.scenes.map((scene) => ({
      ...scene,
      background: scene.background ?? colors.background,
      elements: scene.elements?.map((element) => {
        if (element.type === "callout") {
          return {
            accentColor: colors.accent,
            backgroundColor: colors.surface,
            textColor: colors.text,
            ...element,
          };
        }
        if (element.type === "arrow") return { color: colors.accent, ...element };
        return element;
      }),
    })),
  });
}
