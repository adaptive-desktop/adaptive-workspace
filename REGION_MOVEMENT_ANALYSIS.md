# Binary Layout Tree: Region Management Analysis

## Initial Setup: Workspace Coordinate System

```
Screen Layout (Visual):
┌─────────────────────────┐
│         1a    │    1b   │  ← Row 1
├─────────────────────────┤
│         2a    │    2b   │  ← Row 2
└─────────────────────────┘
    Column a   Column b
```

## Sequential Region Addition

### Step 1: Add Region 1a (First Region)
**Visual Result:**
```
┌─────────────────────────┐
│           1a            │
└─────────────────────────┘
```

**Binary Tree:**
```
Root: "1a"
```

**Explanation:** Single panel takes entire workspace. Tree is just a leaf node.

---

### Step 2: Add Region 1b (Horizontal Split)
**Visual Result:**
```
┌─────────────┬───────────┐
│     1a      │    1b     │
└─────────────┴───────────┘
```

**Binary Tree:**
```
Root: {
  direction: 'row',
  leading: "1a",
  trailing: "1b",
  splitPercentage: 50
}
```

**Explanation:** Horizontal split creates two side-by-side regions. Row direction means left/right split.

---

### Step 3: Add Region 2a (Vertical Split of Workspace)
**Visual Result:**
```
┌─────────────┬───────────┐
│     1a      │    1b     │  ← Top half
├─────────────┴───────────┤
│           2a            │  ← Bottom half
└─────────────────────────┘
```

**Binary Tree:**
```
Root: {
  direction: 'column',
  leading: {
    direction: 'row',
    leading: "1a",
    trailing: "1b",
    splitPercentage: 50
  },
  trailing: "2a",
  splitPercentage: 50
}
```

**Explanation:** We need to group the existing horizontal split (1a|1b) as the top half, then add 2a as the bottom half. This requires restructuring the tree.

---

### Step 4: Add Region 2b (Complete 2x2 Grid)
**Visual Result:**
```
┌─────────────┬───────────┐
│     1a      │    1b     │
├─────────────┼───────────┤
│     2a      │    2b     │
└─────────────┴───────────┘
```

**Binary Tree:**
```
Root: {
  direction: 'column',
  leading: {
    direction: 'row',
    leading: "1a",
    trailing: "1b",
    splitPercentage: 50
  },
  trailing: {
    direction: 'row',
    leading: "2a",
    trailing: "2b",
    splitPercentage: 50
  },
  splitPercentage: 50
}
```

**Explanation:** Bottom half (2a) gets split horizontally to accommodate 2b.

---

## Alternative Sequence: Starting with 2b, then adding 2a

### Step 1: Add Region 2b
```
┌─────────────────────────┐
│           2b            │
└─────────────────────────┘

Tree: "2b"
```

### Step 2: Add Region 2a
```
┌─────────────┬───────────┐
│     2a      │    2b     │
└─────────────┴───────────┘

Tree: {
  direction: 'row',
  leading: "2a",
  trailing: "2b",
  splitPercentage: 50
}
```

**Key Insight:** The order of addition affects the tree structure, but the final visual layout depends on where we choose to place new regions, not just the addition order.

---

## Panel Movement Analysis

For movement operations, we need to distinguish between:
1. **Swapping panels** (1a ↔ 1b)
2. **Moving to adjacent regions** (1a → 2a)
3. **Moving to diagonal regions** (1a → 2b)

### Case 1: Move 1a to 1b (Horizontal Swap)
**Before:**
```
┌─────────────┬───────────┐
│     1a      │    1b     │
├─────────────┼───────────┤
│     2a      │    2b     │
└─────────────┴───────────┘
```

**After:**
```
┌─────────────┬───────────┐
│     1b      │    1a     │
├─────────────┼───────────┤
│     2a      │    2b     │
└─────────────┴───────────┘
```

**Tree Operation:** Simple swap of `leading` and `trailing` in the top row node.

```javascript
// Before
root.leading.leading = "1a"
root.leading.trailing = "1b"

// After  
root.leading.leading = "1b"
root.leading.trailing = "1a"
```

---

### Case 2: Move 1a to 2a (Vertical Swap)
**Before:**
```
┌─────────────┬───────────┐
│     1a      │    1b     │
├─────────────┼───────────┤
│     2a      │    2b     │
└─────────────┴───────────┘
```

**After:**
```
┌─────────────┬───────────┐
│     2a      │    1b     │
├─────────────┼───────────┤
│     1a      │    2b     │
└─────────────┴───────────┘
```

**Tree Operation:** Swap across different subtrees.

