import { MediaEventType, MediaEventPayload, EventCallback } from './types';

export class MediaEventEmitter {
  private listeners: Map<MediaEventType, Set<EventCallback>> = new Map();

  on(type: MediaEventType, callback: EventCallback): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(callback);
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(type);
      if (callbacks) {
        callbacks.delete(callback);
      }
    };
  }

  emit(type: MediaEventType, payload: Omit<MediaEventPayload, 'type' | 'timestamp'> & { timestamp?: number }): void {
    const fullPayload: MediaEventPayload = {
      ...payload,
      type,
      timestamp: payload.timestamp ?? Date.now(),
    };
    const callbacks = this.listeners.get(type);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(fullPayload);
        } catch (err) {
          console.error('Error in event listener:', err);
        }
      });
    }
  }
}
