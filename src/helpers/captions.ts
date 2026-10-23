import type { Word } from "../schema.js";

export interface CaptionBatch {
  id: string;
  start: number;
  end: number;
  lines: Word[][];
  allWords: Word[];
  text: string;
}

export interface BatchingOptions {
  maxCharsPerLine?: number;
  maxLines?: number;
  pauseThresholdSec?: number;
  lingerDurationSec?: number;
}

const DEFAULT_OPTIONS: Required<BatchingOptions> = {
  maxCharsPerLine: 26,
  maxLines: 2,
  pauseThresholdSec: 0.45,
  lingerDurationSec: 0.25,
};

const SENTENCE_END_REGEX = /[.!?]$/;

/**
 * Groups raw timestamped words into digestible 1-2 line caption batches
 * optimized for vertical shorts viewing.
 */
export function groupWordsIntoBatches(words: Word[], options?: BatchingOptions): CaptionBatch[] {
  if (!words || words.length === 0) {
    return [];
  }

  const { maxCharsPerLine, maxLines, pauseThresholdSec, lingerDurationSec } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  const batches: CaptionBatch[] = [];
  let currentLines: Word[][] = [[]];
  let currentLineChars = 0;

  function finalizeBatch(nextWordStart?: number) {
    const populatedLines = currentLines.filter((line) => line.length > 0);
    if (populatedLines.length === 0) return;

    const allWords = populatedLines.flat();
    const firstWord = allWords[0];
    const lastWord = allWords[allWords.length - 1];

    if (!firstWord || !lastWord) return;

    let endTime = lastWord.end + lingerDurationSec;
    if (nextWordStart !== undefined && endTime > nextWordStart) {
      endTime = Math.max(lastWord.end, nextWordStart);
    }

    const text = populatedLines.map((line) => line.map((w) => w.text).join(" ")).join("\n");

    batches.push({
      id: `batch-${batches.length}-${firstWord.start.toFixed(2)}`,
      start: firstWord.start,
      end: endTime,
      lines: populatedLines,
      allWords,
      text,
    });

    currentLines = [[]];
    currentLineChars = 0;
  }

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (!word) continue;

    const prevWord = i > 0 ? words[i - 1] : undefined;

    // Condition 1: Check for sentence ending punctuation on previous word
    const prevEndedSentence = prevWord ? SENTENCE_END_REGEX.test(prevWord.text.trim()) : false;

    // Condition 2: Check for significant pause between words
    const pauseGap = prevWord ? word.start - prevWord.end : 0;
    const isPause = pauseGap >= pauseThresholdSec;

    if (prevEndedSentence || isPause) {
      finalizeBatch(word.start);
    }

    const currentLineIdx = currentLines.length - 1;
    const currentLine = currentLines[currentLineIdx] ?? [];
    const wordLength = word.text.length;
    const candidateChars =
      currentLine.length === 0 ? wordLength : currentLineChars + 1 + wordLength;

    if (candidateChars <= maxCharsPerLine) {
      currentLine.push(word);
      currentLines[currentLineIdx] = currentLine;
      currentLineChars = candidateChars;
    } else {
      // Need a new line
      if (currentLines.length < maxLines) {
        currentLines.push([word]);
        currentLineChars = wordLength;
      } else {
        // Exceeded max lines, start a new batch
        finalizeBatch(word.start);
        currentLines = [[word]];
        currentLineChars = wordLength;
      }
    }
  }

  finalizeBatch();

  return batches;
}

/**
 * Finds the active caption batch at the given timestamp in seconds.
 */
export function findActiveCaptionBatch(
  batches: CaptionBatch[],
  currentTimeSec: number,
): CaptionBatch | null {
  for (const batch of batches) {
    if (currentTimeSec >= batch.start && currentTimeSec < batch.end) {
      return batch;
    }
  }
  return null;
}

/**
 * Finds the currently active word at the given timestamp in seconds.
 */
export function findActiveWord(
  words: Word[],
  currentTimeSec: number,
): { word: Word; index: number } | null {
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (!word) continue;
    if (currentTimeSec >= word.start && currentTimeSec <= word.end) {
      return { word, index: i };
    }
  }
  return null;
}
