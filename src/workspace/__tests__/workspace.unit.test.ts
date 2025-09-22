/**
 * @fileoverview Unit tests for Workspace class with mocked dependencies
 * @author Adaptive Desktop Team
 * @version 1.0.0
 */

import { Workspace } from '../Workspace';
import { ScreenBounds } from '../types';
import { Viewport, ProportionalBounds } from '../../viewport/types';
import { TestIdGenerator } from '../../shared/TestIdGenerator';
import { ViewportManager } from '../../viewport';

// Mock the ViewportManager
const mockViewportManager: jest.Mocked<ViewportManager> = {
  // Viewport management operations
  createViewport: jest.fn(),
  createAdjacentViewport: jest.fn(),
  splitViewport: jest.fn(),
  removeViewport: jest.fn(),
  swapViewports: jest.fn(),
  getViewports: jest.fn(),
  findViewportById: jest.fn(),
  setScreenBounds: jest.fn(),
  getViewportCount: jest.fn(),
  minimizeViewport: jest.fn(),
  maximizeViewport: jest.fn(),
  restoreViewport: jest.fn(),

  // Private properties and methods (for ViewportManager compatibility)
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
  isMinimized: false,
  isMaximized: false,
  isDefault: false,
  isRequired: false,
};

describe('Workspace Unit Tests', () => {
  let workspace: Workspace;
  const testScreenBounds: ScreenBounds = { x: 0, y: 0, width: 800, height: 600 };

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Create workspace with mocked layout manager
    workspace = new Workspace({
      id: 'test-workspace',
      screenBounds: testScreenBounds,
      layout: mockViewportManager,
      idGenerator: new TestIdGenerator('viewport'),
    });
  });

  describe('Constructor', () => {
    test('should initialize with provided configuration', () => {
      expect(workspace.id).toBe('test-workspace');
      expect(workspace.screenBounds).toEqual(testScreenBounds);
      expect(workspace.layout).toBe(mockViewportManager);
    });

    test('should call setScreenBounds on layout manager during construction', () => {
      expect(mockViewportManager.setScreenBounds).toHaveBeenCalledWith(testScreenBounds);
    });

    test('should create default layout manager when none provided', () => {
      // Create workspace without layout manager
      const workspaceWithoutLayout = new Workspace({
        id: 'test-workspace-no-layout',
        screenBounds: testScreenBounds,
        idGenerator: new TestIdGenerator('viewport'),
      });

      expect(workspaceWithoutLayout.id).toBe('test-workspace-no-layout');
      expect(workspaceWithoutLayout.screenBounds).toEqual(testScreenBounds);
      expect(workspaceWithoutLayout.layout).toBeDefined();
      // Should be a real ViewportManager instance, not our mock
      expect(workspaceWithoutLayout.layout).not.toBe(mockViewportManager);
    });
  });

  describe('Viewport Creation', () => {
    test('createViewport should delegate to layout manager', () => {
      const bounds: ProportionalBounds = { x: 0, y: 0, width: 1.0, height: 1.0 };
      mockViewportManager.createViewport.mockReturnValue(mockViewport);

      const result = workspace.createViewport(bounds);

      expect(mockViewportManager.createViewport).toHaveBeenCalledWith(bounds);
      expect(result).toBe(mockViewport);
    });

    test('createViewport should work without bounds parameter', () => {
      mockViewportManager.createViewport.mockReturnValue(mockViewport);

      const result = workspace.createViewport();

      expect(mockViewportManager.createViewport).toHaveBeenCalledWith(undefined);
      expect(result).toBe(mockViewport);
    });

    test('createAdjacentViewport should delegate to layout manager', () => {
      const existingViewports = [mockViewport];
      const direction = 'left' as const;
      const size = { width: 0.5 };
      mockViewportManager.createAdjacentViewport.mockReturnValue(mockViewport);

      const result = workspace.createAdjacentViewport(existingViewports, direction, size);

      expect(mockViewportManager.createAdjacentViewport).toHaveBeenCalledWith(
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
      mockViewportManager.findViewportById.mockReturnValue(mockViewport);
      mockViewportManager.createAdjacentViewport.mockReturnValue(mockViewport);

      const result = workspace.createAdjacentViewport(existingViewportsOrIds, direction, size);

      // Should call findViewportById with the ID
      expect(mockViewportManager.findViewportById).toHaveBeenCalledWith(viewportId);
      // Should call createAdjacentViewport with resolved viewport objects
      expect(mockViewportManager.createAdjacentViewport).toHaveBeenCalledWith(
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
      mockViewportManager.findViewportById.mockReturnValue(null);

      expect(() => workspace.createAdjacentViewport(existingViewportsOrIds, direction)).toThrow(
        'Viewport not found: non-existent-id'
      );

      expect(mockViewportManager.findViewportById).toHaveBeenCalledWith(viewportId);
      expect(mockViewportManager.createAdjacentViewport).not.toHaveBeenCalled();
    });
  });

  describe('Viewport Operations', () => {
    test('splitViewport should delegate to layout manager with viewport object', () => {
      const direction = 'down' as const;
      const expectedResult = mockViewport;
      mockViewportManager.splitViewport.mockReturnValue(expectedResult);

      const result = workspace.splitViewport(mockViewport, direction);

      expect(mockViewportManager.splitViewport).toHaveBeenCalledWith(
        mockViewport,
        direction,
        undefined
      );
      expect(result).toBe(expectedResult);
    });

    test('splitViewport should resolve ID to viewport object before delegating', () => {
      const viewportId = 'test-viewport-id';
      const direction = 'down' as const;
      const expectedResult = mockViewport;

      // Mock findViewportById to return the viewport
      mockViewportManager.findViewportById.mockReturnValue(mockViewport);
      mockViewportManager.splitViewport.mockReturnValue(expectedResult);

      const result = workspace.splitViewport(viewportId, direction);

      // Should call findViewportById with the ID
      expect(mockViewportManager.findViewportById).toHaveBeenCalledWith(viewportId);
      // Should call splitViewport with the resolved viewport object
      expect(mockViewportManager.splitViewport).toHaveBeenCalledWith(
        mockViewport,
        direction,
        undefined
      );
      expect(result).toBe(expectedResult);
    });

    test('splitViewport should throw error when viewport ID not found', () => {
      const viewportId = 'non-existent-id';
      const direction = 'down' as const;

      // Mock findViewportById to return null
      mockViewportManager.findViewportById.mockReturnValue(null);

      expect(() => workspace.splitViewport(viewportId, direction)).toThrow(
        'Viewport not found: non-existent-id'
      );

      expect(mockViewportManager.findViewportById).toHaveBeenCalledWith(viewportId);
      expect(mockViewportManager.splitViewport).not.toHaveBeenCalled();
    });

    test('removeViewport should delegate to layout manager with viewport objects', () => {
      mockViewportManager.removeViewport.mockReturnValue(true);

      const result = workspace.removeViewport(mockViewport);

      expect(mockViewportManager.removeViewport).toHaveBeenCalledWith(mockViewport);
      expect(result).toBe(true);
    });

    test('swapViewports should delegate to layout manager', () => {
      const viewport2: Viewport = {
        id: 'viewport-2',
        screenBounds: { x: 400, y: 0, width: 400, height: 600 },
        isMinimized: false,
        isMaximized: false,
      };
      mockViewportManager.swapViewports.mockReturnValue(true);

      const result = workspace.swapViewports(mockViewport, viewport2);

      expect(mockViewportManager.swapViewports).toHaveBeenCalledWith(mockViewport, viewport2);
      expect(result).toBe(true);
    });

    test('minimizeViewport should resolve ID and delegate to layout manager', () => {
      const viewportId = 'test-viewport-id';
      mockViewportManager.findViewportById.mockReturnValue(mockViewport);
      mockViewportManager.minimizeViewport.mockReturnValue(false);

      const result = workspace.minimizeViewport(viewportId);

      expect(mockViewportManager.findViewportById).toHaveBeenCalledWith(viewportId);
      expect(mockViewportManager.minimizeViewport).toHaveBeenCalledWith(mockViewport);
      expect(result).toBe(false);
    });

    test('maximizeViewport should resolve ID and delegate to layout manager', () => {
      const viewportId = 'test-viewport-id';
      mockViewportManager.findViewportById.mockReturnValue(mockViewport);
      mockViewportManager.maximizeViewport.mockReturnValue(false);

      const result = workspace.maximizeViewport(viewportId);

      expect(mockViewportManager.findViewportById).toHaveBeenCalledWith(viewportId);
      expect(mockViewportManager.maximizeViewport).toHaveBeenCalledWith(mockViewport);
      expect(result).toBe(false);
    });

    test('restoreViewport should resolve ID and delegate to layout manager', () => {
      const viewportId = 'test-viewport-id';
      mockViewportManager.findViewportById.mockReturnValue(mockViewport);
      mockViewportManager.restoreViewport.mockReturnValue(false);

      const result = workspace.restoreViewport(viewportId);

      expect(mockViewportManager.findViewportById).toHaveBeenCalledWith(viewportId);
      expect(mockViewportManager.restoreViewport).toHaveBeenCalledWith(mockViewport);
      expect(result).toBe(false);
    });
  });

  describe('Viewport Queries', () => {
    test('getViewports should delegate to layout manager', () => {
      const mockViewports = [mockViewport];
      mockViewportManager.getViewports.mockReturnValue(mockViewports);

      const result = workspace.getViewports();

      expect(mockViewportManager.getViewports).toHaveBeenCalled();
      expect(result).toBe(mockViewports);
    });

    test('hasViewport should use findViewportById under the hood', () => {
      mockViewportManager.findViewportById.mockReturnValue(mockViewport);

      const result = workspace.hasViewport('test-id');

      expect(mockViewportManager.findViewportById).toHaveBeenCalledWith('test-id');
      expect(result).toBe(true);
    });
  });

  describe('Screen Bounds Operations', () => {
    test('updateScreenBounds should update workspace position and call layout manager', () => {
      const newScreenBounds: ScreenBounds = { x: 100, y: 100, width: 1000, height: 800 };

      workspace.updateScreenBounds(newScreenBounds);

      expect(workspace.screenBounds).toEqual(newScreenBounds);
      expect(mockViewportManager.setScreenBounds).toHaveBeenCalledWith(newScreenBounds);
    });

    test('updateScreenBounds should be called twice - once in constructor, once in method', () => {
      const newScreenBounds: ScreenBounds = { x: 200, y: 200, width: 1200, height: 900 };

      workspace.updateScreenBounds(newScreenBounds);

      // Should be called twice: once in constructor, once in updateScreenBounds
      expect(mockViewportManager.setScreenBounds).toHaveBeenCalledTimes(2);
      expect(mockViewportManager.setScreenBounds).toHaveBeenNthCalledWith(1, testScreenBounds); // Constructor
      expect(mockViewportManager.setScreenBounds).toHaveBeenNthCalledWith(2, newScreenBounds); // updateScreenBounds
    });
  });
});
