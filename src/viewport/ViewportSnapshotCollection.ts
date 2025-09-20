import { ViewportSnapshot } from '../viewport/types';

export class ViewportSnapshotCollection {
  private snapshots: ViewportSnapshot[] = [];

  constructor(snapshots?: ViewportSnapshot[]) {
    if (snapshots) this.snapshots = [...snapshots];
  }

  getAll(): ViewportSnapshot[] {
    return [...this.snapshots];
  }

  findById(id: string): ViewportSnapshot | undefined {
    return this.snapshots.find(s => s.id === id);
  }

  update(partial: Partial<ViewportSnapshot> & { id: string }): boolean {
    const snap = this.snapshots.find(s => s.id === partial.id);
    if (!snap) return false;
    Object.assign(snap, partial);
    return true;
  }

  add(snapshot: ViewportSnapshot): void {
    this.snapshots.push(snapshot);
  }

  remove(id: string): boolean {
    const idx = this.snapshots.findIndex(s => s.id === id);
    if (idx === -1) return false;
    this.snapshots.splice(idx, 1);
    return true;
  }
}
