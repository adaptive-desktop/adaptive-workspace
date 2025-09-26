import { IdGenerator } from '../shared/types';
import { Workspace } from './Workspace';
import { ScreenBounds, WorkspaceSnapshot } from './types';
import { WorkspaceContextFactory } from './context/WorkspaceContextFactory';
import { WorkspaceContextCollection } from './context/WorkspaceContextCollection';

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
  create(): Workspace {
    const id = this.idGenerator.generate();
    return new Workspace({
      id,
      name: '',
      idGenerator: this.idGenerator,
      workspaceContexts: new WorkspaceContextCollection(),
    });
  }

  fromSnapshot(workspaceSnapshot: WorkspaceSnapshot, screenBounds: ScreenBounds): Workspace {
    const contextFactory = new WorkspaceContextFactory();
    const workspaceContexts = workspaceSnapshot.workspaceContexts.map((contextSnapshot) =>
      contextFactory.fromSnapshot(contextSnapshot)
    );

    const workspace = new Workspace({
      id: workspaceSnapshot.id,
      name: workspaceSnapshot.name,
      idGenerator: this.idGenerator,
      workspaceContexts: new WorkspaceContextCollection(workspaceContexts),
    });
    workspace.setScreenBounds(screenBounds);

    return workspace;
  }
}
