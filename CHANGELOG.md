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

## [0.3.0] - 2025-01-08

### Changed

#### 🔄 Breaking Changes

- **BREAKING: Renamed `updatePosition` to `updateScreenBounds`** - Method name now accurately reflects that it updates both position and size
  - `Workspace.updatePosition(newPosition: ScreenBounds)` → `Workspace.updateScreenBounds(newScreenBounds: ScreenBounds)`
  - Updated parameter name from `newPosition` to `newScreenBounds` for semantic consistency
  - Method functionality remains identical - only naming has changed
  - Updated all tests and documentation to reflect the new naming

#### 📚 Documentation Updates

- Updated Vue.js integration guide examples to use `updateScreenBounds`
- Updated JSDoc comments to clarify that method handles both position and size changes

### Migration Guide

To migrate from v0.2.x to v0.3.0:

```typescript
// Before (v0.2.x)
workspace.updatePosition({ x: 100, y: 100, width: 800, height: 600 });

// After (v0.3.0)
workspace.updateScreenBounds({ x: 100, y: 100, width: 800, height: 600 });
```

## [0.2.1] - 2025-01-07

### Fixed

#### 📚 Documentation Corrections

- **Fixed README.md API Examples** - Corrected all code examples to use actual v0.2.0 API
  - Replaced outdated `layout.insertViewport()` with `workspace.createViewport()`
  - Updated `layout.splitViewport({ row: 0, column: 0 })` to `workspace.splitViewport(viewport, direction)`
  - Fixed coordinate system examples to use viewport IDs and screen bounds
  - Removed references to non-existent tree-based positioning methods

#### 📖 Vue.js Integration Documentation

- **Added Comprehensive Vue Integration Guide** - Complete `VUE_INTEGRATION_GUIDE.md` with:
  - Working Vue component examples with TypeScript support
  - Pinia store integration patterns for state management
  - Custom composables (`useAdaptiveWorkspace`, `useWorkspaceEvents`, `useWorkspaceShortcuts`)
  - Event handling patterns and keyboard shortcuts
  - Responsive design with ResizeObserver integration
  - Error handling and debugging tools
  - Performance optimization techniques
  - Common troubleshooting solutions

- **Updated README.md Vue Section** - Added practical Vue integration examples
  - Basic component setup with reactive state
  - CSS positioning and styling patterns
  - Event handling and method exposure

### Technical Details

- All documentation now accurately reflects the v0.2.0 simplified viewport-based architecture
- Removed confusing references to removed tree-based APIs
- Added 1,500+ lines of Vue-specific integration guidance
- Provided copy-paste ready components and composables

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

[Unreleased]: https://github.com/adaptive-desktop/adaptive-workspace/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/adaptive-desktop/adaptive-workspace/compare/v0.2.1...v0.3.0
[0.2.1]: https://github.com/adaptive-desktop/adaptive-workspace/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/adaptive-desktop/adaptive-workspace/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/adaptive-desktop/adaptive-workspace/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/adaptive-desktop/adaptive-workspace/releases/tag/v0.1.0
