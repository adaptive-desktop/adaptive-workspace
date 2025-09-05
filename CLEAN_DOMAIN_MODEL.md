# Clean Domain Model - Final Interface Design

## Domain Model Clarification

### **Core Concepts:**
- **Workspace** - The container (React Native component)
- **Layout** - The organization of viewports within a workspace
- **Viewport** - Individual layout areas where panels live
- **Panel** - The "virtual window" component with header bar/menus

### **Implementation Details (Hidden):**
- **LayoutTree** - Binary tree structure (implementation detail)
- **LayoutPath** - Path to tree node (implementation detail)
- **Panels attached to viewports, not tree** ✅

### **Key Relationships:**
- Workspace **contains** a Layout
- Layout **organizes** Viewports
- Viewports **contain** Panels
- LayoutManager **handles** Layout operations

## Final Interface Design

### **Core Types:**
```typescript
// Position within the layout grid
interface ViewportPosition {
  row: number;    // 0-based row position
  column: number; // 0-based column position
}

// Viewport bounds definition
interface ViewportBounds {
  name: string;
  rowStart: number;    // 0-based inclusive
  rowEnd: number;      // 0-based exclusive
  columnStart: number; // 0-based inclusive  
  columnEnd: number;   // 0-based exclusive
}

// Layout dimensions
interface LayoutSize {
  rows: number;    // Number of row tracks
  columns: number; // Number of column tracks
}
```

### **Main Interface:**
```typescript
interface LayoutManager<T> {
  // Viewport query operations
  getViewportAt(position: ViewportPosition): T | null;
  getAllViewports(): T[];
  getViewportCount(): number;
  getLayoutSize(): LayoutSize;

  // Layout introspection
  getLayoutTemplate(): T[][];  // 2D array representation for debugging/testing
  getViewportBounds(panelId: T): ViewportBounds | null;

  // Single viewport operations
  splitViewport(position: ViewportPosition, newPanelId: T, direction: 'horizontal' | 'vertical'): LayoutManager<T>;
  removeViewport(position: ViewportPosition): LayoutManager<T>;  // Adjacent viewports expand proportionally
  swapViewports(panelId1: T, panelId2: T): LayoutManager<T>;     // Clean exchange, no displacement

  // Multi-viewport operations
  insertViewport(viewportPositions: ViewportPosition[], newPanelId: T, direction: 'above' | 'below' | 'left' | 'right'): LayoutManager<T>;

  // Utility operations
  isValidPosition(position: ViewportPosition): boolean;
  getPositionForPanel(panelId: T): ViewportPosition | null;
  canSplitViewport(position: ViewportPosition): boolean;
  canRemoveViewport(position: ViewportPosition): boolean;
}
```

## Operation Categories & Rules

### **Single Viewport Operations:**
- **`splitViewport`** - Split one viewport into two (original content position TBD by implementation)
- **`removeViewport`** - Remove a viewport (adjacent viewports expand proportionally, configurable in future)
- **`swapViewports`** - Swap two panels' positions (clean exchange, no layout changes)

### **Multi-Viewport Operations:**
- **`insertViewport`** - Add new viewport relative to specified range of viewports
  - Range determines span (width/height of new viewport)
  - Direction determines placement (above/below/left/right of range)
  - Handles both full-row/column and partial insertions

### **Query Operations:**
- **`getViewportAt`** - Get panel at specific position
- **`getLayoutTemplate`** - Get 2D array view (for testing/debugging)
- **`getViewportBounds`** - Get viewport's grid bounds
- **`getPositionForPanel`** - Find where a panel is located

## **Operation Examples**

### **`insertViewport` Examples:**

#### **Full Row Insertion:**
```typescript
// Insert above entire row 1: positions [{row:1,col:0}, {row:1,col:1}, {row:1,col:2}]
insertViewport([
  {row: 1, column: 0},
  {row: 1, column: 1},
  {row: 1, column: 2}
], 'X', 'above')

Before:                After:
┌───┬───┬───┐          ┌───┬───┬───┐
│ A │ B │ C │          │ A │ B │ C │
├───┼───┼───┤    →     ├───┼───┼───┤
│ D │ E │ F │          │ X │ X │ X │  ← New full-width row
└───┴───┴───┘          ├───┼───┼───┤
                       │ D │ E │ F │
                       └───┴───┴───┘
```

