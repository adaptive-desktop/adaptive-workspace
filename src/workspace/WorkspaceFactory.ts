/**
 * @fileoverview Workspace factory class
 *
 * Factory class for creating workspaces with auto-generated IDs.
 */

import { ulid } from 'ulid';
import { Workspace } from './Workspace';
import { ScreenBounds } from './types';

/**
 * WorkspaceFactory class
 *
 * Factory for creating workspace instances with auto-generated IDs.
 */
export class WorkspaceFactory {
  /**
   * Create a new workspace
   *
   * Creates a workspace with auto-generated ULID and starts empty (no viewports).
   *
   * @param position - Screen bounds for the workspace
   * @returns New workspace instance with auto-generated ID
   */
  static create(position: ScreenBounds): Workspace {
    const id = ulid();
    return new Workspace({
      id,
      position,
    });
  }

  /**
   * Create a workspace with an initial viewport
   *
   * Creates a workspace and adds a single viewport that spans the full workspace.
   *
   * @param position - Screen bounds for the workspace
   * @returns New workspace instance with one viewport
   */
  static createWithViewport(position: ScreenBounds): Workspace {
    const workspace = WorkspaceFactory.create(position);
    // TODO: Add viewport when createViewport is implemented
    // workspace.createViewport();
    return workspace;
  }
}
