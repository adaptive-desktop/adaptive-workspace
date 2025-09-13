import { LayoutContext } from './types';
import { LayoutContextDetector } from './context/LayoutContextDetector';
import { LayoutEventEmitter, EventEmitter, LayoutEventType, LayoutEventPayloadMap } from '../event';
import { ScreenBounds } from '../workspace/types';

export class LayoutContextManager {
  private contexts: Map<string, LayoutContext> = new Map();
  private emitter: LayoutEventEmitter;
  private currentContextKey: string | null = null;

  constructor(emitter?: LayoutEventEmitter) {
    this.emitter = emitter || new EventEmitter();
  }

  getContext(screenBounds: ScreenBounds): LayoutContext {
    const context = LayoutContextDetector.detectContext(screenBounds);
    const key = LayoutContextDetector.generateContextKey(context);
    if (!this.contexts.has(key)) {
      this.contexts.set(key, context);
      this.emitter.emit('contextCreated', { context });
    }
    this.currentContextKey = key;
    return this.contexts.get(key)!;
  }

  hasContext(screenBounds: ScreenBounds): boolean {
    const context = LayoutContextDetector.detectContext(screenBounds);
    const key = LayoutContextDetector.generateContextKey(context);
    return this.contexts.has(key);
  }

  removeContext(screenBounds: ScreenBounds): void {
    const context = LayoutContextDetector.detectContext(screenBounds);
    const key = LayoutContextDetector.generateContextKey(context);
    if (this.contexts.delete(key)) {
      this.emitter.emit('contextRemoved', { contextKey: key });
    }
    if (this.currentContextKey === key) {
      this.currentContextKey = null;
    }
  }

  createSnapshot(context: LayoutContext): object {
    // Replace with actual snapshot logic as needed
    const snapshot = { ...context };
    this.emitter.emit('snapshotCreated', { snapshot });
    return snapshot;
  }

  restoreFromSnapshot(snapshot: object): void {
    // Replace with actual restore logic as needed
    const context = snapshot as LayoutContext;
    const key = LayoutContextDetector.generateContextKey(context);
    this.contexts.set(key, context);
    this.emitter.emit('snapshotRestored', { snapshot });
  }

  on<K extends LayoutEventType>(
    event: K,
    handler: (payload: LayoutEventPayloadMap[K]) => void
  ): void {
    this.emitter.on(event, handler);
  }

  off<K extends LayoutEventType>(
    event: K,
    handler: (payload: LayoutEventPayloadMap[K]) => void
  ): void {
    this.emitter.off(event, handler);
  }

  getCurrentContext(): LayoutContext | null {
    if (this.currentContextKey) {
      return this.contexts.get(this.currentContextKey) || null;
    }
    return null;
  }
}
