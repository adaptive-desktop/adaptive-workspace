import { MutableViewport } from './MutableViewport';
import { ViewportSnapshotCollection } from './snapshot/ViewportSnapshotCollection';
import { ViewportSnapshot } from './types';
import { ScreenBounds, WorkspaceContext } from '../workspace/types';

/**
 * Class responsible for mutating the set of MutableViewports in ViewportManager
 * based on a ViewportSnapshotCollection.
 */
export class ViewportMutator {
  private viewports: Map<string, MutableViewport>;
  private workspaceBounds!: ScreenBounds;

  constructor(viewports: Map<string, MutableViewport>) {
    this.viewports = viewports;
  }

  addViewport(viewport: MutableViewport) {
    this.viewports.set(viewport.id, viewport);
  }

  removeViewport(id: string) {
    this.viewports.delete(id);
  }

  updateViewport(id: string, updater: (v: MutableViewport) => void) {
    const viewport = this.viewports.get(id);
    if (viewport) {
      updater(viewport);
    }
  }

  mutateFromWorkspaceContext(context: WorkspaceContext, workspaceBounds: ScreenBounds) {
    this.mutateFromSnapshots(context.viewportSnapshots, workspaceBounds);
  }

  mutateFromSnapshots(snapshots: ViewportSnapshotCollection, workspaceBounds: ScreenBounds) {
    this.workspaceBounds = workspaceBounds;
    this.removeUntrackedViewports(snapshots);
    this.addNewViewports(snapshots);
    this.recalculateScreenBoundsForViewports(snapshots);
  }

  private addNewViewports(snapshots: ViewportSnapshotCollection) {
    for (const snapshot of snapshots.getAll()) {
      if (!this.viewports.has(snapshot.id)) {
        this.createViewportFromSnapshot(snapshot);
      }
    }
  }

  private createViewportFromSnapshot(snapshot: ViewportSnapshot): MutableViewport {
    const viewport = new MutableViewport({
      id: snapshot.id,
      proportionalBounds: snapshot.bounds!,
      isDefault: snapshot.isDefault,
      isMinimized: snapshot.isMinimized,
      isMaximized: snapshot.isMaximized,
      isRequired: snapshot.isRequired,
    });
    this.addViewport(viewport);
    return viewport;
  }

  private recalculateScreenBoundsForViewports(snapshots: ViewportSnapshotCollection) {
    const screenBoundsMap = new Map<string, ScreenBounds>();

    // Calculate screen bounds for all snapshots
    for (const snapshot of snapshots.getAll()) {
      screenBoundsMap.set(snapshot.id, this.calculateScreenBounds(snapshot));
    }

    // Update viewports with new screen bounds
    for (const [id, viewport] of this.viewports) {
      const snapshot = snapshots.findById(id);
      if (snapshot && screenBoundsMap.has(id)) {
        viewport.mutate(snapshot, screenBoundsMap.get(id)!);
      }
    }
  }

  private calculateScreenBounds(snapshot: ViewportSnapshot): ScreenBounds {
    // this is a problem when there is a minimized snapshot, without bounds
    // maximized snapshot (there can only be one) forces the non-locked viewports to be minimized,
    // then the maximized viewport will have its bounds to be calculated to the maximum area of non-locked viewports
    // when a viewport is maximized, just the screen bounds is set, the original proportionalBounds remains the same
    if (!snapshot.bounds) {
      throw new Error('Cannot calculate screen bounds without proportional bounds');
    }

    // this needs to make sure the

    const { x, y, width, height } = snapshot.bounds;
    const {
      x: workspaceX,
      y: workspaceY,
      width: workspaceWidth,
      height: workspaceHeight,
    } = this.workspaceBounds;

    return {
      x: Math.round(workspaceX + x * workspaceWidth),
      y: Math.round(workspaceY + y * workspaceHeight),
      width: Math.round(width * workspaceWidth),
      height: Math.round(height * workspaceHeight),
    };
  }

  private removeUntrackedViewports(snapshots: ViewportSnapshotCollection) {
    for (const [id] of this.viewports) {
      if (!snapshots.findById(id)) {
        this.removeViewport(id);
      }
    }
  }
}
