import { LayoutContext } from './types';

/**
 * Service for creating and restoring deep snapshots of LayoutContext
 */
export class LayoutSnapshotService {
  /**
   * Create a deep snapshot of the given LayoutContext
   */
  static createSnapshot(context: LayoutContext): object {
    // Deep copy: handles nested arrays/objects
    return JSON.parse(JSON.stringify(context));
  }

  /**
   * Restore a LayoutContext from a snapshot object
   */
  static restoreFromSnapshot(snapshot: object): LayoutContext {
    // Deep copy to ensure immutability
    return JSON.parse(JSON.stringify(snapshot));
  }
}
