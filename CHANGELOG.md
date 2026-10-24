# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Optional scene templates: a staggered list with a revealed-item counter, and a before/after comparison with a timed reveal. Both use scene-local frames and retain existing annotation layers.
- A single typed, validated theme object for colors and local font stacks; `midnight`, `paper`, and `sunset` presets, plus `createThemedTimeline` to fill missing styles while preserving explicit overrides.
- Three `Templates-*` Studio compositions, a reusable JSON example, and six clearly labeled SVG gallery previews under `docs/`, reproducible with `npm run docs:gallery`.
- English/Turkish template, theme, gallery, and still-render instructions; tests for validation, themes, overrides, and exact animation/scene boundaries.

### Compatibility

- Existing exports, required scene fields, and unthemed timeline defaults are unchanged. `template` and `theme` are optional; apply theme defaults to input data before calling the regular parser.

## [0.1.0] - 2026-10-23

### Added

- Remotion 4 starter for 1080×1920 explainer shorts, plus an ESM React library with TypeScript declarations and React/Remotion peer dependencies.
- Zod timeline schemas, default-filled parsers, and nonthrowing validation with JSON-path diagnostics.
- Frame-driven word captions with pause-aware batching, memoized line layout, and conservative vertical-video safe areas.
- Original SVG mascot Pip in five poses, callout cards, curved arrows, camera zooms, a progress bar, and a safe-area overlay.
- JSON-driven `SceneRenderer` and `ExplainerShort`, with 20-second thermos and 15-second siphon examples.
- Local `shorts-kit validate` and `words-to-timeline` commands with a synthetic Whisper fixture.
- Component rendering, CLI, invalid-timeline, and missing-asset tests; V8 coverage in `npm test` with 85% lines/statements and 80% branches/functions per helper/schema file.
- Linux/Windows CI on Node 20/22/24, a render-smoke artifact, community templates, weekly dependency updates, and a maintainer-controlled trusted npm publishing workflow.
- Actual GIF demo, a terminal SVG with a rerunnable CLI-output generator, synchronized English/Turkish usage guides, and release instructions.
- JavaScript/TypeScript CodeQL scanning and CI checks for generated-demo drift.

### Fixed

- Reject unsorted/overlapping caption words and overlapping scenes with JSON-path diagnostics.
- Missing public assets produce a named error when Remotion's public-file manifest is available.
- Importing the library no longer registers a Remotion root.
- Captions: no CSS transitions (frame-driven pop), end-exclusive word highlight, default `positionBottom` 500 and 180px right margin so captions stay in the safe box.
- Audio and image paths now go through `staticFile()`; `trimBefore` replaces the deprecated `startFrom`.
- `ZoomTo` honours `durationFrames`; composition duration, fps and size come from the timeline.
- Safe-area overlay is hidden in final renders unless `showInRender` is set.
- Schema rejects scenes with `end <= start` and words ending before they start.
