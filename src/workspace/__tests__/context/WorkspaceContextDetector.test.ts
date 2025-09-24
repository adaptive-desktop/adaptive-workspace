describe('WorkspaceContextDetector - real world transitions', () => {
  let collection: WorkspaceContextCollection;
  let detector: WorkspaceContextDetector;
  beforeEach(() => {
    const contexts: WorkspaceContext[] = [
      createContext({
        id: 'ultrawide',
        orientation: 'landscape',
        maxScreenBounds: { x: 0, y: 0, width: 3440, height: 1440 },
        aspectRatio: 3440 / 1440,
        deviceType: 'ultrawide',
        sizeCategory: 'lg',
      }),
      createContext({
        id: 'laptop',
        sizeCategory: 'md',
        orientation: 'landscape',
        maxScreenBounds: { x: 0, y: 0, width: 1440, height: 900 },
        aspectRatio: 1440 / 900,
        deviceType: 'standard-laptop',
      }),
      createContext({
        id: 'phone',
        sizeCategory: 'sm',
        orientation: 'portrait',
        maxScreenBounds: { x: 0, y: 0, width: 375, height: 812 },
        aspectRatio: 375 / 812,
        deviceType: 'phone',
      }),
    ];
    collection = new WorkspaceContextCollection(contexts);
    detector = new WorkspaceContextDetector(collection);
  });

  it('should match ultrawide context for ultrawide bounds', () => {
    const bounds: ScreenBounds = { x: 0, y: 0, width: 3440, height: 1440 };
    const context = detector.detectContext(bounds);
    expect(context.id).toBe('ultrawide');
  });

  it('should match laptop context for laptop bounds', () => {
    const bounds: ScreenBounds = { x: 0, y: 0, width: 1440, height: 900 };
    const context = detector.detectContext(bounds);
    expect(context.id).toBe('laptop');
  });

  it('should match phone context for phone bounds', () => {
    const bounds: ScreenBounds = { x: 0, y: 0, width: 375, height: 812 };
    const context = detector.detectContext(bounds);
    expect(context.id).toBe('phone');
  });

  it('should match closest context when moving from phone to laptop (portrait to landscape)', () => {
    // Start with phone
    let bounds: ScreenBounds = { x: 0, y: 0, width: 375, height: 812 };
    let context = detector.detectContext(bounds);
    expect(context.id).toBe('phone');
    // Switch to laptop
    bounds = { x: 0, y: 0, width: 1440, height: 900 };
    context = detector.detectContext(bounds);
    expect(context.id).toBe('laptop');
  });

  it('should match closest context when moving from laptop to ultrawide (ratio change)', () => {
    // Start with laptop
    let bounds: ScreenBounds = { x: 0, y: 0, width: 1440, height: 900 };
    let context = detector.detectContext(bounds);
    expect(context.id).toBe('laptop');
    // Switch to ultrawide
    bounds = { x: 0, y: 0, width: 3440, height: 1440 };
    context = detector.detectContext(bounds);
    expect(context.id).toBe('ultrawide');
  });

  it('should match closest context when moving from ultrawide to phone (large to small, landscape to portrait)', () => {
    // Start with ultrawide
    let bounds: ScreenBounds = { x: 0, y: 0, width: 3440, height: 1440 };
    let context = detector.detectContext(bounds);
    expect(context.id).toBe('ultrawide');
    // Switch to phone
    bounds = { x: 0, y: 0, width: 375, height: 812 };
    context = detector.detectContext(bounds);
    expect(context.id).toBe('phone');
  });

  it('should match closest context for unknown but similar bounds (e.g. 1500x900, expect laptop)', () => {
    const bounds: ScreenBounds = { x: 0, y: 0, width: 1500, height: 900 };
    const context = detector.detectContext(bounds);
    expect(context.id).toBe('laptop');
  });

  it('should match closest context for unknown portrait bounds (e.g. 400x900, expect phone)', () => {
    const bounds: ScreenBounds = { x: 0, y: 0, width: 400, height: 900 };
    const context = detector.detectContext(bounds);
    expect(context.id).toBe('phone');
  });

  it('should match closest context for unknown ultrawide bounds (e.g. 3000x1200, expect ultrawide)', () => {
    const bounds: ScreenBounds = { x: 0, y: 0, width: 3000, height: 1200 };
    const context = detector.detectContext(bounds);
    expect(context.id).toBe('ultrawide');
  });
});
import { WorkspaceContextDetector } from '../../context/WorkspaceContextDetector';
import { WorkspaceContextCollection } from '../../context/WorkspaceContextCollection';
import { ScreenBounds, WorkspaceContext } from '../../../workspace/types';

