/**
 * @fileoverview Workspace context manager
 *
 * Manages workspace context detection and caching.
 */

import { WorkspaceContextDetector } from './WorkspaceContextDetector';
import { WorkspaceContext } from '../types';
import { ScreenBounds } from '../types';

export class WorkspaceContextManager {
  private contexts: Map<string, WorkspaceContext> = new Map();
  private currentContext: WorkspaceContext | null = null;

  getContext(screenBounds: ScreenBounds): WorkspaceContext {
    const context = WorkspaceContextDetector.detectContext(screenBounds);
    const key = WorkspaceContextDetector.generateContextKey(context);
    if (!this.contexts.has(key)) {
      this.contexts.set(key, context);
    }
    this.currentContext = context;
    return context;
  }

  getOrCreateContext(screenBounds: ScreenBounds): WorkspaceContext {
    const context = WorkspaceContextDetector.detectContext(screenBounds);
    const key = WorkspaceContextDetector.generateContextKey(context);
    if (!this.contexts.has(key)) {
      this.contexts.set(key, context);
    }
    return this.contexts.get(key)!;
  }

  getCurrentContext(): WorkspaceContext | null {
    return this.currentContext;
  }
}
