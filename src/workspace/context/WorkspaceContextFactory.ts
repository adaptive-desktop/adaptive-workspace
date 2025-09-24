import { ViewportSnapshotCollection } from '../../viewport/snapshot/ViewportSnapshotCollection';
import { WorkspaceContext, WorkspaceContextSnapshot } from '../types';

export class WorkspaceContextFactory {
  fromSnapshot(snapshot: WorkspaceContextSnapshot): WorkspaceContext {
    const snapshotCollection = new ViewportSnapshotCollection();

    for (const viewportSnapshot of snapshot.snapshots) {
      snapshotCollection.add(viewportSnapshot);
    }

    return {
      id: snapshot.id,
      name: snapshot.name,
      maxScreenBounds: snapshot.maxScreenBounds,
      snapshots: snapshotCollection,
      orientation: snapshot.orientation,
      aspectRatio: snapshot.aspectRatio,
      sizeCategory: snapshot.sizeCategory,
      deviceType: snapshot.deviceType,
      minimumViewportScreenHeight: snapshot.minimumViewportScreenHeight,
      minimumViewportScreenWidth: snapshot.minimumViewportScreenWidth,
    };
  }
}
