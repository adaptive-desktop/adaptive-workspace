import { WorkspaceContext } from '../types';
import { ViewportSnapshot } from '../../viewport/types';

export class WorkspaceContextCollection {
  private contexts: WorkspaceContext[] = [];

  constructor(contexts?: WorkspaceContext[]) {
    if (contexts) this.contexts = [...contexts];
  }

  [Symbol.iterator]() {
    return this.contexts[Symbol.iterator]();
  }

  getAll(): WorkspaceContext[] {
    return [...this.contexts];
  }

  removeViewport(viewport: ViewportSnapshot): boolean {
    let removed = false;
    for (const context of this.contexts) {
      if (context.snapshots.remove(viewport)) {
        removed = true;
      }
    }
    return removed;
  }

  updateViewport(partial: Partial<ViewportSnapshot> & { id: string }): boolean {
    let updated = false;
    for (const context of this.contexts) {
      if (context.snapshots.update(partial)) {
        updated = true;
      }
    }
    return updated;
  }

  addContext(context: WorkspaceContext): void {
    this.contexts.push(context);
  }

  removeContext(id: string): boolean {
    const idx = this.contexts.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    this.contexts.splice(idx, 1);
    return true;
  }
}