```javascript
// Before
root.leading.leading = "1a"    // Top-left
root.trailing.leading = "2a"   // Bottom-left

// After
root.leading.leading = "2a"    // Top-left
root.trailing.leading = "1a"   // Bottom-left
```

---

### Case 3: Move 1a to 2b (Diagonal Swap)
**Before:**
```
┌─────────────┬───────────┐
│     1a      │    1b     │
├─────────────┼───────────┤
│     2a      │    2b     │
└─────────────┴───────────┘
```

**After:**
```
┌─────────────┬───────────┐
│     2b      │    1b     │
├─────────────┼───────────┤
│     2a      │    1a     │
└─────────────┴───────────┘
```

**Tree Operation:** Swap across different subtrees and branches.

```javascript
// Before
root.leading.leading = "1a"     // Top-left
root.trailing.trailing = "2b"   // Bottom-right

// After
root.leading.leading = "2b"     // Top-left  
root.trailing.trailing = "1a"   // Bottom-right
```

---

## Remaining Movement Cases

### Case 4: Move 1b to 1a (Horizontal Swap - Reverse)
Same as Case 1, but reversed. Simple swap within the same row node.

### Case 5: Move 1b to 2a (Cross-Diagonal)
**Before:** 1b (top-right) → 2a (bottom-left)
**Tree Operation:** Swap `root.leading.trailing` with `root.trailing.leading`

### Case 6: Move 1b to 2b (Vertical Swap)
**Before:** 1b (top-right) → 2b (bottom-right)  
**Tree Operation:** Swap `root.leading.trailing` with `root.trailing.trailing`

### Case 7: Move 2a to 1b (Cross-Diagonal - Reverse)
Same as Case 5, but reversed.

### Case 8: Move 2a to 1a (Vertical Swap - Reverse)
Same as Case 2, but reversed.

### Case 9: Move 2a to 2b (Horizontal Swap in Bottom Row)
**Tree Operation:** Simple swap within the bottom row node.

---

## Key Insights and Problems with Current Implementation

### Problem 1: Path Invalidation
The current `movePanel` implementation:
1. Removes panel from source (changes tree structure)
2. Tries to insert at target path (path may no longer exist)

**Example:** Moving 1a to 1b in a simple 2-panel layout:
```javascript
// Initial tree
{ direction: 'row', leading: "1a", trailing: "1b" }

// Step 1: Remove 1a -> tree becomes just "1b"
"1b"

// Step 2: Try to insert 1a at path ['trailing'] -> FAILS!
// Path ['trailing'] doesn't exist on leaf node "1b"
```

### Problem 2: Conceptual Mismatch
We're thinking of "moving panels" but we should be thinking of "swapping panel assignments to regions."

### Problem 3: Insert Positions Don't Map to Grid Positions
The `before`/`after`/`replace` positions don't clearly map to grid-based movements like "move to adjacent region."

---

## Proposed Solution: Region-Based Movement

Instead of path-based movement, we should use region-based movement:

```typescript
interface RegionMovement {
  sourceRegion: RegionCoordinate;
  targetRegion: RegionCoordinate;
  operation: 'swap' | 'replace' | 'insert';
}

interface RegionCoordinate {
  row: number;
  column: number;
}
```

**Benefits:**
1. **Stable coordinates** - regions don't change during movement
2. **Clear semantics** - "move panel from region (1,1) to region (2,1)"
3. **Atomic operations** - calculate final tree state directly
4. **Grid-aware** - understands spatial relationships

**Example:**
```javascript
// Move 1a to 2b
movePanel({
  sourceRegion: { row: 1, column: 1 },  // 1a
  targetRegion: { row: 2, column: 2 },  // 2b  
  operation: 'swap'
});
```

This approach would:
1. Identify the panels at both regions
2. Calculate the final tree structure with swapped panels
3. Return the new tree in one atomic operation

---

## Complex Layout Example: Alphabetical Addition

Starting with 0 regions and adding regions a, b, c, d, e in alphabetical order to achieve:

```
┌─────────────┬───────────┬───┐
│     a       │     c     │   │
├─────────────┼───────────┤ b │
│     e       │    d      │   │
└─────────────┴───────────┴───┘
```

### Step 1: Add Region 'a' (First Region)
**Visual Result:**
```
┌─────────────────────────────┐
│              a              │
└─────────────────────────────┘
```

**Binary Tree:**
```
Root: "a"
```

---

### Step 2: Add Region 'b' (Vertical Split - Right Side)
**Visual Result:**
```
┌─────────────────────┬───────┐
│          a          │   b   │
└─────────────────────┴───────┘
```

