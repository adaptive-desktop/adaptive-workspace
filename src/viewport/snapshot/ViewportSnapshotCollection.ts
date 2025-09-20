import { ViewportSnapshot } from '../types';

export class ViewportSnapshotCollection {
  private snapshots: Map<string, ViewportSnapshot> = new Map();

  constructor(snapshots?: ViewportSnapshot[]) {
    if (snapshots) {
      for (const snap of snapshots) {
        this.snapshots.set(snap.id, snap);
      }
    }
  }

  getAll(): ViewportSnapshot[] {
    return Array.from(this.snapshots.values());
  }

  findById(id: string): ViewportSnapshot | undefined {
    return this.snapshots.get(id);
  }

  update(partial: Partial<ViewportSnapshot> & { id: string }): boolean {
    const snap = this.snapshots.get(partial.id);
    if (!snap) return false;
    Object.assign(snap, partial);
    return true;
  }

  add(snapshot: ViewportSnapshot): void {
    this.snapshots.set(snapshot.id, snapshot);
  }

  remove(snapshot: ViewportSnapshot): boolean {
    return this.snapshots.delete(snapshot.id);
  }
}
