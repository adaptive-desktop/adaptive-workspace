import type { LayoutEventType, LayoutEventPayloadMap } from './types';

// Simple event emitter implementation
export class EventEmitter {
  private handlers: Map<LayoutEventType, Set<(payload: unknown) => void>> = new Map();

  on<K extends LayoutEventType>(
    event: K,
    handler: (payload: LayoutEventPayloadMap[K]) => void
  ): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    // TypeScript can't enforce the handler type at runtime, so we cast
    this.handlers.get(event)!.add(handler as (payload: unknown) => void);
  }

  off<K extends LayoutEventType>(
    _event: K,
    _handler: (payload: LayoutEventPayloadMap[K]) => void
  ): void {
    // This method is required by the interface, but may not be used in all cases
    // so we prefix args with _ to avoid lint errors.
    this.handlers.get(_event)?.delete(_handler as (payload: unknown) => void);
  }

  emit<K extends LayoutEventType>(event: K, payload: LayoutEventPayloadMap[K]): void {
    this.handlers
      .get(event)
      ?.forEach((handler) => (handler as (payload: LayoutEventPayloadMap[K]) => void)(payload));
  }
}
