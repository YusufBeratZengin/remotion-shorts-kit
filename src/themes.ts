import { z } from "zod";

/** Local font stacks only: selecting a theme never downloads a font. */
export const ThemeSchema = z.object({
  fontFamily: z.string().min(1),
  colors: z.object({
    background: z.string().min(1),
    surface: z.string().min(1),
    text: z.string().min(1),
    muted: z.string().min(1),
    accent: z.string().min(1),
    highlight: z.string().min(1),
  }),
});
export type Theme = z.infer<typeof ThemeSchema>;

export const THEMES = {
  midnight: {
    fontFamily: "'Segoe UI', Arial, sans-serif",
    colors: {
      background: "#0b1220",
      surface: "#17243b",
      text: "#f8fafc",
      muted: "#a5b4cc",
      accent: "#38bdf8",
      highlight: "#facc15",
    },
  },
  paper: {
    fontFamily: "Georgia, 'Times New Roman', serif",
    colors: {
      background: "#f5f0e8",
      surface: "#ffffff",
      text: "#252522",
      muted: "#66665d",
      accent: "#28675b",
      highlight: "#a6451b",
    },
  },
  sunset: {
    fontFamily: "'Trebuchet MS', Arial, sans-serif",
    colors: {
      background: "#281326",
      surface: "#43223b",
      text: "#fff3e8",
      muted: "#d8b4c4",
      accent: "#ffad66",
      highlight: "#f9de82",
    },
  },
} as const satisfies Record<string, Theme>;
