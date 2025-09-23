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
    breakpoint: 'md',
    maxScreenBounds: { x: 0, y: 0, width: 1920, height: 1080 },
    sizeCategory: 'large',
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
        breakpoint: 'md',
        maxScreenBounds: { x: 0, y: 0, width: 1920, height: 1080 },
        sizeCategory: 'large',
      }),
      // Match the test bounds for portrait: width: 800, height: 1200
      createContext({
        orientation: 'portrait',
        breakpoint: 'sm',
        maxScreenBounds: { x: 0, y: 0, width: 800, height: 1200 },
        sizeCategory: 'small',
        aspectRatio: 800 / 1200,
        deviceType: 'phablet',
      }),
      createContext({
        orientation: 'landscape',
        breakpoint: 'sm',
        maxScreenBounds: { x: 0, y: 0, width: 1000, height: 1000 },
        sizeCategory: 'small',
      }),
    ];
    collection = new WorkspaceContextCollection(contexts);
    detector = new WorkspaceContextDetector(collection);
  });

  describe('detectContext()', () => {
    it('should detect landscape context when width > height', () => {
      const bounds: ScreenBounds = { x: 0, y: 0, width: 1920, height: 1080 };
      const context = detector.detectContext(bounds);
      expect(context.orientation).toBe('landscape');
    });

    it('should detect portrait context when height > width', () => {
      const bounds: ScreenBounds = { x: 0, y: 0, width: 800, height: 1200 };
      const context = detector.detectContext(bounds);
      expect(context.orientation).toBe('portrait');
    });

    it('should detect landscape context when width equals height (square)', () => {
      const bounds: ScreenBounds = { x: 0, y: 0, width: 1000, height: 1000 };
      const context = detector.detectContext(bounds);
      expect(context.orientation).toBe('landscape');
    });
  });

  describe('generateContextKey()', () => {
    it('should generate a consistent key for a context', () => {
      const context = createContext({
        orientation: 'landscape',
        breakpoint: 'md',
        maxScreenBounds: { x: 0, y: 0, width: 1920, height: 1080 },
      });
      const key = detector.generateContextKey(context);
      expect(key).toBe('landscape-md-1920x1080');
    });
  });
});
