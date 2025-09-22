import { Workspace } from './Workspace';
import { ScreenBounds, WorkspaceSnapshot } from './types';
import { IdGenerator } from '../shared/types';

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

  fromSnapshot(snapshot: WorkspaceSnapshot, screenBounds: ScreenBounds): Workspace {
    //
    // you haved to create each WorkspaceContext, in WorkspaceContextCollection
    // you need to determine the current WorkspaceContext,
    // then create the ViewportSnapshotCollection,
    // add the ViewportSnapshotCollection to each WorkspaceContext
    // and finally create and return the Workspace with the provided screen
    // bounds, workspace contexts and the ViewportManager
    //
    // it will be the responsibility of the calling code to call
    // Workspace.updateWorkspace(currentContext: WorkspaceConext)
    // to create the screen bounds for the viewports
  }
}
