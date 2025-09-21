import { MutableViewport } from '../MutableViewport';
import { ProportionalBounds, ScreenBounds } from '../../workspace/types';
import { ViewportSnapshot } from '../types';

describe('MutableViewport', () => {
  let viewport: MutableViewport;
  const defaultId = 'test-viewport';
  const defaultProportionalBounds: ProportionalBounds = { x: 0, y: 0, width: 0.5, height: 0.5 };
  const defaultScreenBounds: ScreenBounds = { x: 0, y: 0, width: 500, height: 500 };

  beforeEach(() => {
    viewport = new MutableViewport({
      id: defaultId,
      proportionalBounds: defaultProportionalBounds,
    });
    viewport.screenBounds = defaultScreenBounds;
  });

  describe('constructor', () => {
    it('should initialize with the provided id and proportionalBounds', () => {
      expect(viewport.id).toBe(defaultId);
      expect(viewport.proportionalBounds).toEqual(defaultProportionalBounds);
    });

    it('should initialize with default values for isMinimized and isMaximized', () => {
      expect(viewport.isMinimized).toBe(false);
      expect(viewport.isMaximized).toBe(false);
    });
  });

  describe('mutate', () => {
    it('should update viewport properties from a snapshot', () => {
      const targetViewport = new MutableViewport({
        id: 'target',
        proportionalBounds: { x: 0, y: 0, width: 0.25, height: 0.25 },
      });
      
      const snapshot: ViewportSnapshot = {
        id: 'target',
        bounds: { x: 0.1, y: 0.2, width: 0.3, height: 0.4 },
        isMinimized: true,
        isMaximized: false,
        isDefault: false,
        isRequired: false,
        workspaceContextId: 'test-context',
        timestamp: 1234567890,
      };
      
      const newScreenBounds: ScreenBounds = { x: 100, y: 200, width: 300, height: 400 };
      
      viewport.mutate(targetViewport, snapshot, newScreenBounds);
      
      expect(targetViewport.proportionalBounds).toEqual(snapshot.bounds);
      expect(targetViewport.isDefault).toBe(snapshot.isDefault);
      expect(targetViewport.isMinimized).toBe(snapshot.isMinimized);
      expect(targetViewport.isRequired).toBe(snapshot.isRequired);
      expect(targetViewport.screenBounds).toEqual(newScreenBounds);
    });
  });

  describe('setMinimized', () => {
    it('should set isMinimized to true', () => {
      viewport.setMinimized(true);
      expect(viewport.isMinimized).toBe(true);
    });

    it('should set isMinimized to false', () => {
      viewport.isMinimized = true;
      viewport.setMinimized(false);
      expect(viewport.isMinimized).toBe(false);
    });

    it('should set isMaximized to false when minimizing', () => {
      viewport.isMaximized = true;
      viewport.setMinimized(true);
      expect(viewport.isMaximized).toBe(false);
      expect(viewport.isMinimized).toBe(true);
    });
  });

  describe('setMaximized', () => {
    it('should set isMaximized to true', () => {
      viewport.setMaximized(true);
      expect(viewport.isMaximized).toBe(true);
    });

    it('should set isMaximized to false', () => {
      viewport.isMaximized = true;
      viewport.setMaximized(false);
      expect(viewport.isMaximized).toBe(false);
    });

    it('should set isMinimized to false when maximizing', () => {
      viewport.isMinimized = true;
      viewport.setMaximized(true);
      expect(viewport.isMinimized).toBe(false);
      expect(viewport.isMaximized).toBe(true);
    });
  });

  describe('restore', () => {
    it('should reset both isMinimized and isMaximized to false', () => {
      viewport.isMinimized = true;
      viewport.isMaximized = true;
      viewport.restore();
      expect(viewport.isMinimized).toBe(false);
      expect(viewport.isMaximized).toBe(false);
    });

    it('should have no effect when already in normal state', () => {
      viewport.isMinimized = false;
      viewport.isMaximized = false;
      viewport.restore();
      expect(viewport.isMinimized).toBe(false);
      expect(viewport.isMaximized).toBe(false);
    });
  });
});