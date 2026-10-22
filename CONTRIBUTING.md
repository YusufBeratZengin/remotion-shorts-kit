# Contributing to remotion-shorts-kit

Thank you for your interest in contributing to remotion-shorts-kit. This document outlines the process for proposing changes, submitting pull requests, and adhering to development standards.

## Code of Conduct

All contributors and participants are expected to maintain a professional, respectful, and collaborative environment.

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
   npm install
   ```

3. Verify your environment by running tests and lint checks:
   ```bash
   npm run test
   npm run typecheck
   npm run lint
   ```

## Development Scripts

- `npm run studio`: Launches the interactive Remotion Studio (for visual preview).
- `npm run render:demo`: Renders the demo composition to `out/demo.mp4`.
- `npm run test`: Runs unit tests via Vitest.
- `npm run test:watch`: Runs tests in watch mode during development.
- `npm run lint`: Validates code formatting and rules with Biome.
- `npm run lint:fix`: Automatically applies Biome formatting and lint fixes.
- `npm run typecheck`: Runs strict TypeScript compilation checks (`tsc --noEmit`).
- `npm run build`: Compiles TypeScript declarations to `dist/`.

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
