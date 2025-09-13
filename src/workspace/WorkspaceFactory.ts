import { Workspace } from './Workspace';
import { ScreenBounds } from './types';
import { IdGenerator } from '../shared/types';
import type { LayoutContext } from '../layout/types';

/**
 * Configuration for creating a workspace via WorkspaceFactory
 */

export interface WorkspaceFactoryConfig extends ScreenBounds {}

export class WorkspaceFactory {
  private idGenerator: IdGenerator;

  constructor(idGenerator: IdGenerator) {
    this.idGenerator = idGenerator;
  }

  /**
   * Create a new workspace
   *
   * Creates a workspace with the provided screen bounds and starts empty (no viewports).
   *
   * @param config - Configuration including screen bounds
   * @returns New workspace instance with auto-generated ID
   */
  create(config: WorkspaceFactoryConfig): Workspace {
    const id = this.idGenerator.generate();
    return new Workspace({
      id,
      screenBounds: { x: config.x, y: config.y, width: config.width, height: config.height },
      idGenerator: this.idGenerator,
    });
  }

  /**
   * Create a workspace with an initial viewport
   *
   * Creates a workspace and adds a single viewport that spans the full workspace.
   *
   * @param config - Configuration including screen bounds
   * @returns New workspace instance with one viewport
   */
  createWithViewport(config: WorkspaceFactoryConfig): Workspace {
    const workspace = this.create(config);
    // TODO: Add viewport when createViewport is implemented
    // workspace.createViewport();
    return workspace;
  }

  fromSnapshot(
    snapshot: unknown,
    screenBounds: { x: number; y: number; width: number; height: number }
  ): Workspace {
    // Define the expected snapshot structure
    type SnapshotType = {
      workspaceId?: string;
      contexts: Record<string, LayoutContext>;
    };
    const snap = snapshot as SnapshotType;
    const contextKeys = Object.keys(snap.contexts);
    if (contextKeys.length === 0) throw new Error('No contexts in snapshot');
    const context = snap.contexts[contextKeys[0]];

    // Import LayoutManager directly (avoids require)
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { LayoutManager } = require('../layout/LayoutManager');
    const layoutManager = new LayoutManager(this.idGenerator);
    layoutManager.setScreenBounds(screenBounds);
    layoutManager.applyLayoutContext({ ...context, screenBounds });

    return new Workspace({
      id: snap.workspaceId || this.idGenerator.generate(),
      screenBounds,
      layout: layoutManager,
      idGenerator: this.idGenerator,
    });
  }
}
