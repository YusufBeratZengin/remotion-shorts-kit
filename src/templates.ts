import { z } from "zod";

/** A staggered list with an animated completed/total counter (one to five rows). */
export const ListTemplateSchema = z.object({
  type: z.literal("list"),
  heading: z.string().min(1).max(80),
  items: z.array(z.string().min(1).max(90)).min(1).max(5),
  intervalSeconds: z.number().positive().default(0.6),
});
export type ListTemplate = z.infer<typeof ListTemplateSchema>;

const ComparisonPanelSchema = z.object({
  label: z.string().min(1).max(30),
  text: z.string().min(1).max(180),
});

/** Two stacked panels, with the after panel revealed after a local delay. */
export const BeforeAfterTemplateSchema = z.object({
  type: z.literal("before-after"),
  heading: z.string().min(1).max(80),
  before: ComparisonPanelSchema,
  after: ComparisonPanelSchema,
  revealSeconds: z.number().min(0).default(1),
});
export type BeforeAfterTemplate = z.infer<typeof BeforeAfterTemplateSchema>;

export const SceneTemplateSchema = z.discriminatedUnion("type", [
  ListTemplateSchema,
  BeforeAfterTemplateSchema,
]);
export type SceneTemplate = z.infer<typeof SceneTemplateSchema>;