**Binary Tree:**
```
Root: {
  direction: 'row',
  leading: "a",
  trailing: "b",
  splitPercentage: 75  // 'a' takes 3/4, 'b' takes 1/4
}
```

---

### Step 3: Add Region 'c' (Split 'a' Horizontally)
**Visual Result:**
```
┌─────────────┬───────────┬───┐
│      a      │     c     │   │
│             │           │ b │
│             │           │   │
└─────────────┴───────────┴───┘
```

**Binary Tree:**
```
Root: {
  direction: 'row',
  leading: {
    direction: 'row',
    leading: "a",
    trailing: "c",
    splitPercentage: 50
  },
  trailing: "b",
  splitPercentage: 75
}
```

---

### Step 4: Add Region 'd' (Split Left Section Vertically)
**Visual Result:**
```
┌─────────────┬───────────┬───┐
│      a      │     c     │   │
├─────────────┴───────────┤ b │
│            d            │   │
└─────────────────────────┴───┘
```

**Binary Tree:**
```
Root: {
  direction: 'row',
  leading: {
    direction: 'column',
    leading: {
      direction: 'row',
      leading: "a",
      trailing: "c",
      splitPercentage: 50
    },
    trailing: "d",
    splitPercentage: 50
  },
  trailing: "b",
  splitPercentage: 75
}
```

---

### Step 5: Add Region 'e' (Split Bottom Section Horizontally)
**Visual Result:**
```
┌─────────────┬───────────┬───┐
│      a      │     c     │   │
├─────────────┼───────────┤ b │
│      e      │     d     │   │
└─────────────┴───────────┴───┘
```

**Binary Tree:**
```
Root: {
  direction: 'row',
  leading: {
    direction: 'column',
    leading: {
      direction: 'row',
      leading: "a",
      trailing: "c",
      splitPercentage: 50
    },
    trailing: {
      direction: 'row',
      leading: "e",
      trailing: "d",
      splitPercentage: 50
    },
    splitPercentage: 50
  },
  trailing: "b",
  splitPercentage: 75
}
```

---

### Step 6: Add Region 'f' (Split 'b' Vertically)
**Visual Result:**
```
┌─────────────┬───────────┬───┐
│      a      │     c     │ f │
├─────────────┼───────────┼───┤
│      e      │     d     │ b │
└─────────────┴───────────┴───┘
```

**Binary Tree:**
```
Root: {
  direction: 'row',
  leading: {
    direction: 'column',
    leading: {
      direction: 'row',
      leading: "a",
      trailing: "c",
      splitPercentage: 50
    },
    trailing: {
      direction: 'row',
      leading: "e",
      trailing: "d",
      splitPercentage: 50
    },
    splitPercentage: 50
  },
  trailing: {
    direction: 'column',
    leading: "f",
    trailing: "b",
    splitPercentage: 50
  },
  splitPercentage: 75
}
```

---

### Step 7: Add Region 'g' (Top Strip Across Full Width)
**Visual Result:**
```
┌─────────────────────────────┐
│        g (10% height)       │
├─────────────┬───────────┬───┤
│      a      │     c     │ f │
├─────────────┼───────────┼───┤
│      e      │     d     │ b │
└─────────────┴───────────┴───┘
```

**Binary Tree:**
```
Root: {
  direction: 'column',
  leading: "g",
  trailing: {
    direction: 'row',
    leading: {
      direction: 'column',
      leading: {
        direction: 'row',
        leading: "a",
        trailing: "c",
        splitPercentage: 50
      },
      trailing: {
        direction: 'row',
        leading: "e",
        trailing: "d",
        splitPercentage: 50
      },
      splitPercentage: 50
    },
    trailing: {
      direction: 'column',
      leading: "f",
      trailing: "b",
      splitPercentage: 50
    },
    splitPercentage: 75
  },
  splitPercentage: 10
}
```

**Key Observations:**
1. **Asymmetric layouts** require careful tree structuring
2. **Region 'b' spans two rows** - achieved by making it a sibling to the entire left section
3. **The tree depth varies** - some panels are deeper in the tree than others
4. **Split percentages matter** - 75/25 split gives 'b' the right proportion
5. **Intermediate restructuring** may be needed as regions are added
6. **Full-width strips** require restructuring the entire tree - 'g' becomes the new root's leading child
7. **Tree depth increases** - adding 'g' pushes all other regions one level deeper

---

## Locked Region Example: Same Progression with 'b' Locked

Starting from Step 5 (a, b, c, d, e layout) but with region 'b' locked, preventing it from being split:

