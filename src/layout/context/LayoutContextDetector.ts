/**
 * @fileoverview Layout context detection utility
 */

import { ScreenBounds } from '../../workspace/types';
import { LayoutContext } from '../types';

export class LayoutContextDetector {
  static detectContext(screenBounds: ScreenBounds): LayoutContext {
    const { width, height } = screenBounds;
    const aspectRatio = width / height;
    const orientation = width >= height ? 'landscape' : 'portrait';

    // Size breakpoints (based on width)
    const breakpoint = this.getBreakpoint(width);
    const sizeCategory = this.getSizeCategory(breakpoint);

    // Device type detection
    const deviceType = this.getDeviceType(width, aspectRatio);

    return {
      orientation,
      aspectRatio,
      breakpoint,
      sizeCategory,
      deviceType,
      screenBounds,
      // Default: single viewport covering the whole screen
      viewports: [
        {
          id: 'viewport-1',
          bounds: { x: 0, y: 0, width: 1, height: 1 },
        },
      ],
    };
  }

  static generateContextKey(context: LayoutContext): string {
    const { orientation, breakpoint, screenBounds } = context;
    return `${orientation}-${breakpoint}-${screenBounds.width}x${screenBounds.height}`;
  }

  private static getBreakpoint(width: number): 'sm' | 'md' | 'lg' | 'xl' {
    if (width < 1024) return 'sm';
    if (width < 1600) return 'md';
    if (width < 2560) return 'lg';
    return 'xl';
  }

  private static getSizeCategory(breakpoint: string): 'small' | 'medium' | 'large' | 'extra-large' {
    switch (breakpoint) {
      case 'sm':
        return 'small';
      case 'md':
        return 'medium';
      case 'lg':
        return 'large';
      case 'xl':
        return 'extra-large';
      default:
        return 'medium';
    }
  }

  private static getDeviceType(
    width: number,
    aspectRatio: number
  ):
    | 'small-tablet'
    | 'large-tablet'
    | 'compact-laptop'
    | 'standard-laptop'
    | 'large-laptop'
    | 'desktop'
    | 'ultrawide'
    | 'wall-display'
    | 'tv'
    | 'phone'
    | 'phablet'
    | 'foldable' {
    // Ultrawide monitors - 21:9, 32:9 aspect ratios
    if (aspectRatio > 2.2) return 'ultrawide';

    // Wall displays - very large screens (digital signage, conference rooms)
    if (width > 3000) return 'wall-display';

    // TV displays - large consumer displays used as monitors (16:9 and similar)
    if (width > 2000 && width <= 3000 && aspectRatio >= 1.7 && aspectRatio <= 1.9) return 'tv';

    // Foldable devices - very wide when unfolded
    if (width >= 600 && width < 1200 && aspectRatio > 1.8 && aspectRatio <= 2.1) return 'foldable';

    // Desktop monitors - larger than laptops, standard aspect ratios
    if (width > 2000 && aspectRatio >= 1.3 && aspectRatio <= 1.8) return 'desktop';

    // Phone detection - small screens with tall aspect ratios
    if (width < 500 && aspectRatio < 0.6) return 'phone';

    // Phablet - larger phones, small tablets in portrait
    if (width >= 500 && width < 700 && (aspectRatio < 0.7 || aspectRatio > 1.4)) return 'phablet';

    // Small tablet: 600–899px width, aspect ratio 0.7–1.6
    if (width >= 600 && width < 900 && aspectRatio >= 0.7 && aspectRatio <= 1.6)
      return 'small-tablet';

    // Large tablet: 900–1199px width, aspect ratio 0.7–1.6
    if (width >= 900 && width < 1200 && aspectRatio >= 0.7 && aspectRatio <= 1.6)
      return 'large-tablet';

    // Compact laptop: 1200–1399px width, aspect ratio 1.3–1.8
    if (width >= 1200 && width < 1400 && aspectRatio >= 1.3 && aspectRatio <= 1.8)
      return 'compact-laptop';

    // Standard laptop: 1400–1799px width, aspect ratio 1.3–1.8
    if (width >= 1400 && width < 1800 && aspectRatio >= 1.3 && aspectRatio <= 1.8)
      return 'standard-laptop';

    // Large laptop: 1800–2000px width, aspect ratio 1.3–1.8
    if (width >= 1800 && width <= 2000 && aspectRatio >= 1.3 && aspectRatio <= 1.8)
      return 'large-laptop';

    // Default to desktop for anything else
    return 'desktop';
  }
}
