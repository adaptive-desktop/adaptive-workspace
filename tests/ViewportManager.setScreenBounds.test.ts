import { createTestWorkspaceFromSnapshotData } from './testWorkspaceFactory';
import { TestIdGenerator } from './TestIdGenerator';
import { ScreenBounds } from '../src/workspace/types';

describe('ViewportManager.setScreenBounds', () => {
  const idGenerator = new TestIdGenerator('test');

  it('should pick the correct context and calculate viewport screenBounds for landscape (ultrawide)', () => {
    const workspace = createTestWorkspaceFromSnapshotData({}, idGenerator);
  const ultrawideBounds: ScreenBounds = { x: 0, y: 0, width: 3440, height: 1440 };
  workspace.setScreenBounds(ultrawideBounds);
  const context = workspace.viewportManager.getCurrentContext();
  expect(context.id).toBe('ultrawide');
  const viewports = workspace.getViewports();
  expect(viewports.length).toBe(2);
  // Main viewport
  const main = viewports.find(v => v.id === 'main');
  expect(main).toBeDefined();
  expect(main!.screenBounds).toEqual({ x: 0, y: 0, width: 2580, height: 1440 });
  // Side viewport
  const side = viewports.find(v => v.id === 'side');
  expect(side).toBeDefined();
  expect(side!.screenBounds).toEqual({ x: 2580, y: 0, width: 860, height: 1440 });
  });

  it('should pick the correct context and calculate viewport screenBounds for portrait (phone)', () => {
    const workspace = createTestWorkspaceFromSnapshotData({}, idGenerator);
  const phoneBounds: ScreenBounds = { x: 0, y: 0, width: 375, height: 812 };
  workspace.setScreenBounds(phoneBounds);
  const context = workspace.viewportManager.getCurrentContext();
  expect(context.id).toBe('phone');
  const viewports = workspace.getViewports();
  expect(viewports.length).toBe(2);
  // Main viewport
  const main = viewports.find(v => v.id === 'main');
  expect(main).toBeDefined();
  expect(main).toBeDefined();
  expect(main!.screenBounds.x).toBe(0);
  expect(main!.screenBounds.y).toBe(0);
  expect(main!.screenBounds.width).toBeCloseTo(281, 0);
  expect(main!.screenBounds.height).toBe(812);
  // Side viewport
  const side = viewports.find(v => v.id === 'side');
  expect(side).toBeDefined();
  expect(side).toBeDefined();
  expect(side!.screenBounds.x).toBe(0);
  expect(side!.screenBounds.y).toBe(0);
  expect(side!.screenBounds.width).toBe(94);
  expect(side!.screenBounds.height).toBe(812);
  });

  it('should switch from portrait to landscape and update context and viewport bounds', () => {
    const workspace = createTestWorkspaceFromSnapshotData({}, idGenerator);
  // Start with phone (portrait)
  const phoneBounds: ScreenBounds = { x: 0, y: 0, width: 375, height: 812 };
  workspace.setScreenBounds(phoneBounds);
  let context = workspace.viewportManager.getCurrentContext();
  expect(context.id).toBe('phone');
  // Switch to laptop (landscape)
  const laptopBounds: ScreenBounds = { x: 0, y: 0, width: 1440, height: 900 };
  workspace.setScreenBounds(laptopBounds);
  let error = null;
  try {
    context = workspace.viewportManager.getCurrentContext();
  } catch (e) {
    error = e;
    // Print available contexts and bounds for debugging
    // eslint-disable-next-line no-console
    const detector = workspace.viewportManager["workspaceContextDetector"];
    const collection = (detector as any).workspaceContextCollection;
    const contexts = Array.from((collection as any).contexts.values());
    console.log('Available contexts:', contexts);
    console.log('Screen bounds used:', laptopBounds);
  }
  expect(error).toBeNull();
  expect(context.id).toBe('laptop');
  const viewports = workspace.getViewports();
  expect(viewports.length).toBe(2);
  const main = viewports.find(v => v.id === 'main');
  expect(main).toBeDefined();
  expect(main!.screenBounds).toEqual({ x: 0, y: 0, width: 1080, height: 900 });
  const side = viewports.find(v => v.id === 'side');
  expect(side).toBeDefined();
  expect(side!.screenBounds).toEqual({ x: 0, y: 0, width: 360, height: 900 });
  });
});