#### **Partial Range Insertion:**
```typescript
// Insert above just B and E: positions [{row:0,col:1}, {row:1,col:1}]
insertViewport([
  {row: 0, column: 1},
  {row: 1, column: 1}
], 'X', 'above')

Before:                After:
┌───┬───┬───┐          ┌───┬───┬───┐
│ A │ B │ C │          │ A │ X │ C │  ← X spans width of B and E
├───┼───┼───┤    →     ├───┼───┼───┤
│ D │ E │ F │          │ A │ B │ C │  ← Original content shifts
└───┴───┴───┘          ├───┼───┼───┤
                       │ D │ E │ F │
                       └───┴───┴───┘
```

### **Why No `moveViewport`?**

Moving involves displacement complexity:
- What happens to the panel at the target position?
- Do other viewports grow/shrink/move to accommodate?
- Multiple possible behaviors create ambiguity

**Solution:** Use `swapViewports` for clean exchanges, or:
1. `insertViewport` to create space
2. `swapViewports` to move into the new space
3. `removeViewport` to clean up if needed

## Key Design Decisions

### **1. Clean Greenfield Design**
- ✅ No backward compatibility cruft
- ✅ Single `LayoutManager<T>` interface
- ✅ Domain-appropriate terminology

### **2. Domain-Driven Terminology**
- ✅ **Viewport** - clear, abstract, appropriate for layout areas
- ✅ **Workspace** - familiar container concept
- ✅ **Layout** - organization concept
- ✅ **Panel** - content concept

### **3. Operation Naming**
- ✅ **Split** - for single viewport division
- ✅ **Insert** - for multi-viewport operations (unified with range + direction)
- ✅ **Swap** - for clean exchanges (no displacement complexity)
- ✅ **Remove** - with proportional expansion (configurable future)

### **4. Coordinate System**
- ✅ **0-based positioning** - consistent with programming conventions
- ✅ **Row/column coordinates** - intuitive grid positioning
- ✅ **Position-based operations** - easier than path-based

### **5. Immutable Operations**
- ✅ All operations return new `LayoutManager` instances
- ✅ Original layout unchanged
- ✅ Functional programming approach

## Test Structure

### **Test Class:**
```typescript
class LayoutTreeManager implements LayoutManager<string> {
  // All methods throw "not yet implemented" - ready for TDD
  // Clean interface - no legacy methods
}
```

### **Test Helpers:**
```typescript
function create4x4Layout(): LayoutManager<string>
function expectLayoutTemplateToMatch(layout: LayoutManager<string>, expected: string[][])
```

### **Test Categories:**
- ✅ Layout template validation
- ✅ Viewport position access
- ✅ Single viewport operations
- ✅ Multi-viewport operations
- ✅ Error handling
- ✅ Immutability verification

## Implementation Strategy

### **Phase 1A: Basic Infrastructure**
1. Implement `getLayoutTemplate()` - return 2D array
2. Implement `getViewportAt()` - position to panel lookup
3. Implement `getLayoutSize()` - track dimensions
4. Get basic template tests passing

### **Phase 1B: Single Viewport Operations**
1. Implement `splitViewport()` - split one viewport (decide original content position)
2. Implement `removeViewport()` - remove viewport (adjacent expand proportionally)
3. Implement `swapViewports()` - swap two panels (clean exchange)
4. Get single viewport tests passing

### **Phase 1C: Multi-Viewport Operations**
1. Implement `insertViewport()` - unified insertion with range + direction
2. Handle full-row/column cases (entire row/column in range)
3. Handle partial range cases (subset of viewports)
4. Get multi-viewport tests passing

## Files Structure

### **Interfaces:**
- `src/interfaces/LayoutManager.ts` - Clean domain interfaces

### **Tests:**
- `tests/phase1-basic-operations.test.ts` - Viewport layout tests

### **Implementation (Next):**
- `src/LayoutTree.ts` - Add viewport-based methods
- `src/LayoutManager.ts` - Main implementation class

## Benefits of This Design

### **1. Clear Domain Model**
- Terminology matches the problem domain
- No confusion between implementation and interface
- Easy to understand and explain

### **2. Flexible Implementation**
- Binary tree is hidden implementation detail
- Can experiment with different tree structures
- Interface protects against implementation changes

### **3. User-Focused API**
- Operations match what users want to do
- Position-based coordinates are intuitive
- Multi-viewport operations handle complex cases

### **4. Test-Driven Development**
- Tests define expected behavior first
- Implementation driven by making tests pass
- Clear success criteria for each phase

---

**The key insight**: By focusing on our domain (workspace layouts with viewports) rather than implementation details (binary trees) or external analogies (CSS Grid), we get a clean, intuitive API that matches what users actually want to do.
