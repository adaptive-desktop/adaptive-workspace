# LayoutManager Profile Tests

This directory contains comprehensive tests for the LayoutManager's profile and context management functionality.

## Test Structure

### Core Testing Requirements

All profile-related tests must verify:

1. **Context Detection**
   - Orientation detection (landscape/portrait)
   - Size breakpoint categorization (sm/md/lg/xl)
   - Device type detection (laptop/ultrawide/tablet/wall-display)
   - Aspect ratio calculation

2. **Automatic Profile Creation**
   - Profile creation for new contexts
   - Context key generation
   - Profile storage and retrieval

3. **Layout Preservation**
   - Current layout saved when switching contexts
   - Layout restoration when returning to previous contexts
   - Viewport state preservation (minimized/maximized)

4. **Default Layout Creation**
   - Appropriate defaults for different contexts
   - Single viewport for portrait/small screens
   - Optimized layouts for ultrawide displays

### Test Files

#### `LayoutManager.profiles.test.ts`
Core profile management functionality:
- Context detection (orientation, size, device type)
- Automatic profile creation
- Layout preservation and restoration
- Profile storage and retrieval

#### `contextKeys.test.ts`
Context key generation and categorization:
- Key format validation (`orientation-size-widthxheight`)
- Size breakpoint categorization
- Device type detection
- Unique key generation for different contexts

#### `contextSwitching.test.ts`
Integration tests for real-world scenarios:
- Browser window movement between monitors
- Orientation changes (landscape ↔ portrait)
- Multiple rapid context switches
- Layout preservation across switches
- Default layout creation for new contexts

## Testing Patterns

### Context Setup Pattern
```typescript
const bounds: ScreenBounds = { x: 0, y: 0, width: 1920, height: 1080 };
layoutManager.setScreenBounds(bounds);

const context = layoutManager.getCurrentContext();
expect(context.orientation).toBe('landscape');
expect(context.breakpoint).toBe('lg');
```

### Profile Creation Pattern
```typescript
// Create layout in first context
layoutManager.setScreenBounds(context1Bounds);
const viewport = layoutManager.createViewport();

// Switch context (should auto-create profile)
layoutManager.setScreenBounds(context2Bounds);

// Verify profile was created
const profiles = layoutManager.getProfiles();
expect(profiles.has('landscape-lg-1920x1080')).toBe(true);
```

### Layout Preservation Pattern
```typescript
// Create complex layout
const v1 = layoutManager.createViewport();
const v2 = layoutManager.splitViewport(v1, 'right');
const originalIds = [v1.id, v2.id];

// Switch context and back
layoutManager.setScreenBounds(newBounds);
layoutManager.setScreenBounds(originalBounds);

// Verify layout restored
const restoredIds = layoutManager.getViewports().map(v => v.id);
expect(restoredIds).toEqual(originalIds);
```

## Context Key Format

Context keys follow the pattern: `{orientation}-{breakpoint}-{width}x{height}`

Examples:
- `landscape-lg-1920x1080` - Standard laptop landscape
- `portrait-md-800x1200` - Tablet portrait
- `landscape-xl-3440x1440` - Ultrawide monitor
- `landscape-sm-1366x768` - Small laptop

## Size Breakpoints

| Breakpoint | Width Range | Category |
|------------|-------------|----------|
| `sm` | < 1024px | Small |
| `md` | 1024-1599px | Medium |
| `lg` | 1600-2559px | Large |
| `xl` | ≥ 2560px | Extra Large |

## Device Type Detection

| Device Type | Criteria | Use Case |
|-------------|----------|----------|
| `ultrawide` | Aspect ratio > 2.1 | 21:9, 32:9 monitors |
| `wall-display` | Width > 3000px | Large displays |
| `tablet` | Aspect ratio < 0.8 or > 1.5, Width < 3000px | Tablets, convertibles |
| `laptop` | Default case | Standard laptops/desktops |

## Running Tests

```bash
# Run all profile tests
npm test -- src/layout/__tests__/profiles/

# Run specific test file
npm test -- src/layout/__tests__/profiles/contextKeys.test.ts

# Run with coverage
npm run test:coverage -- src/layout/__tests__/profiles/

# Watch mode for development
npm test -- --watch src/layout/__tests__/profiles/
```

## Test Coverage Goals

- **100% line coverage** for profile management methods
- **100% branch coverage** for context detection logic
- **Edge case coverage** for boundary conditions (aspect ratios, screen sizes)
- **Integration coverage** for real-world context switching scenarios
- **Performance coverage** for rapid context changes

## Future Test Files

As the profile system expands, consider adding:

- `profileTemplates.test.ts` - Tests for predefined profile templates
- `profilePersistence.test.ts` - Tests for saving/loading profiles
- `profileMigration.test.ts` - Tests for profile format migrations
- `profileSync.test.ts` - Tests for cloud synchronization
- `profileValidation.test.ts` - Tests for profile data validation

## Integration with Existing Tests

Profile tests complement existing viewport tests:

- **Viewport tests** focus on individual viewport operations
- **Profile tests** focus on context-aware layout management
- **Integration tests** verify the complete workflow

## Best Practices

### Test Organization
1. **Group by functionality** - Context detection, profile creation, layout switching
2. **Use descriptive names** - Clearly indicate what scenario is being tested
3. **Test edge cases** - Boundary conditions, rapid changes, error states
4. **Verify state** - Check both immediate effects and side effects

### Test Data
1. **Realistic screen sizes** - Use actual device dimensions
2. **Common scenarios** - Test typical user workflows
3. **Edge cases** - Very small/large screens, unusual aspect ratios
4. **Performance** - Test with many contexts and rapid switching

### Assertions
1. **Verify context detection** - Orientation, size, device type
2. **Check profile creation** - Automatic creation, key generation
3. **Validate layout preservation** - Viewport count, IDs, bounds
4. **Confirm state consistency** - Profile storage, retrieval accuracy

## Related Documentation

- [Viewport Tests](../viewport/README.md) - Core viewport operation tests
- [Layout Profiles](../../../../LAYOUT_PROFILES.md) - Profile system overview
- [Workspace Persistence](../../../../WORKSPACE_PERSISTENCE.md) - State persistence