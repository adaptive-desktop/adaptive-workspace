## Release Process

When a new release is requested:

1. **Determine Version Bump:**
   - Find the current version in `package.json`.
   - Compare the current codebase to the last release (current version tag) to summarize changes. Ask the user if they want any changes.
   - Propose a version bump (patch or minor) based on the changes and ask for confirmation.

2. **Update Version:**
   - Update all references to the version in code and documentation (e.g., `package.json`, `README.md`).

3. **Update Changelog:**
   - Check the web for the current date.
   - Add a new entry to `CHANGELOG.md` with the date, new version, and a summary of changes.

4. **Commit and Tag:**
   - Commit all changes with a message like `release: vX.Y.Z`.
   - Create a new git tag for the version and push the tag to GitHub to trigger the publish workflow.

Always confirm the version bump with the user before proceeding with the release steps.

## Committing Code

- All code must pass tests, linting, and formatting before committing.
- Use the following scripts to verify and auto-format:
  - `yarn test` — Run all tests
  - `yarn lint` — Run linter
  - `yarn format:check` — Check code formatting
  - `yarn format` — Auto-format code (run this before committing)
- Only commit code when all checks pass and code is auto-formatted.

## Architecture Overview

- **Core Principle:** This is a framework-agnostic TypeScript library for workspace and viewport layout management. All layout logic is implemented in this package.
- **Key Modules:**
  - `src/workspace/` — Workspace management (see `Workspace.ts`, `WorkspaceFactory.ts`)
  - `src/viewport/` — Viewport logic and types
  - `src/shared/` — Shared utilities and types
- **Entry Point:** Use `WorkspaceFactory` to create and manage workspaces.
- **Type Safety:** All code is TypeScript-first. Types are defined in `src/viewport/types.ts`, `src/workspace/types.ts`, and related files.

## Developer Workflows

- **Build:**
  - Standard: `yarn build` (uses Rollup)
- **Test:**
  - Run all tests: `yarn test` (Jest, high coverage expected)
  - Test files: `*.test.ts` in `src/` and `tests/`
- **Lint/Format:**
  - Lint: `yarn lint` / `yarn lint:fix`
  - Format: `yarn format` / `yarn format:check`
- **Type Check:**
  - Run `yarn type-check` to verify TypeScript types

## Package Management

- This project uses **Yarn 4.9.4**. Use `yarn` commands for all dependency management and scripts.

## Common Yarn Scripts

- `yarn build` — Build the library (Rollup)
- `yarn test` / `yarn test:watch` / `yarn test:coverage` — Run tests, watch mode, or with coverage
- `yarn lint` / `yarn lint:fix` — Lint codebase or auto-fix
- `yarn format` / `yarn format:check` — Format codebase or check formatting
- `yarn type-check` — Run TypeScript type checks


