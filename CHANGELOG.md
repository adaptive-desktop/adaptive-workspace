# [0.7.1] - 2025-09-26

### Added
- Utility addition (see commit log for details)

### Fixed
- Bug in WorkspaceContextDetector: context selection now correctly finds the closest aspect ratio (fixes phone/tablet context selection)

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.7.0] - 2025-09-25

### Added
- Workspace state persistence: new APIs and documentation for saving, loading, and migrating workspace layouts and profiles (see `WORKSPACE_PERSISTENCE.md`)
- Documentation and code examples for profile templates and migration strategies

### Changed
- Major expansion and improvement of the test suite: many new and updated tests for workspace, viewport, and context logic
- Improved persistence architecture for snapshots and profiles
- Enhanced documentation for persistence, migration, and integration with frameworks

### Fixed
- Minor test and type issues in viewport and workspace modules

## [0.6.0] - 2025-09-09

### Changed
- Consistent terminology: replaced "panel" with "viewport" across code and docs
- Organized tests: moved Workspace method delegation checks into workspace.unit.test
- Simplified `LayoutManager.findViewportById` (removed redundant falsy guard)

### Removed
- `LayoutManager.hasViewport` (Workspace determines existence via `findViewportById`)
- `panel-api.test.ts` (redundant functionality tests removed; delegation verified in unit tests)

### Added
- Delegation unit tests in Workspace for `minimizeViewport`, `maximizeViewport`, and `restoreViewport`

### Notes
- Viewport state operations (minimize/maximize/restore) are placeholders and currently return `false` without changing state; behavior to be implemented in a future release.

## [0.5.0] - 2025-01-09

### Breaking Changes

#### 🔧 Configurable ID Generator System

- **BREAKING: WorkspaceFactory.create() now requires idGenerator parameter** - Enables React Native compatibility and custom ID generation strategies
  - `WorkspaceFactory.create({ x, y, width, height })` → `WorkspaceFactory.create({ x, y, width, height, idGenerator })`
  - `WorkspaceFactory.createWithViewport({ x, y, width, height })` → `WorkspaceFactory.createWithViewport({ x, y, width, height, idGenerator })`
  - All workspace creation now requires explicit ID generation strategy

- **BREAKING: Workspace constructor now requires idGenerator parameter** - Dependency injection for ID generation throughout the system
  - `new Workspace({ id, screenBounds })` → `new Workspace({ id, screenBounds, idGenerator })`
  - `WorkspaceConfig` interface now includes required `idGenerator: IdGenerator` field

- **BREAKING: LayoutManager constructor now requires idGenerator parameter** - Enables custom viewport ID generation
  - `new LayoutManager()` → `new LayoutManager(idGenerator: IdGenerator)`
  - All viewport creation now uses injected ID generator instead of direct ULID calls

### Added

#### 🆔 ID Generator Architecture

- **IdGenerator Interface** - Clean abstraction for ID generation strategies
  ```typescript
  interface IdGenerator {
    generate(): string;
  }
  ```

- **DefaultUlidGenerator** - Backward-compatible ULID implementation
  ```typescript
  const workspace = WorkspaceFactory.create({
    x: 0, y: 0, width: 1920, height: 1080,
    idGenerator: new DefaultUlidGenerator()
  });
  ```

- **TestIdGenerator** - Predictable ID generation for unit testing
  ```typescript
  const testGenerator = new TestIdGenerator('viewport');
  // Generates: viewport-1, viewport-2, viewport-3, etc.
  ```

#### 🔧 React Native Compatibility

- **Custom ID Generator Support** - Solves React Native PRNG_DETECT errors
  ```typescript
  class ReactNativeIdGenerator implements IdGenerator {
    generate(): string {
      const timestamp = Date.now().toString(16);
      const random = Math.floor(Math.random() * 0x10000).toString(16);
      return `${timestamp}-${random}`;
    }
  }
  ```

- **Framework-Agnostic Design** - Works with any ID generation strategy
- **Zero Breaking Changes for Core Logic** - Only affects ID generation, all other APIs unchanged

#### 📚 Enhanced Documentation

