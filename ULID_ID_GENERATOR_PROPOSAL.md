# Proposal: Configurable ID Generator for @adaptive-desktop/adaptive-workspace

## Problem Statement

The current implementation of `@adaptive-desktop/adaptive-workspace` uses the `ulid` library for generating unique identifiers for viewports and other entities. This creates compatibility issues in React Native environments where:

1. The ULID library fails with `PRNG_DETECT` errors on Android due to missing crypto APIs
2. Requires polyfills like `react-native-get-random-values` or `expo-crypto`
3. Adds unnecessary dependencies and bundle size to React Native apps
4. Creates framework-specific compatibility issues

## Current Error

```
ERROR Warning: Unexpected error while loading ./components/WorkspaceView/WorkspaceView.stories.tsx: 
Failed to find a reliable PRNG (PRNG_DETECT)
ULIDError: Failed to find a reliable PRNG (PRNG_DETECT)
```

## Proposed Solution

Make the ID generation strategy configurable by introducing an `IdGenerator` interface that allows framework-specific implementations while maintaining backward compatibility.

### 1. Core Interface Definition

```typescript
// src/types/IdGenerator.ts
export interface IdGenerator {
  generate(): string;
}

export class DefaultUlidGenerator implements IdGenerator {
  generate(): string {
    return ulid(); // Current implementation
  }
}
```

### 2. Updated WorkspaceFactory

```typescript
// src/WorkspaceFactory.ts
export interface WorkspaceConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  idGenerator?: IdGenerator; // New optional parameter
}

export class WorkspaceFactory {
  static create(config: WorkspaceConfig): Workspace {
    const idGenerator = config.idGenerator || new DefaultUlidGenerator();
    return new Workspace({
      ...config,
      idGenerator,
    });
  }
}
```

### 3. Workspace Class Updates

```typescript
// src/Workspace.ts
export class Workspace {
  private idGenerator: IdGenerator;

  constructor(config: WorkspaceConfig & { idGenerator: IdGenerator }) {
    this.idGenerator = config.idGenerator;
    // ... existing constructor logic
  }

  createViewport(): Viewport {
    const id = this.idGenerator.generate();
    // ... rest of viewport creation
  }

  // Update all other methods that generate IDs
}
```

## Framework-Specific Implementations

### React Native Implementation

```typescript
// @adaptive-desktop/react-native/src/utils/ReactNativeIdGenerator.ts
export class ReactNativeIdGenerator implements IdGenerator {
  private counter = 0;
  private timestamp = Date.now();

  generate(): string {
    const now = Date.now();
    if (now !== this.timestamp) {
      this.timestamp = now;
      this.counter = 0;
    }
    
    const random = Math.floor(Math.random() * 1000000).toString(36);
    return `${this.timestamp.toString(36)}-${(++this.counter).toString(36)}-${random}`;
  }
}
```

### React Native Convenience Factory

```typescript
// @adaptive-desktop/react-native/src/utils/WorkspaceFactory.ts
export class WorkspaceFactory {
  static create(config: Omit<WorkspaceConfig, 'idGenerator'>) {
    return CoreWorkspaceFactory.create({
      ...config,
      idGenerator: new ReactNativeIdGenerator(),
    });
  }
}
```

## Benefits

### 1. **Framework Agnostic Core**
- Core library remains independent of any specific ID generation strategy
- No framework-specific dependencies in the core package

### 2. **Backward Compatibility**
- Existing code continues to work without changes
- Default behavior remains identical (uses ULID)

### 3. **React Native Optimization**
- Eliminates need for crypto polyfills
- Reduces bundle size
- Provides native-friendly ID generation

### 4. **Future Extensibility**
- Other framework wrappers can provide optimized generators
- Allows for custom ID strategies (sequential, UUID, etc.)
- Enables testing with predictable IDs

### 5. **Performance Benefits**
- Framework-specific generators can be optimized for their environment
- Removes unnecessary polyfill overhead

## Migration Path

### Phase 1: Core Library Updates
1. Add `IdGenerator` interface to `@adaptive-desktop/adaptive-workspace`
2. Update `WorkspaceFactory` to accept optional `idGenerator`
3. Update `Workspace` class to use injected generator
4. Maintain default ULID behavior for backward compatibility

### Phase 2: Framework Wrapper Updates
1. Implement framework-specific generators in wrapper packages
2. Update wrapper factories to use optimized generators by default
3. Update documentation and examples

### Phase 3: Optional Cleanup
1. Consider making `idGenerator` required in a future major version
2. Move ULID implementation to a separate optional package

## Implementation Requirements

### Core Package Changes
- [ ] Create `IdGenerator` interface
- [ ] Create `DefaultUlidGenerator` class
- [ ] Update `WorkspaceConfig` interface
- [ ] Update `WorkspaceFactory.create()` method
- [ ] Update `Workspace` class constructor and ID generation methods
- [ ] Add unit tests for configurable ID generation
- [ ] Update TypeScript declarations

### Documentation Updates
- [ ] Update API documentation
- [ ] Add migration guide
- [ ] Update examples to show custom ID generators
- [ ] Document framework-specific implementations

## Example Usage

### Current (Backward Compatible)
```typescript
const workspace = WorkspaceFactory.create({
  x: 0, y: 0, width: 800, height: 600
}); // Uses ULID by default
```

### With Custom Generator
```typescript
const workspace = WorkspaceFactory.create({
  x: 0, y: 0, width: 800, height: 600,
  idGenerator: new ReactNativeIdGenerator()
});
```

### Framework Wrapper (React Native)
```typescript
// Uses ReactNativeIdGenerator automatically
const workspace = WorkspaceFactory.create({
  x: 0, y: 0, width: 800, height: 600
});
```

## Testing Strategy

1. **Unit Tests**: Verify ID generator injection works correctly
2. **Integration Tests**: Test with different ID generators
3. **Framework Tests**: Verify React Native compatibility
4. **Backward Compatibility**: Ensure existing code continues to work

## Timeline

- **Week 1**: Core interface and factory updates
- **Week 2**: Workspace class updates and testing
- **Week 3**: Framework wrapper implementations
- **Week 4**: Documentation and examples

This proposal solves the React Native compatibility issue while maintaining the framework-agnostic nature of the core library and providing a foundation for future optimizations across all supported frameworks.