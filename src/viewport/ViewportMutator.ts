import { MutableViewport } from './MutableViewport';
import { ViewportSnapshotCollection } from './snapshot/ViewportSnapshotCollection';
import { ViewportSnapshot } from './types';
import { ScreenBounds } from '../workspace/types';

/**
 * Class responsible for mutating the set of MutableViewports in ViewportManager
 * based on a ViewportSnapshotCollection.
 */
export class ViewportMutator {
  private viewports: Map<string, MutableViewport>;
  private workspaceBounds: ScreenBounds;

  constructor(viewports: Map<string, MutableViewport>, workspaceBounds: ScreenBounds) {
    this.viewports = viewports;
    this.workspaceBounds = workspaceBounds;
  }

  mutateFromSnapshots(snapshots: ViewportSnapshotCollection) {
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
    this.viewports.set(snapshot.id, viewport);
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
    if (!snapshot.bounds) {
      throw new Error('Cannot calculate screen bounds without proportional bounds');
    }
    
    const { x, y, width, height } = snapshot.bounds;
    const { x: workspaceX, y: workspaceY, width: workspaceWidth, height: workspaceHeight } = this.workspaceBounds;
    
    return {
      x: workspaceX + x * workspaceWidth,
      y: workspaceY + y * workspaceHeight,
      width: width * workspaceWidth,
      height: height * workspaceHeight
    };
  }

  private removeUntrackedViewports(snapshots: ViewportSnapshotCollection) {
    for (const [id] of this.viewports) {
      if (!snapshots.findById(id)) {
        this.viewports.delete(id);
      }
    }
  }
}
