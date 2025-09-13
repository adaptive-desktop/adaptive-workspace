import { LayoutManager } from '../../LayoutManager';
import { ScreenBounds } from '../../../workspace/types';
import { TestIdGenerator } from '../../../shared/TestIdGenerator';

describe('LayoutManager - applyLayoutContext', () => {
  let layoutManager: LayoutManager;

  beforeEach(() => {
    layoutManager = new LayoutManager(new TestIdGenerator('viewport'));
  });

  it('should rebuild viewports from context descriptors', () => {
    const bounds: ScreenBounds = { x: 0, y: 0, width: 1200, height: 800 };
    const context = {
      orientation: 'landscape' as const,
      aspectRatio: 1.5,
      breakpoint: 'md' as const,
      sizeCategory: 'medium' as const,
      deviceType: 'standard-laptop' as const,
      screenBounds: bounds,
      viewports: [
        { id: 'vp-1', bounds: { x: 0, y: 0, width: 0.5, height: 1 } },
        { id: 'vp-2', bounds: { x: 0.5, y: 0, width: 0.5, height: 1 } },
      ],
    };
    layoutManager.applyLayoutContext(context);
    const vps = layoutManager.getViewports();
    expect(vps).toHaveLength(2);
    expect(vps[0].id).toBe('vp-1');
    expect(vps[1].id).toBe('vp-2');
    expect(vps[0].screenBounds.width).toBeCloseTo(600, 1);
    expect(vps[1].screenBounds.x).toBeCloseTo(600, 1);
  });
});
