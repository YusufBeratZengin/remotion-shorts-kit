import content from "../../examples/templates-timeline.json";
import { createThemedTimeline } from "../helpers/theme.js";
import { SceneTemplateSchema } from "../templates.js";
import { THEMES, type Theme } from "../themes.js";

/** Synthetic content shared by Studio and the README gallery. */
export const createTemplateShowcase = (theme: Theme = THEMES.midnight) =>
  createThemedTimeline(
    {
      scenes: content.scenes.map((scene) => ({
        ...scene,
        background: theme.colors.background,
        template: SceneTemplateSchema.parse(scene.template),
      })),
    },
    theme,
  );
