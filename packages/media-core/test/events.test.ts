import { describe, it, expect, vi } from 'vitest';
import { MediaEventEmitter } from '../src/events';

describe('MediaEventEmitter', () => {
  it('should register listeners and receive events', () => {
    const emitter = new MediaEventEmitter();
    const mockCallback = vi.fn();
    
    emitter.on('view', mockCallback);
    emitter.emit('view', { mediaId: 123, mediaType: 'photo' });
    
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(expect.objectContaining({
      type: 'view',
      mediaId: 123,
      mediaType: 'photo'
    }));
  });

  it('should unsubscribe listeners correctly', () => {
    const emitter = new MediaEventEmitter();
    const mockCallback = vi.fn();
    
    const unsubscribe = emitter.on('download', mockCallback);
    unsubscribe();
    
    emitter.emit('download', { mediaId: 123, mediaType: 'photo' });
    expect(mockCallback).not.toHaveBeenCalled();
  });
});