// Helper to create a minimal WorkspaceContext

import { ViewportSnapshotCollection } from '../../../viewport/snapshot/ViewportSnapshotCollection';

let contextId = 0;
function createContext(overrides: Partial<WorkspaceContext> = {}): WorkspaceContext {
  contextId += 1;
  return {
    id: `ctx-${contextId}`,
    orientation: 'landscape',
    sizeCategory: 'md',
    maxScreenBounds: { x: 0, y: 0, width: 1920, height: 1080 },
    aspectRatio: 16 / 9,
    deviceType: 'desktop',
    minimumViewportScreenHeight: 100,
    minimumViewportScreenWidth: 100,
    snapshots: new ViewportSnapshotCollection(),
    ...overrides,
  };
}

describe('WorkspaceContextDetector', () => {
  let collection: WorkspaceContextCollection;
  let detector: WorkspaceContextDetector;

  beforeEach(() => {
    // For these tests, we provide a collection with both orientations and various sizes
    const contexts: WorkspaceContext[] = [
      createContext({
        orientation: 'landscape',
        sizeCategory: 'md',
        maxScreenBounds: { x: 0, y: 0, width: 1920, height: 1080 },
      }),
      // Match the test bounds for portrait: width: 800, height: 1200
      createContext({
        orientation: 'portrait',
        sizeCategory: 'sm',
        maxScreenBounds: { x: 0, y: 0, width: 800, height: 1200 },
        aspectRatio: 800 / 1200,
        deviceType: 'phablet',
      }),
      createContext({
        orientation: 'landscape',
        sizeCategory: 'sm',
        maxScreenBounds: { x: 0, y: 0, width: 1000, height: 1000 },
      }),
    ];
    collection = new WorkspaceContextCollection(contexts);
    detector = new WorkspaceContextDetector(collection);
  });

  describe('detectContext()', () => {
    it('should detect landscape context when width > height', () => {
      // eslint-disable-next-line no-console
      console.log('TEST: should detect landscape context when width > height');
      const bounds: ScreenBounds = { x: 0, y: 0, width: 1920, height: 1080 };
      const context = detector.detectContext(bounds);
      expect(context.orientation).toBe('landscape');
    });

    it('should detect portrait context when height > width', () => {
      // eslint-disable-next-line no-console
      console.log('TEST: should detect portrait context when height > width');
      const bounds: ScreenBounds = { x: 0, y: 0, width: 800, height: 1200 };
      const context = detector.detectContext(bounds);
      expect(context.orientation).toBe('portrait');
    });

    it('should detect landscape context when width equals height (square)', () => {
      // eslint-disable-next-line no-console
      console.log('TEST: should detect landscape context when width equals height (square)');
      const bounds: ScreenBounds = { x: 0, y: 0, width: 1000, height: 1000 };
      const context = detector.detectContext(bounds);
      expect(context.orientation).toBe('landscape');
    });
  });

  describe('generateContextKey()', () => {
    it('should generate a consistent key for a context', () => {
      const context = createContext({
        orientation: 'landscape',
        sizeCategory: 'md',
        maxScreenBounds: { x: 0, y: 0, width: 1920, height: 1080 },
      });
      const key = detector.generateContextKey(context);
      expect(key).toBe('landscape-md-1920x1080');
    });
  });
});
