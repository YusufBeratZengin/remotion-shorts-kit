import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { TimelineSchema } from "../src/schema";

describe("shorts-kit CLI", () => {
  let directory: string;
  beforeEach(() => {
    directory = mkdtempSync(join(tmpdir(), "shorts-kit-test-"));
  });
  afterEach(() => {
    rmSync(directory, { recursive: true, force: true });
  });
  const run = (...args: string[]) =>
    spawnSync(process.execPath, ["bin/shorts-kit.mjs", ...args], { encoding: "utf8" });

  it("validates a timeline with exit code zero", () => {
    const result = run("validate", "examples/demo-timeline.json");
    expect(result.error).toBeUndefined();
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ ok: true, errors: [] });
  });
  it("converts Whisper segments into a complete timeline with Word[] captions", () => {
    const output = join(directory, "timeline.json");
    const result = run("words-to-timeline", "tests/fixtures/whisper.json", "--out", output);
    expect(result.status).toBe(0);
    const timeline = TimelineSchema.parse(JSON.parse(readFileSync(output, "utf8")));
    expect(timeline.captions).toEqual([
      { text: "Water", start: 0.1, end: 0.5, confidence: 0.98 },
      { text: "flows", start: 0.5, end: 0.9, confidence: 0.95 },
      { text: "downhill.", start: 0.9, end: 1.5, confidence: 0.97 },
    ]);
    expect(timeline.scenes[0]?.end).toBe(1.5);
    expect(run("validate", output).status).toBe(0);
  });
  it("also accepts top-level words and raw word arrays", () => {
    const words = [{ text: "Hi", start: 0, end: 0.5 }];
    for (const input of [words, { words }]) {
      const file = join(directory, "words.json");
      const output = join(directory, "timeline.json");
      writeFileSync(file, JSON.stringify(input));
      expect(run("words-to-timeline", file, "--out", output).status).toBe(0);
      expect(JSON.parse(readFileSync(output, "utf8")).captions).toEqual(words);
    }
  });
  it("returns nonzero for malformed JSON", () => {
    const file = join(directory, "bad.json");
    writeFileSync(file, "{bad");
    expect(run("validate", file).status).toBe(1);
    expect(run("words-to-timeline", file, "--out", join(directory, "out.json")).status).toBe(1);
  });
  it("reports schema paths on invalid timelines", () => {
    const file = join(directory, "invalid.json");
    writeFileSync(file, JSON.stringify({ scenes: [] }));
    const result = run("validate", file);
    expect(result.status).toBe(1);
    expect(JSON.parse(result.stdout).errors[0]).toContain("$.scenes");
  });
  it("rejects timestamps that are missing or overlap", () => {
    for (const words of [
      [{ word: "Hi" }],
      [
        { word: "A", start: 0, end: 1 },
        { word: "B", start: 0.5, end: 2 },
      ],
    ]) {
      const file = join(directory, "words.json");
      writeFileSync(file, JSON.stringify({ words }));
      const result = run("words-to-timeline", file, "--out", join(directory, "output.json"));
      expect(result.status).toBe(1);
      expect(result.stderr).toContain("$");
    }
  });
  it("reports bad arguments and missing files", () => {
    expect(run().status).toBe(1);
    expect(run("words-to-timeline", "tests/fixtures/whisper.json").status).toBe(1);
    expect(run("validate", join(directory, "missing.json")).status).toBe(1);
  });
});