- **Comprehensive README Updates** - Added custom ID generator examples and React Native integration guide
- **API Migration Examples** - Clear before/after code samples for upgrading
- **Custom Generator Patterns** - Best practices for implementing custom ID generators

#### 🧪 Comprehensive Testing

- **131 Tests Passing** - Full test coverage including new ID generator functionality
- **TestIdGenerator Integration** - All existing tests updated to use predictable test IDs
- **Custom Generator Testing** - Validation of different ID generation strategies
- **Integration Test Coverage** - End-to-end testing of dependency injection pattern

### Changed

#### 🏗️ Architecture Improvements

- **Dependency Injection Pattern** - Clean separation of concerns for ID generation
- **Type Safety Enhancements** - Full TypeScript support for all new interfaces
- **Consistent API Design** - All ID generation follows the same pattern throughout the codebase

#### 📖 Documentation Updates

- **Updated All Examples** - README and documentation now show required idGenerator parameter
- **Migration Guide** - Step-by-step instructions for upgrading from v0.4.x
- **React Native Integration** - Detailed examples for React Native compatibility

### Migration Guide

To migrate from v0.4.x to v0.5.0:

#### Basic Usage
```typescript
// Before (v0.4.x)
const workspace = WorkspaceFactory.create({ x: 0, y: 0, width: 1920, height: 1080 });

// After (v0.5.0)
import { WorkspaceFactory, DefaultUlidGenerator } from '@adaptive-desktop/adaptive-workspace';

const workspace = WorkspaceFactory.create({
  x: 0,
  y: 0,
  width: 1920,
  height: 1080,
  idGenerator: new DefaultUlidGenerator()
});
```

#### Direct Workspace Construction
```typescript
// Before (v0.4.x)
const workspace = new Workspace({
  id: 'my-workspace',
  screenBounds: { x: 0, y: 0, width: 800, height: 600 }
});

// After (v0.5.0)
const workspace = new Workspace({
  id: 'my-workspace',
  screenBounds: { x: 0, y: 0, width: 800, height: 600 },
  idGenerator: new DefaultUlidGenerator()
});
```

#### React Native Usage
```typescript
// React Native compatible implementation
import { WorkspaceFactory, IdGenerator } from '@adaptive-desktop/adaptive-workspace';

class ReactNativeIdGenerator implements IdGenerator {
  private counter = 0;
  private timestamp = Date.now();

  generate(): string {
    const now = Date.now();
    if (now !== this.timestamp) {
      this.timestamp = now;
      this.counter = 0;
    }

    const random = Math.floor(Math.random() * 0x10000).toString(16).padStart(4, '0');
    return `${this.timestamp.toString(16)}-${(++this.counter).toString(16).padStart(4, '0')}-${random}`;
  }
}

const workspace = WorkspaceFactory.create({
  x: 0, y: 0, width: 1920, height: 1080,
  idGenerator: new ReactNativeIdGenerator()
});
```

#### Testing
```typescript
// Use TestIdGenerator for predictable test IDs
import { TestIdGenerator } from '@adaptive-desktop/adaptive-workspace';

const testGenerator = new TestIdGenerator('test-viewport');
const workspace = WorkspaceFactory.create({
  x: 0, y: 0, width: 800, height: 600,
  idGenerator: testGenerator
});
// Workspace ID: test-viewport-1
// First viewport ID: test-viewport-2
```

**Key Changes:**
- Add `idGenerator` parameter to all `WorkspaceFactory.create()` calls
- Add `idGenerator` parameter to all `WorkspaceFactory.createWithViewport()` calls
- Add `idGenerator` parameter to direct `Workspace` constructor calls
- Import and use `DefaultUlidGenerator` for backward compatibility
- Use `TestIdGenerator` in unit tests for predictable IDs
- Implement custom `IdGenerator` for React Native compatibility

## [0.4.0] - 2025-01-08

### Breaking Changes

#### 🔄 Consistent ScreenBounds Naming

- **BREAKING: Renamed `Workspace.position` to `Workspace.screenBounds`** - Property name now accurately reflects that it contains both position and size
  - `workspace.position` → `workspace.screenBounds`
  - Updated parameter name in `WorkspaceConfig.position` → `WorkspaceConfig.screenBounds`
  - Method functionality remains identical - only naming has changed

