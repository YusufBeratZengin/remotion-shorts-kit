# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-10-22

### Fixed
- Captions: no CSS transitions (frame-driven pop), end-exclusive word highlight, default `positionBottom` 500 and 180px right margin so captions stay in the safe box.
- Audio and image paths now go through `staticFile()`; `trimBefore` replaces the deprecated `startFrom`.
- `ZoomTo` honours `durationFrames`; composition duration, fps and size come from the timeline.
- Safe-area overlay is hidden in final renders unless `showInRender` is set.
- Schema rejects scenes with `end <= start` and words ending before they start.

### Added
- Core data model and Zod validation schemas (`TimelineSchema`, `SceneSchema`, `WordSchema`, `MascotConfigSchema`, `CaptionStyleSchema`).
- Animated word-level `<Captions>` component with smart 1-2 line splitting, safe-area offset, and active word highlighting.
- Animated SVG `<Mascot>` component featuring original character "Pip" with five poses (`idle`, `talking`, `explaining`, `thinking`, `surprised`) and squash/bounce transitions.
- Visual attention components: `<Callout>`, `<Arrow>`, `<ZoomTo>`, `<ProgressBar>`, and `<SafeAreaOverlay>`.
- Generic `<SceneRenderer>` and `<ExplainerShort>` compositions driven by timeline JSON.
- Comprehensive helper functions: `secondsToFrames`, `framesToSeconds`, `groupWordsIntoBatches`, `getActiveScene`, and easing curve presets.
- Full unit test coverage for pure helper functions and schema parsing via Vitest.
- Complete demo composition explaining "How a Thermos Keeps Tea Hot" (`ThermosExplainer`) with 20-second timeline data.
- Dual-language documentation in English (`README.md`) and Turkish (`README.tr.md`).
- Multi-platform GitHub Actions CI workflow for Linux and Windows across Node.js 20 and 22.
