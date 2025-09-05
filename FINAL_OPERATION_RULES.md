# Final Operation Rules & Behaviors

## **Core Operations & Their Rules**

### **1. `splitViewport(position, newPanelId, direction)`**

**What it does:** Splits one viewport into two viewports.

**Rules:**
- Original content position: TBD by implementation (could be configurable)
- New viewport gets `newPanelId`
- `direction: 'horizontal'` creates top/bottom split
- `direction: 'vertical'` creates left/right split

**Example:**
```
Before:                After split(B, 'X', 'horizontal'):
┌───┬───┬───┐          ┌───┬───┬───┐
│ A │ B │ C │          │ A │ B │ C │  ← B stays (or X could go here)
├───┼───┼───┤    →     ├───┼───┼───┤
│ D │ E │ F │          │ D │ X │ F │  ← X goes here (or B could go here)
└───┴───┴───┘          └───┴───┴───┘
```

---

### **2. `removeViewport(position)`**

**What it does:** Removes a viewport and redistributes its space.

**Rules:**
- Adjacent viewports expand proportionally to fill the space
- Proportional expansion may be configurable in the future
- Cannot remove the last viewport

**Example:**
```
Before:                After remove(B):
┌───┬───┬───┐          ┌─────┬─────┐
│ A │ B │ C │          │  A  │  C  │  ← A and C expand proportionally
├───┼───┼───┤    →     ├─────┼─────┤
│ D │ E │ F │          │  D  │  F  │  ← D and F expand proportionally
└───┴───┴───┘          └─────┴─────┘
```

---

### **3. `swapViewports(panelId1, panelId2)`**

**What it does:** Exchanges the positions of two panels.

**Rules:**
- Clean exchange - no layout structure changes
- No displacement complexity
- Both panels must exist
- Viewport sizes remain the same

**Example:**
```
Before:                After swap('A', 'F'):
┌───┬───┬───┐          ┌───┬───┬───┐
│ A │ B │ C │          │ F │ B │ C │  ← F moved here
├───┼───┼───┤    →     ├───┼───┼───┤
│ D │ E │ F │          │ D │ E │ A │  ← A moved here
└───┴───┴───┘          └───┴───┴───┘
```

---

### **4. `insertViewport(viewportPositions, newPanelId, direction)`**

**What it does:** Inserts a new viewport relative to a range of existing viewports.

**Rules:**
- `viewportPositions` array determines the span (width/height) of new viewport
- `direction` determines placement relative to the range:
  - `'above'` - new viewport appears above the range
  - `'below'` - new viewport appears below the range
  - `'left'` - new viewport appears left of the range
  - `'right'` - new viewport appears right of the range
- Existing content shifts to make room
- Range can be full row/column or partial

**Full Row Example:**
```typescript
// Insert above entire row 1
insertViewport([{row:1,col:0}, {row:1,col:1}, {row:1,col:2}], 'X', 'above')

Before:                After:
┌───┬───┬───┐          ┌───┬───┬───┐
│ A │ B │ C │          │ A │ B │ C │
├───┼───┼───┤    →     ├───┼───┼───┤
│ D │ E │ F │          │ X │ X │ X │  ← New full-width row
└───┴───┴───┘          ├───┼───┼───┤
                       │ D │ E │ F │  ← Original row shifted down
                       └───┴───┴───┘
```

**Partial Range Example:**
```typescript
// Insert above just B and E
insertViewport([{row:0,col:1}, {row:1,col:1}], 'X', 'above')

Before:                After:
┌───┬───┬───┐          ┌───┬───┬───┐
│ A │ B │ C │          │ A │ X │ C │  ← X spans width of B and E
├───┼───┼───┤    →     ├───┼───┼───┤
│ D │ E │ F │          │ A │ B │ C │  ← Original content shifts
└───┴───┴───┘          ├───┼───┼───┤
                       │ D │ E │ F │
                       └───┴───┴───┘
```

---

## **Why These Rules?**

### **1. Simplicity Over Flexibility**
- Each operation has one clear behavior
- No ambiguous edge cases
- Predictable results

### **2. No Displacement Complexity**
- `swapViewports` avoids the "what happens to displaced content" problem
- If users need complex moves, they can combine operations:
  1. `insertViewport` to create space
  2. `swapViewports` to move content
  3. `removeViewport` to clean up

### **3. Proportional Expansion**
- `removeViewport` expands neighbors proportionally
- Fair distribution of reclaimed space
- May be configurable in future (e.g., expand only one neighbor)

### **4. Unified Multi-Viewport Operations**
- Single `insertViewport` handles all insertion cases
- Range + direction is more flexible than separate methods
- Handles both full-span and partial-span insertions

---

## **Operation Combinations**

### **Moving a Panel to New Space:**
```typescript
// 1. Create space
layout = layout.insertViewport([{row: 2, column: 2}], 'TEMP', 'below');

// 2. Move panel into space
layout = layout.swapViewports('A', 'TEMP');

// 3. Clean up old space
layout = layout.removeViewport({row: 0, column: 0});
```

### **Rearranging Layout:**
```typescript
// Add new row, then rearrange panels
layout = layout.insertViewport([{row: 0, column: 0}, {row: 0, column: 1}], 'NEW', 'above');
layout = layout.swapViewports('A', 'NEW');
layout = layout.swapViewports('B', 'C');
```

---

## **Future Configurability**

### **Remove Behavior:**
Currently: Adjacent viewports expand proportionally
Future: Could be configurable:
- Proportional expansion (current)
- Single neighbor expansion (specify which)
- Custom expansion ratios

### **Split Behavior:**
Currently: Original content position TBD by implementation
Future: Could be configurable:
- Always keep original in specific position (top/left)
- User specifies original position
- Smart positioning based on context

---

## **Implementation Notes**

### **Binary Tree Mapping:**
- These operations need to map to binary tree manipulations
- Position coordinates need to convert to tree paths
- Tree restructuring may be needed for complex insertions

### **Validation:**
- Check position validity before operations
- Ensure panels exist before swapping
- Prevent removing last viewport

### **Immutability:**
- All operations return new LayoutManager instances
- Original layout unchanged
- Functional programming approach

---

**These rules provide a solid foundation for predictable, understandable layout operations while keeping complexity manageable.**
