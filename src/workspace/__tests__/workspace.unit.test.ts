/**
 * @fileoverview Unit tests for Workspace class with mocked dependencies
 * @author Adaptive Desktop Team
 * @version 1.0.0
 */

import { Workspace } from '../Workspace';
import { ScreenBounds } from '../types';
import { LayoutManager } from '../../layout/LayoutManager';
import { Viewport, ProportionalBounds } from '../../viewport/types';

// Mock the LayoutManager
const mockLayoutManager: jest.Mocked<LayoutManager> = {
  // Viewport management operations
  createViewport: jest.fn(),
  createAdjacentViewport: jest.fn(),
  splitViewport: jest.fn(),
  removeViewport: jest.fn(),
  swapViewports: jest.fn(),
  getViewports: jest.fn(),
  findViewportById: jest.fn(),
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

  // Private properties and methods (for LayoutManager compatibility)
  viewports: new Map(),
  workspaceBounds: { x: 0, y: 0, width: 1000, height: 800 },
  createViewportInternal: jest.fn(),
  findLargestAvailableSpace: jest.fn(),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

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

    test('createAdjacentViewport should resolve IDs to viewport objects', () => {
      const viewportId = 'test-viewport-id';
      const existingViewportsOrIds = [mockViewport, viewportId]; // Mix of object and ID
      const direction = 'left' as const;
      const size = { width: 0.5 };

      // Mock findViewportById to return the viewport
      mockLayoutManager.findViewportById.mockReturnValue(mockViewport);
      mockLayoutManager.createAdjacentViewport.mockReturnValue(mockViewport);

      const result = workspace.createAdjacentViewport(existingViewportsOrIds, direction, size);

      // Should call findViewportById with the ID
      expect(mockLayoutManager.findViewportById).toHaveBeenCalledWith(viewportId);
      // Should call createAdjacentViewport with resolved viewport objects
      expect(mockLayoutManager.createAdjacentViewport).toHaveBeenCalledWith(
        [mockViewport, mockViewport], // Both should be viewport objects
        direction,
        size
      );
      expect(result).toBe(mockViewport);
    });

    test('createAdjacentViewport should throw error when viewport ID not found', () => {
      const viewportId = 'non-existent-id';
      const existingViewportsOrIds = [viewportId];
      const direction = 'left' as const;

      // Mock findViewportById to return null
      mockLayoutManager.findViewportById.mockReturnValue(null);

      expect(() => workspace.createAdjacentViewport(existingViewportsOrIds, direction)).toThrow(
        'Viewport not found: non-existent-id'
      );

      expect(mockLayoutManager.findViewportById).toHaveBeenCalledWith(viewportId);
      expect(mockLayoutManager.createAdjacentViewport).not.toHaveBeenCalled();
    });
  });

  describe('Viewport Operations', () => {
    test('splitViewport should delegate to layout manager with viewport object', () => {
      const direction = 'down' as const;
      mockLayoutManager.splitViewport.mockReturnValue(mockViewport);

      const result = workspace.splitViewport(mockViewport, direction);

      expect(mockLayoutManager.splitViewport).toHaveBeenCalledWith(mockViewport, direction);
      expect(result).toBe(mockViewport);
    });

    test('splitViewport should resolve ID to viewport object before delegating', () => {
      const viewportId = 'test-viewport-id';
      const direction = 'down' as const;

      // Mock findViewportById to return the viewport
      mockLayoutManager.findViewportById.mockReturnValue(mockViewport);
      mockLayoutManager.splitViewport.mockReturnValue(mockViewport);

      const result = workspace.splitViewport(viewportId, direction);

      // Should call findViewportById with the ID
      expect(mockLayoutManager.findViewportById).toHaveBeenCalledWith(viewportId);
      // Should call splitViewport with the resolved viewport object
      expect(mockLayoutManager.splitViewport).toHaveBeenCalledWith(mockViewport, direction);
      expect(result).toBe(mockViewport);
    });

    test('splitViewport should throw error when viewport ID not found', () => {
      const viewportId = 'non-existent-id';
      const direction = 'down' as const;

      // Mock findViewportById to return null
      mockLayoutManager.findViewportById.mockReturnValue(null);

      expect(() => workspace.splitViewport(viewportId, direction)).toThrow(
        'Viewport not found: non-existent-id'
      );

      expect(mockLayoutManager.findViewportById).toHaveBeenCalledWith(viewportId);
      expect(mockLayoutManager.splitViewport).not.toHaveBeenCalled();
    });

    test('removeViewport should delegate to layout manager with viewport objects', () => {
      mockLayoutManager.removeViewport.mockReturnValue(true);

      const result = workspace.removeViewport(mockViewport);

      expect(mockLayoutManager.removeViewport).toHaveBeenCalledWith(mockViewport);
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
    test('updateScreenBounds should update workspace position and call layout manager', () => {
      const newScreenBounds: ScreenBounds = { x: 100, y: 100, width: 1000, height: 800 };

      workspace.updateScreenBounds(newScreenBounds);

      expect(workspace.position).toEqual(newScreenBounds);
      expect(mockLayoutManager.setPosition).toHaveBeenCalledWith(newScreenBounds);
    });

    test('updateScreenBounds should be called twice - once in constructor, once in method', () => {
      const newScreenBounds: ScreenBounds = { x: 200, y: 200, width: 1200, height: 900 };

      workspace.updateScreenBounds(newScreenBounds);

      // Should be called twice: once in constructor, once in updateScreenBounds
      expect(mockLayoutManager.setPosition).toHaveBeenCalledTimes(2);
      expect(mockLayoutManager.setPosition).toHaveBeenNthCalledWith(1, testPosition); // Constructor
      expect(mockLayoutManager.setPosition).toHaveBeenNthCalledWith(2, newScreenBounds); // updateScreenBounds
    });
  });
});
