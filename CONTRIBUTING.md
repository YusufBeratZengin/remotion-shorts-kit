# Contributing to remotion-shorts-kit

Thank you for your interest in contributing to remotion-shorts-kit. This document outlines the process for proposing changes, submitting pull requests, and adhering to development standards.

## Code of Conduct

Read the [Contributor Covenant 2.1 Code of Conduct](CODE_OF_CONDUCT.md).

## Development Setup

### Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0

### Getting Started

1. Fork and clone the repository:
   ```bash
   git clone https://github.com/YusufBeratZengin/remotion-shorts-kit.git
   cd remotion-shorts-kit
   ```

2. Install dependencies:
   ```bash
   npm ci
   ```

3. Verify your environment by running tests and lint checks:
   ```bash
   npm run test
   npm run typecheck
   npm run lint
   npm run build
   ```

## Development Scripts

- `npm run studio`: Launches the interactive Remotion Studio (for visual preview).
- `npm run render:demo`: Renders the demo composition to `out/demo.mp4`.
- `npm run render:example2`: Renders the 15-second siphon example to `out/siphon.mp4`.
- `npm run test`: Builds the library, runs tests, and prints V8 coverage via Vitest.
- `npm run test:watch`: Runs tests in watch mode during development.
- `npm run lint`: Validates code formatting and rules with Biome.
- `npm run lint:fix`: Automatically applies Biome formatting and lint fixes.
- `npm run typecheck`: Runs strict TypeScript compilation checks (`tsc --noEmit`).
- `npm run build`: Compiles ESM JavaScript and TypeScript declarations to `dist/`.
- `npm run docs:demo`: Builds the library and refreshes `docs/demo.svg` from actual CLI output. CI checks for drift.

Coverage reports track helpers and the timeline schema: at least 85% lines/statements
and 80% branches/functions per file. HTML and JSON reports are written to `coverage/`.

## Architecture & Component Guidelines

1. **Schema Validation**: All timeline data structures must be defined and validated using Zod in `src/schema.ts`.
2. **Pure Logic**: Helpers (time conversion, line breaking, scene lookup, easing) must remain pure functions located in `src/helpers/` with corresponding unit tests in `tests/`.
3. **Animations**: Use Remotion's deterministic animation primitives (`useCurrentFrame`, `interpolate`, `spring`) rather than CSS keyframes or non-deterministic timers.
4. **Vertical Resolution**: Default dimensions are 1080x1920 (9:16 aspect ratio). UI components must respect safe areas.

## Commit Conventions

Commits must follow the Conventional Commits specification:

- `feat: <description>`: Introduces a new feature or component.
- `fix: <description>`: Resolves a bug.
- `test: <description>`: Adds or updates tests.
- `docs: <description>`: Documentation changes only.
- `refactor: <description>`: Code changes that neither fix a bug nor add a feature.
- `chore: <description>`: Build process, tooling, or dependency updates.

Keep commit messages concise, descriptive, and written in English.

## Pull Request Checklist

Before opening a pull request, ensure that:

- All unit tests pass: `npm run test`
- Type checking passes without warnings: `npm run typecheck`
- Biome lint checks pass: `npm run lint`
- New features or helpers include corresponding tests in `tests/`
- Build and package checks pass: `npm run build` and `npm pack --dry-run`
- README.md and README.tr.md describe the same behavior in natural English/Turkish
- CHANGELOG.md lists user-facing changes under Unreleased

## Library and Starter Entrypoints

`src/index.ts` registers `RemotionRoot` for Studio/CLI. `src/library.ts` exports
components, helpers, compositions, and schema without registering anything.
The library build uses NodeNext resolution, so relative imports in `src/` use
`.js` extensions even when the source is TypeScript. Keep component props and
timeline JSON changes additive. `remotion.config.ts` maps those extensions back
to TypeScript for the starter's webpack bundle; retain that override.

`TimelineSchema.parse` / `parseTimeline` are the throwing parsers.
`validateTimeline` reports `{ ok, errors }` with JSON paths and includes `data`
on success; callers that previously used its parsed return value should use
`parseTimeline` instead. `safeParseTimeline` retains its Zod result shape.

## Render and Preview Checks

Run the still command and inspect both example compositions before releasing:

```bash
npx remotion still src/index.ts ThermosExplainer out/still.png --frame=60
npx remotion compositions src/index.ts
```

Measure `npm run render:demo` before and after performance changes on the same
machine, with the same browser, concurrency, and cache conditions. Include both
successful wall-clock timings in the maintainer's commit message. Failed renders
are not performance measurements.

To refresh the README preview from a successful local demo render, use ffmpeg:

```bash
ffmpeg -y -ss 0 -t 7 -i out/demo.mp4 -filter_complex "[0:v]scale=540:960:flags=lanczos,split[a][b];[a]palettegen=max_colors=64[p];[b][p]paletteuse=dither=bayer:bayer_scale=3" -r 10 docs/demo.gif
```

Verify the GIF is 540×960, 6–8 seconds, and no larger than 3 MB. The GIF and SVG
previews in `docs/` are versioned; MP4s and still frames stay in ignored `out/`.

## Releasing

The maintainer publishes releases. The [publish workflow](.github/workflows/publish.yml)
runs on `v*.*.*` tags, checks lint, typecheck, coverage tests, and build, rejects
a tag that differs from `package.json`, and publishes publicly with provenance.

Before the first automated release, configure npm's trusted publisher for:

- Organization/user: `YusufBeratZengin`
- Repository: `remotion-shorts-kit`
- Workflow filename: `publish.yml`
- GitHub environment: `npm` (create the matching environment)
- Allowed action: direct `npm publish`

Use GitHub-hosted runners, Node 24, and npm >=11.5.1, as required by
[npm trusted publishing](https://docs.npmjs.com/trusted-publishers/).
The workflow grants `id-token: write`; no npm token is stored. If npm requires
an initial manual publication before configuring this package's publisher,
the maintainer must bootstrap it using their own authenticated npm session.
If trusted publishing is unavailable, a maintainer may explicitly configure a
granular `NPM_TOKEN` secret as `NODE_AUTH_TOKEN`; that fallback is not enabled
in this repository.

Release procedure:

1. Move Unreleased notes into a dated version section and bump the SemVer
   version in `package.json` and `package-lock.json`. Keep 0.x until the API has
   been stable in at least two real uses; breaking 0.x changes bump the minor.
2. Run lint, typecheck, coverage tests, build, both renders, and package checks.
3. Run `npx publint`, `npx @arethetypeswrong/cli --pack`, and
   `npm publish --dry-run --provenance=false`. The local dry-run disables only
   attestation generation; the real release always enables provenance.
4. Commit as `chore(release): vX.Y.Z`, including before/after render timings when
   applicable. Create the matching `vX.Y.Z` tag.
5. The maintainer pushes the approved commit and tag; the tag triggers publishing.

Do not publish directly from a development branch or store credentials in files.