### Step 5 (Baseline): Layout with 'b' Locked
**Visual Result:**
```
┌─────────────┬───────────┬───┐
│      a      │     c     │   │
├─────────────┼───────────┤ b │ ← LOCKED
│      e      │     d     │   │
└─────────────┴───────────┴───┘
```

**Binary Tree:**
```
Root: {
  direction: 'row',
  leading: {
    direction: 'column',
    leading: {
      direction: 'row',
      leading: "a",
      trailing: "c",
      splitPercentage: 50
    },
    trailing: {
      direction: 'row',
      leading: "e",
      trailing: "d",
      splitPercentage: 50
    },
    splitPercentage: 50
  },
  trailing: "b",
  splitPercentage: 75,
  constraints: {
    trailing: { locked: true }  // 'b' is locked
  }
}
```

---

### Step 6: Attempt to Add Region 'f' (BLOCKED)
**Result:** Cannot split region 'b' because it is locked. Step 6 is skipped.

---

### Step 7: Add Region 'g' (Partial Width Strip)
**Visual Result:**
```
┌─────────────────────────┬───┐
│      g (10% height)     │   │
├─────────────┬───────────┤ b │
│      a      │     c     │   │ ← 'b' maintains full height
├─────────────┼───────────┤   │
│      e      │     d     │   │
└─────────────┴───────────┴───┘
```

**Binary Tree:**
```
Root: {
  direction: 'row',
  leading: {
    direction: 'column',
    leading: "g",
    trailing: {
      direction: 'column',
      leading: {
        direction: 'row',
        leading: "a",
        trailing: "c",
        splitPercentage: 50
      },
      trailing: {
        direction: 'row',
        leading: "e",
        trailing: "d",
        splitPercentage: 50
      },
      splitPercentage: 45/90  // ~50% of remaining 90% height
    },
    splitPercentage: 10
  },
  trailing: "b",
  splitPercentage: 75,
  constraints: {
    trailing: { locked: true }
  }
}
```

**Key Changes with Locked Region:**
1. **'f' cannot be added** - locked regions cannot be split
2. **'g' spans partial width** - only covers the unlocked left section (a+c width)
3. **Height redistribution** - regions a, c, e, d each lose 5% height to accommodate 'g'
4. **'b' maintains dimensions** - locked region keeps its full height and width
5. **Asymmetric top strip** - 'g' doesn't span full width due to locked constraint

**Split Percentage Calculations:**
- Left section: 75% width (unchanged)
- Right section ('b'): 25% width (unchanged, locked)
- Within left section:
  - 'g': 10% of total height
  - Remaining content: 90% of total height
  - a, c, e, d regions: Each gets 45% of remaining height (90% ÷ 2 = 45%)

---

## Split Operation Types and Rules

Based on the examples above, we can identify two fundamentally different types of split operations:

### 1. **Intra-Region Split** (Split within a region)
- **Definition**: Split a single existing region into two parts
- **Example**: Region 'a' splits horizontally to create 'a' (top) and 'c' (bottom)
- **Visual**:
```
┌──────────┬───┐    →    ┌──────────┬───┐
│          │   │         │     a    │   │
│     a    │ b │         ├──────────┤ b │
│          │   │         │     c    │   │
└──────────┴───┘         └──────────┴───┘
```

**Tree Progression:**
```javascript
// Before: 'a' is a leaf node
{
  direction: 'row',
  leading: "a",           // Leaf node
  trailing: "b",
  splitPercentage: 75
}

// After: 'a' becomes parent node with two children
{
  direction: 'row',
  leading: {
    direction: 'column',  // New parent node replaces leaf
    leading: "a",         // Original region (top)
    trailing: "c",        // New region (bottom)
    splitPercentage: 50
  },
  trailing: "b",          // Unchanged
  splitPercentage: 75     // Unchanged
}
```

### 2. **Inter-Region Split** (Split across regions)
- **Definition**: Add a new region that spans across multiple existing regions
- **Example**: Add 'c' as a full-width strip below regions 'a' and 'b'
- **Visual**:
```
┌──────────┬───┐    →    ┌─────────────────┐
│          │   │         │        a        │
│     a    │ b │         ├─────────────────┤
│          │   │         │        b        │
└──────────┴───┘         ├─────────────────┤
                         │        c        │
                         └─────────────────┘
```

**Tree Progression:**
```javascript
// Before: Simple row split
{
  direction: 'row',
  leading: "a",
  trailing: "b",
  splitPercentage: 75
}

// After: Previous tree becomes child of new root
{
  direction: 'column',    // New root direction
  leading: {              // Previous entire tree becomes leading
    direction: 'row',
    leading: "a",
    trailing: "b",
    splitPercentage: 75
  },
  trailing: "c",          // New region spans full width
  splitPercentage: 67     // Adjust for new region height
}
```

