# Phase 1 Test Setup - Testing the Right Things

## What We've Done

### 1. **Removed Implementation Code from Tests**
- ✅ Removed `SimpleLayoutManager` implementation from test file
- ✅ Tests now focus on **what** we want, not **how** it works
- ✅ Created proper interfaces in `src/interfaces/LayoutManager.ts`

### 2. **Created Proper Interface Structure**
```
src/interfaces/LayoutManager.ts
├── RegionCoordinate interface
├── GridSize interface  
├── LayoutManager<T> interface
├── LayoutOperation types
├── ExpectedLayoutResult interface
└── LayoutTestScenario interface
```

### 3. **Test-Driven Development Approach**
- Tests define the **expected behavior** first
- Tests will **fail** until we implement the functionality
- Implementation will be driven by making tests pass
- Focus on **layout results**, not tree internals

## What the Tests Define

### **Core Operations We Want:**
1. **getRegionAt(coord)** - Get region at specific coordinate
2. **swapRegions(coord1, coord2)** - Swap two regions
3. **splitRegion(coord, newId, direction)** - Split a region
4. **removeRegion(coord)** - Remove a region
5. **getAllRegions()** - Get all region IDs
6. **getGridSize()** - Get current grid dimensions

### **Test Scenarios:**
- ✅ Initial 4x4 grid validation
- ✅ Region swapping (corner-to-corner, adjacent, diagonal)
- ✅ Region splitting (horizontal and vertical)
- ✅ Region removal (corner, edge, center)
- ✅ Error handling (invalid coordinates, edge cases)
- ✅ Layout immutability (operations return new instances)

## Key Decisions Still Needed

### 1. **Tree Construction Strategy**
**Question**: How do we build a LayoutTree from a 4x4 grid?

**Options**:
- Nested row/column splits (4 rows, each with 4 columns)
- Balanced binary approach (2x2 quadrants, then subdivide)
- Custom hybrid structure

**Current Status**: `buildTreeFromGrid()` throws "not yet implemented"

### 2. **Coordinate-to-Path Mapping**
**Question**: How do we convert `(row, column)` to tree paths?

**Example**: Region F at (1,1) should map to path like `['row1', 'col1']`

**Current Status**: `getRegionAt()` throws "not yet implemented"

### 3. **Grid Dimension Tracking**
**Question**: How do we track and update grid size as operations change the layout?

**Current Status**: `getGridSize()` throws "not yet implemented"

### 4. **Coordinate-Based Operations**
**Question**: How do we implement splitting, removal, and swapping using coordinates?

**Current Status**: All coordinate operations throw "not yet implemented"

## Implementation Strategy

### **Phase 1A: Basic Infrastructure**
1. Implement `buildTreeFromGrid()` - simplest approach first
2. Implement `coordinateToPath()` mapping
3. Implement `getRegionAt()` and `getGridSize()`
4. Get basic validation tests passing

### **Phase 1B: Core Operations**
1. Implement `swapRegions()` - swap panel IDs at two coordinates
2. Implement `splitRegion()` - split a region in specified direction
3. Implement `removeRegion()` - remove region and adjust layout
4. Get all operation tests passing

### **Phase 1C: Error Handling**
1. Add coordinate validation
2. Add edge case handling
3. Add proper error messages
4. Get all error handling tests passing

## Benefits of This Approach

### **1. Clear Requirements**
- Tests define exactly what we want the system to do
- No ambiguity about expected behavior
- Easy to verify when implementation is correct

### **2. Implementation Flexibility**
- Can experiment with different tree structures
- Can optimize later without changing tests
- Tests protect against regressions

### **3. User-Focused Design**
- API is designed around what users need (coordinates)
- Tree complexity is hidden behind simple interface
- Easy to understand and use

### **4. Incremental Development**
- Can implement one method at a time
- Each method can be tested independently
- Clear progress tracking (X of Y tests passing)

## Next Steps

1. **Choose tree construction strategy** (simplest first)
2. **Implement coordinate mapping** (row/col → path)
3. **Add coordinate methods to LayoutTree** (extend existing class)
4. **Run tests and iterate** (make them pass one by one)

## Files Created/Modified

### **New Files:**
- `src/interfaces/LayoutManager.ts` - Core interfaces
- `PHASE1_TEST_SETUP.md` - This documentation

### **Modified Files:**
- `tests/phase1-basic-operations.test.ts` - Clean test definitions
- `TEST_FRAMEWORK_DESIGN.md` - Updated with new approach

### **Files to Modify Next:**
- `src/LayoutTree.ts` - Add coordinate-based methods
- `src/types.ts` - Add coordinate types if needed

---

**The key insight**: We're testing the **layout behavior** users care about, not the **tree implementation** details. This gives us flexibility to implement the tree however works best, while ensuring the user experience is exactly what we want.
