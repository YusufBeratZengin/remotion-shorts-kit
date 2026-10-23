#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { TimelineSchema, WordSchema, validateTimeline } from "../dist/schema.js";

const usage =
  "Usage: shorts-kit validate <timeline.json> | words-to-timeline <whisper.json> --out <timeline.json>";

/** Supports Whisper's segments[].words, top-level words, or a word array. */
export function wordsToTimeline(input) {
  const raw = Array.isArray(input)
    ? input
    : (input?.words ??
      input?.segments?.flatMap((segment, index) => {
        if (!Array.isArray(segment?.words))
          throw new Error(`$.segments[${index}].words: expected a word array`);
        return segment.words;
      }));
  if (!Array.isArray(raw) || raw.length === 0)
    throw new Error("$.words: expected a nonempty word-timestamp array");
  const captions = raw.map((word, index) => {
    const result = WordSchema.safeParse({
      text:
        typeof (word?.text ?? word?.word) === "string"
          ? (word.text ?? word.word).trim()
          : undefined,
      start: word?.start,
      end: word?.end,
      ...(word?.confidence !== undefined || word?.probability !== undefined
        ? { confidence: word.confidence ?? word.probability }
        : {}),
    });
    if (!result.success)
      throw new Error(
        result.error.issues
          .map((issue) => `$.words[${index}].${issue.path.join(".")}: ${issue.message}`)
          .join("\n"),
      );
    return result.data;
  });
  const timeline = {
    captions,
    scenes: [
      {
        id: "narration",
        start: 0,
        end: Math.max(1, ...captions.map((word) => word.end)),
        background: "#0f172a",
      },
    ],
  };
  const result = validateTimeline(timeline);
  if (!result.ok) throw new Error(result.errors.join("\n"));
  return TimelineSchema.parse(timeline);
}

export function main(args) {
  const [command, file, flag, output, ...extra] = args;
  if (
    !file ||
    extra.length ||
    (command === "validate"
      ? flag !== undefined
      : command !== "words-to-timeline" || flag !== "--out" || !output)
  ) {
    console.error(usage);
    return 1;
  }
  try {
    const input = JSON.parse(readFileSync(file, "utf8").replace(/^\uFEFF/, ""));
    if (command === "validate") {
      const result = validateTimeline(input);
      console.log(JSON.stringify({ ok: result.ok, errors: result.errors }, null, 2));
      return result.ok ? 0 : 1;
    }
    writeFileSync(output, `${JSON.stringify(wordsToTimeline(input), null, 2)}\n`, "utf8");
    console.log(`Wrote ${output}`);
    return 0;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    return 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = main(process.argv.slice(2));
}
