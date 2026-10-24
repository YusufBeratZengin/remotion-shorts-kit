import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { THEMES, parseTimeline } from "../dist/library.js";

// Native SVG fallback: no browser, subprocess, network, or downloaded fonts.
// Content and palettes are the same inputs used by the Studio compositions.
const timeline = parseTimeline(
  JSON.parse(readFileSync(new URL("../examples/templates-timeline.json", import.meta.url), "utf8")),
);
const docs = new URL("../docs/", import.meta.url);
mkdirSync(docs, { recursive: true });

const xml = (value) =>
  String(value).replace(/[<>&"']/g, (char) => {
    const entities = { "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" };
    return entities[char];
  });

function lines(value, limit) {
  const result = [""];
  for (const word of value.split(/\s+/)) {
    const last = result.length - 1;
    if (result[last] && result[last].length + word.length + 1 > limit) result.push(word);
    else result[last] += `${result[last] ? " " : ""}${word}`;
  }
  return result;
}

function text(value, x, y, size, color, limit = 36, weight = 600) {
  return `<text x="${x}" y="${y}" fill="${xml(color)}" font-size="${size}" font-weight="${weight}">${lines(
    value,
    limit,
  )
    .map((line, index) => `<tspan x="${x}" dy="${index ? size * 1.3 : 0}">${xml(line)}</tspan>`)
    .join("")}</text>`;
}

for (const [name, theme] of Object.entries(THEMES)) {
  const { colors } = theme;
  for (const scene of timeline.scenes) {
    const template = scene.template;
    if (!template) throw new Error(`Missing gallery template: ${scene.id}`);
    const list = template.type === "list";
    const title = `${list ? "List / counter" : "Before / after"} — ${name}`;
    const content = [
      `<rect width="540" height="960" fill="${colors.background}"/>`,
      `<rect x="58" y="66" width="360" height="30" rx="15" fill="${colors.surface}"/>`,
      text(scene.title.toUpperCase(), 72, 86, 11, colors.muted, 55),
      text(list ? "CHECKLIST" : "BEFORE / AFTER", 32, 168, 10, colors.accent),
      text(template.heading, 32, 204, 27, colors.text, 25, 800),
    ];
    if (list) {
      content.push(
        text(
          `${template.items.length} / ${template.items.length}`,
          32,
          292,
          34,
          colors.highlight,
          20,
          800,
        ),
      );
      template.items.forEach((item, index) => {
        const y = 320 + index * 83;
        content.push(
          `<rect x="32" y="${y}" width="416" height="72" rx="12" fill="${colors.surface}"/>`,
        );
        content.push(text(`${index + 1}.`, 48, y + 34, 15, colors.accent));
        content.push(text(item, 76, y + 34, 15, colors.text, 40));
      });
    } else {
      [template.before, template.after].forEach((panel, index) => {
        const y = 290 + index * 158;
        const accent = index ? colors.accent : colors.muted;
        content.push(
          `<rect x="32" y="${y}" width="416" height="140" rx="12" fill="${colors.surface}"/>`,
        );
        content.push(`<path d="M34 ${y + 12}V${y + 128}" stroke="${accent}" stroke-width="3"/>`);
        content.push(text(panel.label, 48, y + 30, 11, accent));
        content.push(text(panel.text, 48, y + 61, 17, colors.text, 38));
      });
    }
    content.push(text("SVG PREVIEW", 32, 885, 10, colors.muted));
    content.push(
      text(`${name} / ${list ? "list + counter" : "before + after"}`, 32, 908, 12, colors.accent),
    );
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="540" height="960" viewBox="0 0 540 960" role="img" aria-labelledby="title description">
  <title id="title">${xml(title)}</title>
  <desc id="description">Schematic SVG preview using the Studio example's content and theme. Not a rendered video frame.</desc>
  <g font-family="${xml(theme.fontFamily)}">
    ${content.join("\n    ")}
  </g>
</svg>
`;
    const filename = `${list ? "list" : "before-after"}-${name}.svg`;
    writeFileSync(new URL(filename, docs), svg, "utf8");
    console.log(`Wrote docs/${filename}`);
  }
}
