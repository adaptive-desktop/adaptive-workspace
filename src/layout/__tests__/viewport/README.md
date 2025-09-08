# LayoutManager Viewport Tests

This directory contains comprehensive tests for the LayoutManager's viewport creation and management functionality.

## Test Structure

### Core Testing Requirements

All tests for methods that create viewports must verify:

1. **Returned viewport has correct values**
   - Valid ID generation
   - Correct screen bounds calculation
   - Proper proportional bounds preservation

2. **getViewports() returns the newly created viewport**
   - Viewport is added to the collection
   - All existing viewports remain in collection
   - Correct count is maintained

3. **Other viewports have correct ProportionalBounds**
   - Existing viewports maintain their bounds
   - No unintended modifications to other viewports
   - Proper bounds recalculation on workspace changes

### Test Files

#### `createViewport.test.ts`
Tests for `createViewport()` with no parameters:
- First viewport creation (full workspace bounds)
- Second viewport creation (fallback bounds)
- Multiple viewport creation
- Workspace bounds updates
- Edge cases (zero bounds, negative coordinates)

#### `createViewportWithBounds.test.ts`
Tests for `createViewport(proportionalBounds)` with custom bounds:
- Custom proportional bounds handling
- Edge cases (0,0 and 1,1 bounds)
- Zero-size bounds
- Multiple viewports with different bounds
- Workspace bounds updates with custom proportional bounds
- Mixed creation (with and without bounds)

## Testing Patterns

### Setup
```typescript
let layoutManager: LayoutManager<string>;
const testWorkspaceBounds: ScreenBounds = {
  x: 100, y: 50, width: 1000, height: 800
};

beforeEach(() => {
  layoutManager = new LayoutManager<string>();
  layoutManager.setScreenBounds(testWorkspaceBounds);
});
```

### Viewport Validation
```typescript
// Check viewport properties
expect(viewport.id).toBeDefined();
expect(typeof viewport.id).toBe('string');

// Check screen bounds calculation
expect(viewport.screenBounds).toEqual({
  x: expectedX,
  y: expectedY,
  width: expectedWidth,
  height: expectedHeight,
});

// Check proportional bounds (via type assertion)
const mutableViewport = viewport as any;
expect(mutableViewport.proportionalBounds).toEqual(expectedProportionalBounds);
```

### Collection Validation
```typescript
// Check viewport is added to collection
const allViewports = layoutManager.getViewports();
expect(allViewports).toHaveLength(expectedCount);
expect(allViewports).toContain(viewport);

// Check viewport count
expect(layoutManager.getViewportCount()).toBe(expectedCount);
```

### Bounds Update Validation
```typescript
// Change workspace bounds
const newWorkspaceBounds: ScreenBounds = { /* new bounds */ };
layoutManager.setScreenBounds(newWorkspaceBounds);

// Verify viewport screen bounds recalculate
expect(viewport.screenBounds).toEqual(expectedNewBounds);
```

## Future Test Files

As more viewport creation methods are implemented, add corresponding test files:

- `createAdjacentViewport.test.ts` - Tests for adjacent viewport creation
- `splitViewport.test.ts` - Tests for viewport splitting
- `insertViewport.test.ts` - Tests for viewport insertion
- `removeViewport.test.ts` - Tests for viewport removal
- `swapViewports.test.ts` - Tests for viewport swapping

## Running Tests

```bash
# Run all viewport tests
npm test -- src/layout/__tests__/viewport/

# Run specific test file
npm test -- src/layout/__tests__/viewport/createViewport.test.ts

# Run with coverage
npm run test:coverage -- src/layout/__tests__/viewport/
```

## Test Coverage Goals

- **100% line coverage** for all viewport creation methods
- **100% branch coverage** for all conditional logic
- **Edge case coverage** for boundary conditions
- **Error case coverage** for invalid inputs
- **Integration coverage** for workspace bounds updates
