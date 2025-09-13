// Event types for layout context management and their payloads
export type LayoutEventType =
  | 'contextCreated'
  | 'contextUpdated'
  | 'contextRemoved'
  | 'snapshotCreated'
  | 'snapshotRestored';

// Payload map for each event type
export interface LayoutEventPayloadMap {
  contextCreated: { context: unknown };
  contextUpdated: { context: unknown };
  contextRemoved: { contextKey: string };
  snapshotCreated: { snapshot: unknown };
  snapshotRestored: { snapshot: unknown };
}

export interface LayoutEventEmitter {
  on<K extends LayoutEventType>(
    event: K,
    handler: (payload: LayoutEventPayloadMap[K]) => void
  ): void;
  off<K extends LayoutEventType>(
    event: K,
    handler: (payload: LayoutEventPayloadMap[K]) => void
  ): void;
  emit<K extends LayoutEventType>(event: K, payload: LayoutEventPayloadMap[K]): void;
}
