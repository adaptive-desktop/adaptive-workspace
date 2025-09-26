import { createTestWorkspaceFromSnapshotData } from '../../../tests/testWorkspaceFactory';
import { ScreenBounds } from '../../workspace/types';

describe('ViewportManager.setScreenBounds', () => {
  it('should pick the correct context and calculate viewport screenBounds for landscape (ultrawide)', () => {
    const workspace = createTestWorkspaceFromSnapshotData();
    const ultrawideBounds: ScreenBounds = { x: 0, y: 0, width: 3440, height: 1440 };
    workspace.setScreenBounds(ultrawideBounds);
    const context = workspace.getCurrentContext();
    expect(context).toBeDefined();
    expect(context!.id).toBe('ultrawide');
    expect(workspace.viewports.size).toBe(2);
    // Main viewport
    const main = workspace.viewports.get('main');
    expect(main).toBeDefined();
    expect(main!.screenBounds).toEqual({ x: 0, y: 0, width: 2580, height: 1440 });
    // Side viewport
    const side = workspace.viewports.get('side');
    expect(side).toBeDefined();
    expect(side!.screenBounds).toEqual({ x: 2580, y: 0, width: 860, height: 1440 });
  });

  it('should pick the correct context and calculate viewport screenBounds for portrait (phone)', () => {
    const workspace = createTestWorkspaceFromSnapshotData();
    const phoneBounds: ScreenBounds = { x: 0, y: 0, width: 375, height: 812 };
    workspace.setScreenBounds(phoneBounds);
    const context = workspace.getCurrentContext();
    expect(context).toBeDefined();
    expect(context!.id).toBe('phone');
    expect(workspace.viewports.size).toBe(2);
    // Main viewport
    const main = workspace.viewports.get('main');
    expect(main).toBeDefined();
    expect(main!.screenBounds.x).toBe(0);
    expect(main!.screenBounds.y).toBe(0);
    expect(main!.screenBounds.width).toBeCloseTo(375);
    expect(main!.screenBounds.height).toBeCloseTo(406);
    // Side viewport
    const side = workspace.viewports.get('side');
    expect(side).toBeDefined();
    expect(side!.screenBounds.x).toBe(0);
    expect(side!.screenBounds.y).toBeCloseTo(406);
    expect(side!.screenBounds.width).toBeCloseTo(375);
    expect(side!.screenBounds.height).toBe(406);
  });

  it('should pick the correct context and calculate viewport screenBounds for an odd sized laptop (laptop)', () => {
    const workspace = createTestWorkspaceFromSnapshotData();
    const laptopBounds: ScreenBounds = { x: 0, y: 0, width: 1000, height: 800 };
    workspace.setScreenBounds(laptopBounds);
    const context = workspace.getCurrentContext();
    expect(context).toBeDefined();
    expect(context!.id).toBe('laptop');
    expect(workspace.viewports.size).toBe(2);
    // Main viewport
    const main = workspace.viewports.get('main');
    expect(main).toBeDefined();
    expect(main!.screenBounds.x).toBe(0);
    expect(main!.screenBounds.y).toBe(0);
    expect(main!.screenBounds.width).toBeCloseTo(750);
    expect(main!.screenBounds.height).toBeCloseTo(800);
    // Side viewport
    const side = workspace.viewports.get('side');
    expect(side).toBeDefined();
    expect(side!.screenBounds.x).toBeCloseTo(750);
    expect(side!.screenBounds.y).toBe(0);
    expect(side!.screenBounds.width).toBeCloseTo(250);
    expect(side!.screenBounds.height).toBe(800);
  });

  it('should switch from portrait to landscape and update context and viewport bounds', () => {
    const workspace = createTestWorkspaceFromSnapshotData();
    // Start with phone (portrait)
    const phoneBounds: ScreenBounds = { x: 0, y: 0, width: 375, height: 812 };

    workspace.setScreenBounds(phoneBounds);
    let context = workspace.getCurrentContext();
    expect(context).toBeDefined();
    expect(context!.id).toBe('phone');
    expect(workspace.viewports.size).toBe(2);
    // Main viewport
    let main = workspace.viewports.get('main');
    expect(main).toBeDefined();
    expect(main!.screenBounds.x).toBe(0);
    expect(main!.screenBounds.y).toBe(0);
    expect(main!.screenBounds.width).toBe(375);
    expect(main!.screenBounds.height).toBeCloseTo(406);
    // Side viewport
    let side = workspace.viewports.get('side');
    expect(side).toBeDefined();
    expect(side!.screenBounds.x).toBe(0);
    expect(side!.screenBounds.y).toBeCloseTo(406);
    expect(side!.screenBounds.width).toBe(375);
    expect(side!.screenBounds.height).toBeCloseTo(406);

    // Switch to laptop (landscape)
    const laptopBounds: ScreenBounds = { x: 0, y: 0, width: 1440, height: 900 };
    workspace.setScreenBounds(laptopBounds);
    context = workspace.getCurrentContext();
    expect(context).toBeDefined();
    expect(context!.id).toBe('laptop');
    expect(workspace.viewports.size).toBe(2);
    // Main viewport
    main = workspace.viewports.get('main');
    expect(main).toBeDefined();
    expect(main!.screenBounds.x).toBe(0);
    expect(main!.screenBounds.y).toBe(0);
    expect(main!.screenBounds.width).toBeCloseTo(1080);
    expect(main!.screenBounds.height).toBeCloseTo(900);
    // Side viewport
    side = workspace.viewports.get('side');
    expect(side).toBeDefined();
    expect(side!.screenBounds.x).toBeCloseTo(1080);
    expect(side!.screenBounds.y).toBe(0);
    expect(side!.screenBounds.width).toBeCloseTo(360);
    expect(side!.screenBounds.height).toBe(900);
  });
});
