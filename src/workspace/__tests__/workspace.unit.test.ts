/**
 * @fileoverview Unit tests for Workspace class with mocked dependencies
 * @author Adaptive Desktop Team
 * @version 1.0.0
 */

import { Workspace } from '../Workspace';
import { ScreenBounds } from '../types';
import { LayoutManagerInterface } from '../../layout/types';
import { Viewport, ProportionalBounds } from '../../viewport/types';

// Mock the LayoutManager
const mockLayoutManager: jest.Mocked<LayoutManagerInterface<string>> = {
  // Viewport management operations
  createViewport: jest.fn(),
  createAdjacentViewport: jest.fn(),
  splitViewport: jest.fn(),
  removeViewport: jest.fn(),
  removeViewportByObject: jest.fn(),
  swapViewports: jest.fn(),
  getViewports: jest.fn(),
  hasViewport: jest.fn(),
  setPosition: jest.fn(),

  // Legacy operations (for compatibility)
  getViewportAt: jest.fn(),
  getAllViewports: jest.fn(),
  getViewportCount: jest.fn(),
  getLayoutTemplate: jest.fn(),
  getViewportBounds: jest.fn(),
  insertViewport: jest.fn(),
  isValidPosition: jest.fn(),
  getPositionForViewport: jest.fn(),
  canSplitViewport: jest.fn(),
  canRemoveViewport: jest.fn(),
};

// Mock viewport for testing
const mockViewport: Viewport = {
  id: 'test-viewport-id',
  screenBounds: { x: 0, y: 0, width: 800, height: 600 },
};

describe('Workspace Unit Tests', () => {
  let workspace: Workspace;
  const testPosition: ScreenBounds = { x: 0, y: 0, width: 800, height: 600 };

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Create workspace with mocked layout manager
    workspace = new Workspace({
      id: 'test-workspace',
      position: testPosition,
      layout: mockLayoutManager,
    });
  });

  describe('Constructor', () => {
    test('should initialize with provided configuration', () => {
      expect(workspace.id).toBe('test-workspace');
      expect(workspace.position).toEqual(testPosition);
      expect(workspace.layout).toBe(mockLayoutManager);
    });

    test('should call setPosition on layout manager during construction', () => {
      expect(mockLayoutManager.setPosition).toHaveBeenCalledWith(testPosition);
    });

    test('should create default layout manager when none provided', () => {
      // Create workspace without layout manager
      const workspaceWithoutLayout = new Workspace({
        id: 'test-workspace-no-layout',
        position: testPosition,
      });

      expect(workspaceWithoutLayout.id).toBe('test-workspace-no-layout');
      expect(workspaceWithoutLayout.position).toEqual(testPosition);
      expect(workspaceWithoutLayout.layout).toBeDefined();
      // Should be a real LayoutManager instance, not our mock
      expect(workspaceWithoutLayout.layout).not.toBe(mockLayoutManager);
    });
  });

  describe('Viewport Creation', () => {
    test('createViewport should delegate to layout manager', () => {
      const bounds: ProportionalBounds = { x: 0, y: 0, width: 1.0, height: 1.0 };
      mockLayoutManager.createViewport.mockReturnValue(mockViewport);

      const result = workspace.createViewport(bounds);

      expect(mockLayoutManager.createViewport).toHaveBeenCalledWith(bounds);
      expect(result).toBe(mockViewport);
    });

    test('createViewport should work without bounds parameter', () => {
      mockLayoutManager.createViewport.mockReturnValue(mockViewport);

      const result = workspace.createViewport();

      expect(mockLayoutManager.createViewport).toHaveBeenCalledWith(undefined);
      expect(result).toBe(mockViewport);
    });

    test('createAdjacentViewport should delegate to layout manager', () => {
      const existingViewports = [mockViewport];
      const direction = 'left' as const;
      const size = { width: 0.5 };
      mockLayoutManager.createAdjacentViewport.mockReturnValue(mockViewport);

      const result = workspace.createAdjacentViewport(existingViewports, direction, size);

      expect(mockLayoutManager.createAdjacentViewport).toHaveBeenCalledWith(
        existingViewports,
        direction,
        size
      );
      expect(result).toBe(mockViewport);
    });
  });

  describe('Viewport Operations', () => {
    test('splitViewport should delegate to layout manager', () => {
      const direction = 'horizontal' as const;
      mockLayoutManager.splitViewport.mockReturnValue(mockViewport);

      const result = workspace.splitViewport(mockViewport, direction);

      expect(mockLayoutManager.splitViewport).toHaveBeenCalledWith(mockViewport, direction);
      expect(result).toBe(mockViewport);
    });

    test('removeViewport should delegate to layout manager', () => {
      mockLayoutManager.removeViewportByObject.mockReturnValue(true);

      const result = workspace.removeViewport(mockViewport);

      expect(mockLayoutManager.removeViewportByObject).toHaveBeenCalledWith(mockViewport);
      expect(result).toBe(true);
    });

    test('swapViewports should delegate to layout manager', () => {
      const viewport2: Viewport = {
        id: 'viewport-2',
        screenBounds: { x: 400, y: 0, width: 400, height: 600 },
      };
      mockLayoutManager.swapViewports.mockReturnValue(true);

      const result = workspace.swapViewports(mockViewport, viewport2);

      expect(mockLayoutManager.swapViewports).toHaveBeenCalledWith(mockViewport, viewport2);
      expect(result).toBe(true);
    });
  });

  describe('Viewport Queries', () => {
    test('getViewports should delegate to layout manager', () => {
      const mockViewports = [mockViewport];
      mockLayoutManager.getViewports.mockReturnValue(mockViewports);

      const result = workspace.getViewports();

      expect(mockLayoutManager.getViewports).toHaveBeenCalled();
      expect(result).toBe(mockViewports);
    });

    test('hasViewport should delegate to layout manager', () => {
      mockLayoutManager.hasViewport.mockReturnValue(true);

      const result = workspace.hasViewport('test-id');

      expect(mockLayoutManager.hasViewport).toHaveBeenCalledWith('test-id');
      expect(result).toBe(true);
    });
  });

  describe('Position Operations', () => {
    test('updatePosition should update workspace position and call layout manager', () => {
      const newPosition: ScreenBounds = { x: 100, y: 100, width: 1000, height: 800 };

      workspace.updatePosition(newPosition);

      expect(workspace.position).toEqual(newPosition);
      expect(mockLayoutManager.setPosition).toHaveBeenCalledWith(newPosition);
    });

    test('updatePosition should be called twice - once in constructor, once in method', () => {
      const newPosition: ScreenBounds = { x: 200, y: 200, width: 1200, height: 900 };

      workspace.updatePosition(newPosition);

      // Should be called twice: once in constructor, once in updatePosition
      expect(mockLayoutManager.setPosition).toHaveBeenCalledTimes(2);
      expect(mockLayoutManager.setPosition).toHaveBeenNthCalledWith(1, testPosition); // Constructor
      expect(mockLayoutManager.setPosition).toHaveBeenNthCalledWith(2, newPosition); // updatePosition
    });
  });
});
