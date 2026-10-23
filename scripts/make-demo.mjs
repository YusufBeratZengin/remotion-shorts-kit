import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

// These exact commands are documented in both READMEs. Build the CLI first.
const root = fileURLToPath(new URL("../", import.meta.url));
const commands = [
  ["validate", "examples/demo-timeline.json"],
  ["words-to-timeline", "tests/fixtures/whisper.json", "--out", "out/timeline.json"],
  ["validate", "out/timeline.json"],
  ["validate", "examples/second-timeline.json"],
];

mkdirSync(new URL("../out/", import.meta.url), { recursive: true });
const lines = [];
for (const args of commands) {
  const result = spawnSync(process.execPath, ["bin/shorts-kit.mjs", ...args], {
    cwd: root,
    encoding: "utf8",
    env: { ...process.env, NO_COLOR: "1" },
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`CLI exited ${result.status}: ${result.stderr || result.stdout}`);
  }
  if (result.stderr.trim()) throw new Error(`Unexpected CLI stderr: ${result.stderr}`);
  if (lines.length) lines.push("");
  lines.push(`$ node bin/shorts-kit.mjs ${args.join(" ")}`);
  lines.push(...result.stdout.trimEnd().replace(/\r\n/g, "\n").split("\n"));
}

function escapeXml(value) {
  return value.replace(/[<>&"']/g, (char) => {
    const entities = { "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" };
    return entities[char];
  });
}

const width = Math.max(860, 64 + Math.max(...lines.map((line) => line.length)) * 8.5);
const height = 100 + lines.length * 24;
const rows = lines.map((line, index) => {
  const color = line.startsWith("$ ") ? "#a5f3fc" : "#d1d5db";
  return `    <text x="32" y="${88 + index * 24}" fill="${color}">${escapeXml(line)}</text>`;
});
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title description">
  <title id="title">remotion-shorts-kit CLI demo</title>
  <desc id="description">Actual CLI output: validate the thermos timeline, convert synthetic Whisper words, and validate the converted and siphon timelines. All validations succeed.</desc>
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="16" fill="#0d1117" stroke="#30363d"/>
  <path d="M1 52H${width - 1}" stroke="#30363d"/>
  <circle cx="28" cy="27" r="6" fill="#ff5f57"/>
  <circle cx="50" cy="27" r="6" fill="#febc2e"/>
  <circle cx="72" cy="27" r="6" fill="#28c840"/>
  <text x="${width / 2}" y="32" text-anchor="middle" fill="#8b949e" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="13">shorts-kit · local CLI</text>
  <g font-family="ui-monospace, Menlo, Consolas, monospace" font-size="14" xml:space="preserve">
${rows.join("\n")}
  </g>
</svg>
`;
mkdirSync(new URL("../docs/", import.meta.url), { recursive: true });
writeFileSync(new URL("../docs/demo.svg", import.meta.url), svg, "utf8");
console.log(`Wrote docs/demo.svg (${lines.length} terminal lines)`);
