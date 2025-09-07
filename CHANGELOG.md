# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Nothing yet

### Changed

- Nothing yet

### Deprecated

- Nothing yet

### Removed

- Nothing yet

### Fixed

- Nothing yet

### Security

- Nothing yet

## [0.2.0] - 2025-01-07

### Added

#### 🏗️ Viewport-Based Layout System

- **LayoutManager** - Core viewport management with CRUD operations
  - `createViewport()` - Create new viewports with proportional bounds
  - `splitViewport()` - Split existing viewports in all 4 directions (up/down/left/right)
  - `removeViewport()` - Remove viewports with proper cleanup
  - `findViewportById()` - Lookup viewports by ID with error handling
- **Workspace** - Public API with flexible ID/object parameter support
  - Accepts both viewport objects and string IDs for all operations
  - Automatic ID resolution with proper error handling
  - Clean separation between public API and internal implementation
- **MutableViewport** - Viewport implementation with bounds management
  - Proportional bounds (0.0-1.0) for layout calculations
  - Workspace bounds for coordinate transformations
  - Screen bounds for absolute positioning
- **Comprehensive Testing** - 124 tests passing across all components
  - Unit tests for LayoutManager operations
  - Integration tests for Workspace API
  - Edge case coverage and error handling validation

### Changed

- **Simplified Architecture** - Removed complex binary tree optimization
- **Direct Viewport Management** - Operations work directly on viewport collections
- **Standardized Direction Terminology** - All operations use 'up'|'down'|'left'|'right'

### Removed

- **Binary Tree Implementation** - Removed LayoutTree class and all tree operations
- **Tree Utilities** - Removed path-based navigation and tree manipulation functions
- **Complex Serialization** - Removed tree serialization and deserialization
- **Tree-Related Types** - Removed LayoutDirection, LayoutBranch, LayoutPath, LayoutParent, LayoutNode
- **Obsolete Documentation** - Removed 5 markdown files related to tree implementation

## [0.1.1] - 2025-01-04

### Fixed

- Fixed npm publish issues with yarn-based project
- Updated prepublishOnly script to use yarn commands instead of npm
- Updated GitHub Actions workflow to use 'yarn npm publish' for consistency
- Ensured proper authentication with YARN_NPM_AUTH_TOKEN

## [0.1.0] - 2025-09-03

### Added

#### 🏗️ Core Foundation

- **Feature 1: Core Data Structures** - Basic type system for viewport-based layouts
  - `Dimensions` and `Bounds` interfaces for spatial calculations
  - Framework-agnostic type definitions

#### 📦 Production Features

- **Framework Agnostic** - Zero runtime dependencies (only `tslib`)
- **TypeScript First** - 100% TypeScript with comprehensive type support
- **Developer Experience** - Rich API with excellent IDE support and JSDoc documentation

### Technical Details

- **Package**: `@adaptive-desktop/adaptive-workspace`
- **License**: Apache-2.0
- **Node.js**: Requires 16.9+ (for Corepack support)
- **Package Manager**: Yarn 4.9.0 (managed via Corepack)
- **Build Targets**: CommonJS and ESM modules with TypeScript declarations
- **Test Framework**: Jest with comprehensive coverage reporting

[Unreleased]: https://github.com/adaptive-desktop/adaptive-workspace/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/adaptive-desktop/adaptive-workspace/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/adaptive-desktop/adaptive-workspace/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/adaptive-desktop/adaptive-workspace/releases/tag/v0.1.0
