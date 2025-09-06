/**
 * @fileoverview Tests for layout actions utilities
 *
 * These tests verify the helper functions for layout actions
 * and operations on the binary layout tree.
 */

import {
  createLayoutActions,
  getBestSplitDirection,
  calculateOptimalSplit,
  canSplitRegion,
  findResizableParent,
  getInsertionPositions,
  calculateRemovalImpact,
  validateLayoutAction,
} from '../src/utils/layoutActions';
import { LayoutTree } from '../src/layout/LayoutTree';
import { LayoutActions, LayoutPath } from '../src/shared/types';

describe('Layout Actions Utilities', () => {
  describe('createLayoutActions', () => {
    it('should create layout actions object', () => {
      const tree = new LayoutTree<string>({
        direction: 'row',
        leading: 'panel1',
        trailing: 'panel2',
      });

      const onTreeChange = jest.fn();
      const actions = createLayoutActions(tree, ['leading'], onTreeChange);

      expect(actions).toHaveProperty('splitCurrentRegion');
      expect(actions).toHaveProperty('removeCurrentRegion');
      expect(actions).toHaveProperty('resizeCurrentRegion');
      expect(actions).toHaveProperty('expandCurrentRegion');
      expect(actions).toHaveProperty('lockCurrentRegion');
      expect(actions).toHaveProperty('movePanel');
    });

    it('should call onTreeChange when splitCurrentRegion is called', () => {
      const tree = new LayoutTree<string>('panel1');
      const onTreeChange = jest.fn();
      const actions = createLayoutActions(tree, [], onTreeChange);

      const newPanelId = actions.splitCurrentRegion('row', 'panel2');

      expect(onTreeChange).toHaveBeenCalledTimes(1);
      expect(newPanelId).toBe('panel2');
    });

    it('should generate panel ID when not provided', () => {
      const tree = new LayoutTree<string>('panel1');
      const onTreeChange = jest.fn();
      const actions = createLayoutActions(tree, [], onTreeChange);

      const newPanelId = actions.splitCurrentRegion('row');

      expect(onTreeChange).toHaveBeenCalledTimes(1);
      expect(typeof newPanelId).toBe('string');
      expect(newPanelId).toMatch(/^panel_\d+_[a-z0-9]+$/);
    });

    it('should call onTreeChange when removeCurrentRegion is called', () => {
      const tree = new LayoutTree<string>({
        direction: 'row',
        leading: 'panel1',
        trailing: 'panel2',
      });
      const onTreeChange = jest.fn();
      const actions = createLayoutActions(tree, ['leading'], onTreeChange);

      actions.removeCurrentRegion();

      expect(onTreeChange).toHaveBeenCalledTimes(1);
    });

    it('should call onTreeChange when resizeCurrentRegion is called', () => {
      const tree = new LayoutTree<string>({
        direction: 'row',
        leading: 'panel1',
        trailing: 'panel2',
      });
      const onTreeChange = jest.fn();
      const actions = createLayoutActions(tree, [], onTreeChange);

      actions.resizeCurrentRegion(60);

      expect(onTreeChange).toHaveBeenCalledTimes(1);
    });

    it('should call onTreeChange when expandCurrentRegion is called', () => {
      const tree = new LayoutTree<string>({
        direction: 'row',
        leading: 'panel1',
        trailing: 'panel2',
      });
      const onTreeChange = jest.fn();
      const actions = createLayoutActions(tree, [], onTreeChange);

      actions.expandCurrentRegion(75);

      expect(onTreeChange).toHaveBeenCalledTimes(1);
    });

    it('should use default 80% when expandCurrentRegion called without percentage', () => {
      const tree = new LayoutTree<string>({
        direction: 'row',
        leading: 'panel1',
        trailing: 'panel2',
      });
      const onTreeChange = jest.fn();
      const actions = createLayoutActions(tree, [], onTreeChange);

      actions.expandCurrentRegion();

      expect(onTreeChange).toHaveBeenCalledTimes(1);
      const newTree = onTreeChange.mock.calls[0][0] as LayoutTree<string>;
      const root = newTree.getRoot() as any;
      expect(root.splitPercentage).toBe(80);
    });

    it('should call onTreeChange when lockCurrentRegion is called', () => {
      const tree = new LayoutTree<string>({
        direction: 'row',
        leading: 'panel1',
        trailing: 'panel2',
      });
      const onTreeChange = jest.fn();
      const actions = createLayoutActions(tree, ['leading'], onTreeChange);

      actions.lockCurrentRegion(true);

      expect(onTreeChange).toHaveBeenCalledTimes(1);
    });

    it('should call onTreeChange when movePanel is called', () => {
      const tree = new LayoutTree<string>({
        direction: 'row',
        leading: 'panel1',
        trailing: 'panel2',
      });
      const onTreeChange = jest.fn();
      const actions = createLayoutActions(tree, ['leading'], onTreeChange);

      actions.movePanel([], 'replace');

      expect(onTreeChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('getBestSplitDirection', () => {
    it('should return row for wider dimensions', () => {
      expect(getBestSplitDirection(800, 600)).toBe('row');
      expect(getBestSplitDirection(1000, 500)).toBe('row');
    });

    it('should return column for taller dimensions', () => {
      expect(getBestSplitDirection(600, 800)).toBe('column');
      expect(getBestSplitDirection(500, 1000)).toBe('column');
    });

    it('should return column for equal dimensions', () => {
      expect(getBestSplitDirection(500, 500)).toBe('column');
    });
  });

  describe('calculateOptimalSplit', () => {
    it('should calculate proportional split when enough space', () => {
      const result = calculateOptimalSplit(100, 200, 600);
      expect(result).toBeCloseTo(33.33, 1); // 100/300 * 100
    });

    it('should handle case when not enough space', () => {
      const result = calculateOptimalSplit(200, 300, 400);
      expect(result).toBe(25); // (400 - 300) / 400 * 100
    });

    it('should clamp to valid percentage range', () => {
      // When not enough space, uses different logic
      const result1 = calculateOptimalSplit(10, 500, 400);
      expect(result1).toBe(0); // (400 - 500) / 400 * 100 = -25, clamped to 0

      // When enough space, uses proportional logic with 10-90% clamps
      const result2 = calculateOptimalSplit(100, 200, 600);
      expect(result2).toBeCloseTo(33.33, 1); // 100/300 * 100, within 10-90% range

      // Test minimum clamp
      const result3 = calculateOptimalSplit(10, 200, 600);
      expect(result3).toBe(10); // Would be ~4.76%, clamped to 10%

      // Test maximum clamp
      const result4 = calculateOptimalSplit(200, 10, 600);
      expect(result4).toBe(90); // Would be ~95.24%, clamped to 90%
    });
  });

  describe('canSplitRegion', () => {
    it('should return true for valid panel path', () => {
      const tree = new LayoutTree<string>({
        direction: 'row',
        leading: 'panel1',
        trailing: 'panel2',
      });

      expect(canSplitRegion(tree, ['leading'])).toBe(true);
      expect(canSplitRegion(tree, ['trailing'])).toBe(true);
    });

    it('should return false for parent node path', () => {
      const tree = new LayoutTree<string>({
        direction: 'row',
        leading: 'panel1',
        trailing: 'panel2',
      });

      expect(canSplitRegion(tree, [])).toBe(false);
    });

    it('should return false for non-existent path', () => {
      const tree = new LayoutTree<string>('panel1');

      expect(canSplitRegion(tree, ['leading'])).toBe(false);
    });

    it('should return false for empty tree', () => {
      const tree = new LayoutTree<string>();

      expect(canSplitRegion(tree, [])).toBe(false);
    });
  });

  describe('findResizableParent', () => {
    it('should find resizable parent', () => {
      const tree = new LayoutTree<string>({
        direction: 'row',
        leading: 'panel1',
        trailing: 'panel2',
      });

      const result = findResizableParent(tree, ['leading']);
      expect(result).toEqual([]);
    });

    it('should return null when no resizable parent found', () => {
      const tree = new LayoutTree<string>({
        direction: 'row',
        leading: 'panel1',
        trailing: 'panel2',
        constraints: {
          leading: { locked: true },
          trailing: { locked: true },
        },
      });

      const result = findResizableParent(tree, ['leading']);
      expect(result).toBeNull();
    });

    it('should return null for empty tree', () => {
      const tree = new LayoutTree<string>();

      const result = findResizableParent(tree, []);
      expect(result).toBeNull();
    });
  });

  describe('getInsertionPositions', () => {
    it('should return all positions for splittable panel', () => {
      const tree = new LayoutTree<string>({
        direction: 'row',
        leading: 'panel1',
        trailing: 'panel2',
      });

      const positions = getInsertionPositions(tree, ['leading']);
      expect(positions).toContain('replace');
      expect(positions).toContain('before');
      expect(positions).toContain('after');
    });

    it('should return only replace for non-splittable target', () => {
      const tree = new LayoutTree<string>({
        direction: 'row',
        leading: 'panel1',
        trailing: 'panel2',
      });

      const positions = getInsertionPositions(tree, []);
      expect(positions).toEqual(['replace']);
    });
  });

  describe('calculateRemovalImpact', () => {
    it('should calculate impact of removing a panel', () => {
      const tree = new LayoutTree<string>({
        direction: 'row',
        leading: 'panel1',
        trailing: 'panel2',
      });

      const impact = calculateRemovalImpact(tree, ['leading']);
      expect(impact.affectedPanels).toEqual(['panel1']);
      expect(impact.siblingWillExpand).toBe(true);
      expect(impact.newTreeDepth).toBe(0);
    });

    it('should handle removal from complex tree', () => {
      const tree = new LayoutTree<string>({
        direction: 'row',
        leading: {
          direction: 'column',
          leading: 'panel1',
          trailing: 'panel2',
        },
        trailing: 'panel3',
      });

      const impact = calculateRemovalImpact(tree, ['leading']);
      expect(impact.affectedPanels).toEqual(['panel1', 'panel2']);
      expect(impact.siblingWillExpand).toBe(false); // panel3 doesn't expand, it becomes root
      expect(impact.newTreeDepth).toBe(0);
    });

    it('should handle invalid removal path', () => {
      const tree = new LayoutTree<string>('panel1');

      const impact = calculateRemovalImpact(tree, ['invalid' as any]);
      expect(impact.affectedPanels).toEqual(['panel1']); // Original tree becomes empty
      expect(impact.siblingWillExpand).toBe(true); // 0 === 1 - 1 is true
      expect(impact.newTreeDepth).toBe(-1); // Empty tree has depth -1
    });
  });

  describe('validateLayoutAction', () => {
    it('should validate splitCurrentRegion action', () => {
      const tree = new LayoutTree<string>({
        direction: 'row',
        leading: 'panel1',
        trailing: 'panel2',
      });

      const result = validateLayoutAction(tree, 'splitCurrentRegion', ['leading']);
      expect(result.valid).toBe(true);
    });

    it('should reject splitCurrentRegion for non-splittable region', () => {
      const tree = new LayoutTree<string>({
        direction: 'row',
        leading: 'panel1',
        trailing: 'panel2',
      });

      const result = validateLayoutAction(tree, 'splitCurrentRegion', []);
      expect(result.valid).toBe(false);
      expect(result.reason).toBe('Region cannot be split');
    });

    it('should validate removeCurrentRegion action', () => {
      const tree = new LayoutTree<string>({
        direction: 'row',
        leading: 'panel1',
        trailing: 'panel2',
      });

      const result = validateLayoutAction(tree, 'removeCurrentRegion', ['leading']);
      expect(result.valid).toBe(true);
    });

    it('should reject removeCurrentRegion for last panel', () => {
      const tree = new LayoutTree<string>('panel1');

      const result = validateLayoutAction(tree, 'removeCurrentRegion', []);
      expect(result.valid).toBe(false);
      expect(result.reason).toBe('Cannot remove the last panel');
    });

    it('should validate resizeCurrentRegion action', () => {
      const tree = new LayoutTree<string>({
        direction: 'row',
        leading: 'panel1',
        trailing: 'panel2',
      });

      const result = validateLayoutAction(tree, 'resizeCurrentRegion', [], 60);
      expect(result.valid).toBe(true);
    });

    it('should reject resizeCurrentRegion for locked region', () => {
      const tree = new LayoutTree<string>({
        direction: 'row',
        leading: 'panel1',
        trailing: 'panel2',
        constraints: {
          leading: { locked: true },
        },
      });

      const result = validateLayoutAction(tree, 'resizeCurrentRegion', [], 60);
      expect(result.valid).toBe(false);
      expect(result.reason).toBe('Region cannot be resized to this percentage');
    });

    it('should validate lockCurrentRegion action', () => {
      const tree = new LayoutTree<string>({
        direction: 'row',
        leading: 'panel1',
        trailing: 'panel2',
      });

      const result = validateLayoutAction(tree, 'lockCurrentRegion', ['leading'], true);
      expect(result.valid).toBe(true);
    });

    it('should validate movePanel action', () => {
      const tree = new LayoutTree<string>({
        direction: 'row',
        leading: 'panel1',
        trailing: 'panel2',
      });

      const result = validateLayoutAction(tree, 'movePanel', ['leading'], ['trailing']);
      expect(result.valid).toBe(true);
    });

    it('should reject movePanel to same location', () => {
      const tree = new LayoutTree<string>({
        direction: 'row',
        leading: 'panel1',
        trailing: 'panel2',
      });

      const result = validateLayoutAction(tree, 'movePanel', ['leading'], ['leading']);
      expect(result.valid).toBe(false);
      expect(result.reason).toBe('Cannot move panel to itself');
    });

    it('should reject unknown action', () => {
      const tree = new LayoutTree<string>('panel1');

      const result = validateLayoutAction(tree, 'unknownAction' as any, []);
      expect(result.valid).toBe(false);
      expect(result.reason).toBe('Unknown action');
    });
  });
});
