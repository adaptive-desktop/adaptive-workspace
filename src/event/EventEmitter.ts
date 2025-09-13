import { LayoutEventType, LayoutEventEmitter } from './types';

// Simple event emitter implementation
export class EventEmitter implements LayoutEventEmitter {
  private handlers: Map<LayoutEventType, Set<(payload: any) => void>> = new Map();

  on(event: LayoutEventType, handler: (payload: any) => void): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
  }

  off(event: LayoutEventType, handler: (payload: any) => void): void {
    this.handlers.get(event)?.delete(handler);
  }

  emit(event: LayoutEventType, payload: any): void {
    this.handlers.get(event)?.forEach((handler) => handler(payload));
  }
}
