import { describe, expect, it } from "vitest";
import {
  findActiveCaptionBatch,
  findActiveWord,
  groupWordsIntoBatches,
} from "../src/helpers/captions";
import type { Word } from "../src/schema";

describe("captions helper", () => {
  const sampleWords: Word[] = [
    { text: "Have", start: 0.1, end: 0.3 },
    { text: "you", start: 0.3, end: 0.5 },
    { text: "ever", start: 0.5, end: 0.8 },
    { text: "wondered", start: 0.8, end: 1.2 },
    { text: "how", start: 1.2, end: 1.4 },
    { text: "a", start: 1.4, end: 1.5 },
    { text: "thermos", start: 1.5, end: 1.9 },
    { text: "works?", start: 1.9, end: 2.3 },
    { text: "It", start: 3.0, end: 3.2 }, // Note the pause: 3.0 - 2.3 = 0.7s gap
    { text: "traps", start: 3.2, end: 3.5 },
    { text: "heat", start: 3.5, end: 3.8 },
    { text: "completely.", start: 3.8, end: 4.3 },
  ];

  it("handles empty words array", () => {
    expect(groupWordsIntoBatches([])).toEqual([]);
  });

  it("splits batches by sentence endings and pauses", () => {
    const batches = groupWordsIntoBatches(sampleWords, {
      maxCharsPerLine: 30,
      maxLines: 2,
      pauseThresholdSec: 0.4,
    });

    // "works?" has '?' and gap to "It" is 0.7s, so sentence break triggers
    expect(batches.length).toBeGreaterThanOrEqual(2);
    expect(batches[0]?.text).toContain("Have");
    expect(batches[0]?.text).toContain("works?");
    expect(batches[1]?.text).toContain("It traps heat");
  });

  it("breaks long lines when exceeding maxCharsPerLine", () => {
    const words: Word[] = [
      { text: "Supercalifragilistic", start: 0.0, end: 0.5 },
      { text: "expialidocious", start: 0.5, end: 1.0 },
      { text: "something", start: 1.0, end: 1.5 },
      { text: "extraordinarily", start: 1.5, end: 2.0 },
      { text: "magnificent", start: 2.0, end: 2.5 },
    ];

    const batches = groupWordsIntoBatches(words, {
      maxCharsPerLine: 20,
      maxLines: 2,
    });

    expect(batches.length).toBeGreaterThan(1);
    for (const batch of batches) {
      expect(batch.lines.length).toBeLessThanOrEqual(2);
      for (const line of batch.lines) {
        const lineStr = line.map((w) => w.text).join(" ");
        // Either within limit or single long word
        if (line.length > 1) {
          expect(lineStr.length).toBeLessThanOrEqual(20);
        }
      }
    }
  });

  it("finds the active caption batch by timestamp", () => {
    const batches = groupWordsIntoBatches(sampleWords);
    const active = findActiveCaptionBatch(batches, 0.4);
    expect(active).not.toBeNull();
    expect(active?.start).toBeLessThanOrEqual(0.4);
    expect(active?.end).toBeGreaterThan(0.4);

    const outside = findActiveCaptionBatch(batches, 10.0);
    expect(outside).toBeNull();
  });

  it("finds the active word by timestamp", () => {
    const result = findActiveWord(sampleWords, 0.4);
    expect(result).not.toBeNull();
    expect(result?.word.text).toBe("you");
    expect(result?.index).toBe(1);

    const outside = findActiveWord(sampleWords, 2.7); // between words
    expect(outside).toBeNull();
  });
});