- **BREAKING: Renamed `LayoutManager.setPosition()` to `setScreenBounds()`** - Method name now consistent with property naming
  - `layoutManager.setPosition(bounds)` → `layoutManager.setScreenBounds(bounds)`
  - `LayoutManagerInterface.setPosition()` → `LayoutManagerInterface.setScreenBounds()`
  - Updated parameter name from `position` to `screenBounds` for semantic consistency

#### 🧹 Removed Unused Legacy Interfaces

- **BREAKING: Removed unused `ViewportPosition` interface** - Legacy grid-based interface that was never implemented
- **BREAKING: Removed unused `ViewportBounds` interface** - Legacy grid-based interface that was never implemented
- **BREAKING: Removed generic type parameter from `LayoutManagerInterface<T>`** - Now simply `LayoutManagerInterface`
- **BREAKING: Removed legacy/compatibility methods from `LayoutManagerInterface`:**
  - `getViewportAt()` - Never implemented
  - `getAllViewports()` - Never implemented
  - `getLayoutTemplate()` - Never implemented
  - `getViewportBounds()` - Never implemented
  - `insertViewport()` - Never implemented
  - `isValidPosition()` - Never implemented
  - `getPositionForViewport()` - Never implemented
  - `canSplitViewport()` - Never implemented
  - `canRemoveViewport()` - Never implemented

### Changed

#### 📚 API Consistency Improvements

- **Consistent Terminology**: All properties, methods, and parameters now use "screenBounds" terminology throughout the codebase
- **Better Semantic Clarity**: The naming now clearly indicates these represent both position (x, y) and size (width, height)
- **Simplified Interface**: `LayoutManagerInterface` now only contains methods that are actually implemented and used
- **Improved Developer Experience**: More intuitive and self-documenting API with consistent naming patterns

#### 🔧 Updated Documentation

- Updated all test files to use consistent `screenBounds` terminology
- Updated all JSDoc comments to reflect new naming conventions
- Updated Vue.js integration guide examples
- Updated README examples and documentation

### Migration Guide

To migrate from v0.3.x to v0.4.0:

```typescript
// Before (v0.3.x)
const workspace = new Workspace({
  id: 'my-workspace',
  position: { x: 100, y: 100, width: 800, height: 600 }
});
console.log(workspace.position); // Access position property
layoutManager.setPosition(bounds); // Set layout manager bounds

// After (v0.4.0)
const workspace = new Workspace({
  id: 'my-workspace',
  screenBounds: { x: 100, y: 100, width: 800, height: 600 }
});
console.log(workspace.screenBounds); // Access screenBounds property
layoutManager.setScreenBounds(bounds); // Set layout manager bounds
```

**Factory Methods:**
```typescript
// Before (v0.3.x)
const workspace = WorkspaceFactory.create(position);
const workspaceWithViewport = WorkspaceFactory.createWithViewport(position);

// After (v0.4.0)
const workspace = WorkspaceFactory.create(screenBounds);
const workspaceWithViewport = WorkspaceFactory.createWithViewport(screenBounds);
```

**Key Changes:**
- Replace all `position` property/parameter references with `screenBounds`
- Replace `setPosition()` method calls with `setScreenBounds()`
- Remove any references to unused legacy interfaces (`ViewportPosition`, `ViewportBounds`)
- Update generic type usage: `LayoutManagerInterface<T>` → `LayoutManagerInterface`

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

[Unreleased]: https://github.com/adaptive-desktop/adaptive-workspace/compare/v0.7.0...HEAD
[0.7.0]: https://github.com/adaptive-desktop/adaptive-workspace/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/adaptive-desktop/adaptive-workspace/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/adaptive-desktop/adaptive-workspace/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/adaptive-desktop/adaptive-workspace/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/adaptive-desktop/adaptive-workspace/compare/v0.2.1...v0.3.0
[0.2.1]: https://github.com/adaptive-desktop/adaptive-workspace/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/adaptive-desktop/adaptive-workspace/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/adaptive-desktop/adaptive-workspace/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/adaptive-desktop/adaptive-workspace/releases/tag/v0.1.0
