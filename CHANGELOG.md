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

## [0.1.1] - 2025-01-04

### Fixed
- Fixed npm publish issues with yarn-based project
- Updated prepublishOnly script to use yarn commands instead of npm
- Updated GitHub Actions workflow to use 'yarn npm publish' for consistency
- Ensured proper authentication with YARN_NPM_AUTH_TOKEN

## [0.1.0] - 2025-09-03

### Added

#### 🏗️ Core Foundation
- **Feature 1: Core Data Structures** - Complete type system and LayoutTree class
  - `PanelId`, `LayoutDirection`, `LayoutBranch`, `LayoutPath` type definitions
  - `LayoutParent<T>` and `LayoutNode<T>` with full generic support
  - `LayoutTree<T>` class with immutable operations
  - Basic tree operations: `getRoot()`, `isEmpty()`, `copy()`, `equals()`

#### 🔧 Tree Utilities
- **Feature 2: Tree Utilities** - Essential tree manipulation functions
  - `isParent()` type guard with TypeScript narrowing
  - `getLeaves()` for extracting all panel IDs
  - `getNodeAtPath()` for tree navigation with path validation
  - `getOtherBranch()` and `getOtherDirection()` helper functions
  - `isValidSplitPercentage()` and `normalizeSplitPercentage()` utilities

#### ⚡ Tree Operations
- **Feature 3: Tree Operations** - Advanced tree manipulation
  - `splitRegion(path, newPanelId, direction)` for creating new splits
  - `removeRegion(path)` for removing nodes and promoting siblings
  - `resizeRegion(path, percentage)` for updating split percentages
  - Private `replaceNodeAtPath()` helper for immutable updates
  - Full error handling with descriptive error messages

#### 🧭 Path Navigation
- **Feature 4: Path Navigation** - Advanced panel location and tree analysis
  - `findPanelPath(panelId)` for locating panels in the tree
  - `getAndAssertNodeAtPathExists(path)` for safe navigation
  - `createBalancedTreeFromLeaves(panels)` for generating balanced trees
  - `isValidPath()`, `getAllPaths()`, `getTreeDepth()` utilities
  - Extended LayoutTree methods: `getPanelIds()`, `hasPanel()`, `getDepth()`, etc.

#### 💾 Serialization
- **Feature 5: Serialization** - Complete JSON persistence support
  - `serializeLayoutTree()` and `deserializeLayoutTree()` with validation
  - `isValidSerializedTree()` for data validation
  - `cloneLayoutTree()` for deep cloning via serialization
  - Version-aware format with `SERIALIZATION_VERSION` constant
  - LayoutTree methods: `serialize()`, `deserialize()`, `clone()`, `toJSON()`, `fromJSON()`

#### 🧪 Comprehensive Testing
- **236 total tests** across 5 test suites with **98.67% code coverage**
- Complete edge case coverage and error handling validation
- Support for both string and number panel IDs
- Round-trip serialization preservation testing

#### 📦 Production Features
- **Framework Agnostic** - Zero runtime dependencies (only `tslib`)
- **TypeScript First** - 100% TypeScript with comprehensive generic support
- **Immutable Operations** - All tree modifications return new instances
- **Performance Optimized** - Efficient algorithms with structural sharing
- **Developer Experience** - Rich API with excellent IDE support and JSDoc documentation

### Technical Details

- **Package**: `@adaptive-desktop/binary-layout-tree`
- **License**: Apache-2.0
- **Node.js**: Requires 16.9+ (for Corepack support)
- **Package Manager**: Yarn 4.9.0 (managed via Corepack)
- **Build Targets**: CommonJS and ESM modules with TypeScript declarations
- **Test Framework**: Jest with comprehensive coverage reporting

### Architecture

This library serves as the core foundation in a three-tier architecture:

```
Application Layer (React, Vue, Angular Components)
        ↓
Framework Layer (@adaptive-desktop/react, etc.)
        ↓
Core Layer (@adaptive-desktop/binary-layout-tree) ← This Package
```

[Unreleased]: https://github.com/adaptive-desktop/binary-layout-tree/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/adaptive-desktop/binary-layout-tree/releases/tag/v0.1.0
