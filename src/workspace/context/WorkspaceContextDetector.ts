import { ScreenBounds } from '../types';
import { WorkspaceContext } from '../types';
import { WorkspaceContextCollection } from './WorkspaceContextCollection';

export class WorkspaceContextDetector {
  private workspaceContextCollection: WorkspaceContextCollection;

  constructor(workspaceContextCollection: WorkspaceContextCollection) {
    this.workspaceContextCollection = workspaceContextCollection;
  }

  detectContext(screenBounds: ScreenBounds): WorkspaceContext {
    let contexts = this.workspaceContextCollection.findByOrientation(
      this.getOrientation(screenBounds)
    );
    if (contexts.length === 0) {
      throw Error('No matching WorkspaceContext found. A future version will create a new context');
    }
    contexts = this.removeExcessiveSizeCategories(contexts, screenBounds);

    return this.extractContextWithClosestAspectRatio(contexts, screenBounds);
  }

  generateContextKey(context: WorkspaceContext): string {
    const { orientation, sizeCategory, maxScreenBounds } = context;

    return `${orientation}-${sizeCategory}-${maxScreenBounds.width}x${maxScreenBounds.height}`;
  }

  private extractContextWithClosestAspectRatio(
    contexts: WorkspaceContext[],
    screenBounds: ScreenBounds
  ): WorkspaceContext {
    let closestAspectRatio = Infinity;
    let closestContext: WorkspaceContext | null = null;
    for (const ctx of contexts) {
      const aspectRatio = Math.abs(
        this.getAspectRatio(ctx.maxScreenBounds) - this.getAspectRatio(screenBounds)
      );
      if (aspectRatio < closestAspectRatio) {
        closestAspectRatio = aspectRatio;
        closestContext = ctx;
      }

      return closestContext!;
    }
    throw new Error(
      'No matching WorkspaceContext found. A future version will create a new context'
    );
  }

  private removeExcessiveSizeCategories(
    contexts: WorkspaceContext[],
    screenBounds: ScreenBounds
  ): WorkspaceContext[] {
    const sizeCategory = this.getSizeCategory(screenBounds);
    const sizeCategories = ['xl', 'lg', 'md', 'sm'];
    const targetIndex = sizeCategories.indexOf(sizeCategory);

    if (targetIndex === -1) {
      throw new Error(
        'No matching WorkspaceContext found. A future version will create a new context'
      );
    }

    // Filter contexts that have a size category no larger than the target
    return contexts.filter((context) => {
      const contexSizeCategoryIndex = sizeCategories.indexOf(context.sizeCategory);
      return contexSizeCategoryIndex >= targetIndex;
    });
  }

  private getAspectRatio(screenBounds: ScreenBounds): number {
    return screenBounds.width / screenBounds.height;
  }

  private getSizeCategory(screenBounds: ScreenBounds): 'sm' | 'md' | 'lg' | 'xl' {
    if (screenBounds.width < 1024) return 'sm';
    if (screenBounds.width < 1600) return 'md';
    if (screenBounds.width < 2560) return 'lg';
    return 'xl';
  }

  private getOrientation(screenBounds: ScreenBounds): 'landscape' | 'portrait' {
    return screenBounds.width >= screenBounds.height ? 'landscape' : 'portrait';
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
