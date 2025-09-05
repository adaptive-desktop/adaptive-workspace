# CSS Grid-Inspired Interface Update

## What We Changed

### 1. **Updated Core Interfaces** (`src/interfaces/LayoutManager.ts`)

#### **New CSS Grid-Inspired Types:**
```typescript
// CSS Grid coordinate system (0-based like CSS Grid)
interface GridCoordinate {
  row: number;    // 0-based grid line
  column: number; // 0-based grid line
}

// CSS Grid area definition (like grid-area property)
interface GridArea {
  name: string;
  rowStart: number;    // 0-based inclusive
  rowEnd: number;      // 0-based exclusive (CSS Grid style)
  columnStart: number; // 0-based inclusive  
  columnEnd: number;   // 0-based exclusive (CSS Grid style)
}

// Grid dimensions and line counts
interface GridSize {
  rows: number;    // Number of row tracks
  columns: number; // Number of column tracks
}

interface GridLineCount {
  rows: number;    // Number of horizontal grid lines (tracks + 1)
  columns: number; // Number of vertical grid lines (tracks + 1)
}
```

#### **New CSS Grid-Inspired Interface:**
```typescript
interface GridLayoutManager<T> {
  // CSS Grid template introspection
  getGridTemplate(): T[][];           // Like CSS grid-template-areas
  getAreaBounds(areaName: T): GridArea | null;
  getGridLineCount(): GridLineCount;
  
  // CSS Grid line manipulation
  insertGridLine(position: number, direction: 'row' | 'column'): GridLayoutManager<T>;
  removeGridLine(position: number, direction: 'row' | 'column'): GridLayoutManager<T>;
  
  // CSS Grid area operations
  moveArea(areaName: T, newPosition: GridCoordinate): GridLayoutManager<T>;
  swapAreas(area1: T, area2: T): GridLayoutManager<T>;
  spanArea(areaName: T, rowSpan: number, columnSpan: number): GridLayoutManager<T>;
}
```

#### **Clean Greenfield Design:**
- Single `GridLayoutManager<T>` interface - no legacy cruft
- CSS Grid terminology throughout - areas, lines, template, spanning
- 0-based coordinates consistent with CSS Grid and programming conventions

### 2. **Updated Test Structure** (`tests/phase1-basic-operations.test.ts`)

#### **CSS Grid-Inspired Test Class:**
```typescript
class GridLayoutTreeManager implements GridLayoutManager<string> {
  // Implements CSS Grid methods only - clean interface
  // All methods throw "not yet implemented" - ready for TDD
}
```

#### **CSS Grid-Inspired Test Helpers:**
```typescript
function create4x4Grid(): GridLayoutManager<string>
function expectGridTemplateToMatch(grid: GridLayoutManager<string>, expected: string[][])
```

#### **CSS Grid-Inspired Test Cases:**
- Grid template validation (like CSS `grid-template-areas`)
- Grid line counting (tracks vs lines)
- Area coordinate access
- Template immutability
- Grid bounds checking

## Key Benefits of CSS Grid Approach

### 1. **Familiar Mental Model**
- Developers already understand CSS Grid concepts
- Grid lines, grid areas, grid template - all familiar terms
- Expected behaviors are well-documented in CSS Grid spec

### 2. **Clear Terminology**
- **Grid areas** instead of "regions" (more precise)
- **Grid lines** instead of "splits" (clearer concept)
- **Grid template** instead of "layout" (matches CSS)
- **Area spanning** instead of "inter-region operations"

### 3. **Proven Edge Case Handling**
CSS Grid has solved many layout problems we face:
- **Grid line insertion/removal** - how layout reflows
- **Area spanning** - how areas can cover multiple cells
- **Auto-placement** - where new areas go
- **Minimum size constraints** - when operations should fail

### 4. **Better API Design**
- **Grid line operations** - `insertGridLine()`, `removeGridLine()`
- **Area operations** - `moveArea()`, `swapAreas()`, `spanArea()`
- **Template introspection** - `getGridTemplate()`, `getAreaBounds()`
- **Validation methods** - `canInsertGridLine()`, `canRemoveGridLine()`

## Expected Behaviors Based on CSS Grid

### **Grid Line Insertion**
```typescript
test('Insert grid line creates new track', () => {
  // CSS Grid: adding grid line creates new column/row
  const newGrid = grid.insertGridLine(2, 'column'); // Insert after column 1
  
  expect(newGrid.getGridSize()).toEqual({ rows: 4, columns: 5 });
  expect(newGrid.getGridLineCount()).toEqual({ rows: 5, columns: 6 });
});
```

### **Grid Line Removal**
```typescript
test('Remove grid line collapses track', () => {
  // CSS Grid: removing grid line makes other areas expand
  const newGrid = grid.removeGridLine(1, 'column'); // Remove column 1
  
  expect(newGrid.getGridSize()).toEqual({ rows: 4, columns: 3 });
  // Areas B, F, J, N should be removed; others expand
});
```

### **Area Spanning**
```typescript
test('Area can span multiple cells', () => {
  // CSS Grid: area can cover multiple grid cells
  const newGrid = grid.spanArea('A', 2, 2); // A spans 2x2
  
  const bounds = newGrid.getAreaBounds('A');
  expect(bounds).toEqual({
    name: 'A',
    rowStart: 0, rowEnd: 2,
    columnStart: 0, columnEnd: 2
  });
});
```

## Implementation Strategy

### **Phase 1A: Grid Template Foundation**
1. Implement `getGridTemplate()` - return 2D array
2. Implement `getAreaAt()` - coordinate to area lookup
3. Implement `getGridSize()` and `getGridLineCount()`
4. Get basic template tests passing

### **Phase 1B: Grid Line Operations**
1. Implement `insertGridLine()` - add new row/column
2. Implement `removeGridLine()` - remove row/column
3. Handle area repositioning when grid changes
4. Get grid manipulation tests passing

### **Phase 1C: Area Operations**
1. Implement `swapAreas()` - swap two areas
2. Implement `moveArea()` - move area to new position
3. Implement `spanArea()` - area spanning multiple cells
4. Get area manipulation tests passing

## Files Modified

### **Updated:**
- `src/interfaces/LayoutManager.ts` - CSS Grid-inspired interfaces
- `tests/phase1-basic-operations.test.ts` - CSS Grid-inspired tests

### **Next to Modify:**
- `src/LayoutTree.ts` - Add CSS Grid methods
- `src/types.ts` - Add grid-related types if needed

## Key Decisions Made

1. **✅ CSS Grid terminology** - areas, lines, template, spanning
2. **✅ 0-based coordinates** - consistent with CSS Grid and programming
3. **✅ Clean greenfield design** - no backward compatibility cruft
4. **✅ Immutable operations** - all methods return new instances
5. **✅ Grid line vs track distinction** - lines = tracks + 1
6. **✅ Single interface** - `GridLayoutManager<T>` only

## Next Steps

1. **Choose tree construction strategy** for CSS Grid template
2. **Implement coordinate mapping** (row/col → tree path)
3. **Add CSS Grid methods to LayoutTree** 
4. **Run tests and iterate** (make CSS Grid tests pass)

---

**The key insight**: By following CSS Grid patterns, we get a proven, familiar API that developers already understand, with well-defined behaviors for all the edge cases we need to handle.
