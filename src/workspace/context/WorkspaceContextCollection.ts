import { WorkspaceContext } from '../types';
import { ViewportSnapshot } from '../../viewport/types';

export class WorkspaceContextCollection {
  private contexts: Map<string, WorkspaceContext> = new Map();

  constructor(contexts?: WorkspaceContext[]) {
    if (contexts) {
      for (const ctx of contexts) {
        if (ctx.id) this.contexts.set(ctx.id, ctx);
      }
    }
  }

  [Symbol.iterator]() {
    return this.contexts.values();
  }

  addContext(context: WorkspaceContext): void {
    if (context.id) {
      this.contexts.set(context.id, context);
    }
  }

  getAll(): WorkspaceContext[] {
    return Array.from(this.contexts.values());
  }

  removeContext(context: WorkspaceContext): boolean {
    if (!context.id) {
      return false;
    }
    return this.contexts.delete(context.id);
  }

  removeViewport(viewport: ViewportSnapshot): boolean {
    let removed = false;
    for (const context of this.contexts.values()) {
      if (context.snapshots.remove(viewport)) {
        removed = true;
      }
    }
    return removed;
  }

  updateViewport(partial: Partial<ViewportSnapshot> & { id: string }): boolean {
    let updated = false;
    for (const context of this.contexts.values()) {
      if (context.snapshots.update(partial)) {
        updated = true;
      }
    }
    return updated;
  }
}