---

## Split Operation Rules

### Intra-Region Split Rules:
1. **Target**: Single region only
2. **Constraints**: Target region must not be locked
3. **Impact**: Only affects the target region's dimensions
4. **Tree Depth**: Increases by 1 at the target location
5. **Siblings**: Unaffected by the operation
6. **Tree Operation**: Replace leaf node with parent node containing two children

### Inter-Region Split Rules:
1. **Target**: Multiple regions (2, some, or all)
2. **Constraints**: All affected regions must not be locked
3. **Impact**: All affected regions resize to accommodate new region
4. **Tree Depth**: May increase globally (especially in new root scenarios)
5. **Tree Operation**: Often requires restructuring entire tree hierarchy

---

## Split Classification System

### By Direction:
- **Horizontal Split**: Creates top/bottom regions (uses column direction in tree)
- **Vertical Split**: Creates left/right regions (uses row direction in tree)

### By Scope:
- **Local Split**: Intra-region (affects one region only)
- **Regional Split**: Inter-region partial (affects some adjacent regions)
- **Global Split**: Inter-region full (affects all unlocked regions)
- **Selective Split**: Inter-region selective (affects specific non-adjacent regions)

### By Constraint Behavior:
- **Unconstrained**: All target regions are unlocked
- **Partially Constrained**: Some target regions are locked (operation affects only unlocked regions)
- **Fully Constrained**: All target regions are locked (operation fails or is modified)

---

## Complex Inter-Region Split Scenarios

### Scenario 1: Selective Non-Adjacent Split
**Goal**: Add region 'x' that spans only regions 'a' and 'd' (skipping 'c')

**Before:**
```
┌─────────────┬───────────┬───┐
│      a      │     c     │   │
├─────────────┼───────────┤ b │
│      e      │     d     │   │
└─────────────┴───────────┴───┘
```

**After:**
```
┌─────────────┬───────────┬───┐
│      x      │     c     │   │
├─────────────┼───────────┤ b │
│      a      │     c     │   │
├─────────────┼───────────┤   │
│      e      │     d     │   │
└─────────────┴───────────┴───┘
```

**Challenge**: Requires complex tree restructuring to create non-uniform splits.

### Scenario 2: Mixed Constraint Split
**Goal**: Add horizontal strip across all regions, but 'b' is locked

**Before:**
```
┌─────────────┬───────────┬───┐
│      a      │     c     │   │
├─────────────┼───────────┤ b │ ← LOCKED
│      e      │     d     │   │
└─────────────┴───────────┴───┘
```

**After:**
```
┌─────────────┬───────────┬───┐
│             x           │   │
├─────────────┼───────────┤ b │ ← Unchanged
│      a      │     c     │   │
├─────────────┼───────────┤   │
│      e      │     d     │   │
└─────────────┴───────────┴───┘
```

**Result**: Strip 'x' only spans unlocked regions (a, c, e, d width), creating asymmetric layout.

### Scenario 3: Cascading Constraint Effects
**Goal**: Add vertical strip, but middle column is locked

**Before:**
```
┌─────┬─────┬─────┐
│  a  │  c  │  f  │
├─────┼─────┼─────┤
│  e  │  d  │  g  │
└─────┴─────┴─────┘
     (c,d locked)
```

**After:**
```
┌─────┬─────┬─────┬─────┐
│  a  │  c  │  f  │  x  │
├─────┼─────┼─────┼─────┤
│  e  │  d  │  g  │  x  │
└─────┴─────┴─────┴─────┘
```

**Result**: New strip 'x' added only to right side, locked middle column unchanged.

---

## Conclusion

The current path-based movement system is fundamentally flawed because it operates on an unstable tree structure. A region-based coordinate system would provide stable, predictable movement operations that align with user expectations and spatial reasoning.

The next step is to implement region coordinate mapping and atomic swap operations to replace the current `movePanel` implementation.

┌─────────────┬───────────┬───┐
│     a       │     c     │   │
├─────────────┼───────────┤ b │
│     e       │    d      │   │
└─────────────┴───────────┴───┘

a -> split horizontally
┌──────────┬───┐
│          │   │
│     a    │ b │
│          │   │
└──────────┴───┘
=
┌──────────┬───┐
│     a    │   │
├──────────┤ b │
│     c    │   │
└──────────┴───┘

add horizontally
┌──────────┬───┐
│          │   │
│     a    │ b │
│          │   │
└──────────┴───┘
┌─────────────┬───────────┐
│     a       │     b     │
├─────────────┴───────────┤
│             c           │
└─────────────────────────┘