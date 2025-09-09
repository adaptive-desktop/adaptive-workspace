/**
 * @fileoverview Workspace factory class
 *
 * Factory class for creating workspaces with auto-generated IDs.
 */

import { Workspace } from './Workspace';
import { ScreenBounds } from './types';
import { IdGenerator } from '../shared/types';

/**
 * Configuration for creating a workspace via WorkspaceFactory
 */
export interface WorkspaceFactoryConfig extends ScreenBounds {
  idGenerator: IdGenerator; // Required - explicit ID generation strategy
}

/**
 * WorkspaceFactory class
 *
 * Factory for creating workspace instances with auto-generated IDs.
 */
export class WorkspaceFactory {
  /**
   * Create a new workspace
   *
   * Creates a workspace with the provided ID generator and starts empty (no viewports).
   *
   * @param config - Configuration including screen bounds and ID generator
   * @returns New workspace instance with auto-generated ID
   */
  static create(config: WorkspaceFactoryConfig): Workspace {
    const id = config.idGenerator.generate();
    return new Workspace({
      id,
      screenBounds: { x: config.x, y: config.y, width: config.width, height: config.height },
      idGenerator: config.idGenerator,
    });
  }

  /**
   * Create a workspace with an initial viewport
   *
   * Creates a workspace and adds a single viewport that spans the full workspace.
   *
   * @param config - Configuration including screen bounds and ID generator
   * @returns New workspace instance with one viewport
   */
  static createWithViewport(config: WorkspaceFactoryConfig): Workspace {
    const workspace = WorkspaceFactory.create(config);
    // TODO: Add viewport when createViewport is implemented
    // workspace.createViewport();
    return workspace;
  }
}
