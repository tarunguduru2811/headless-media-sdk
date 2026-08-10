import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { MediaClient } from '@media-sdk/core';
import { MediaProvider, useMediaClient } from '../src/context';
import { useMediaEvent } from '../src/hooks';

describe('Media Native Hooks', () => {
  it('useMediaClient should throw if outside provider', () => {
    // Suppress console.error for expected throw
    const originalError = console.error;
    console.error = vi.fn();
    
    expect(() => renderHook(() => useMediaClient())).toThrow('useMediaClient must be used within a MediaProvider');
    
    console.error = originalError;
  });

  it('useMediaClient should return client from context', () => {
    const client = new MediaClient({ apiKey: 'test' });
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MediaProvider client={client}>{children}</MediaProvider>
    );

    const { result } = renderHook(() => useMediaClient(), { wrapper });
    expect(result.current).toBe(client);
  });

  it('useMediaEvent should register and unregister events', () => {
    const client = new MediaClient({ apiKey: 'test' });
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MediaProvider client={client}>{children}</MediaProvider>
    );

    const callback = vi.fn();
    const { unmount } = renderHook(() => useMediaEvent('view', callback), { wrapper });

    // Emit event
    client.events.emit('view', { mediaId: 1, mediaType: 'photo' });
    expect(callback).toHaveBeenCalledTimes(1);

    // Unmount
    unmount();

    // Emit event again, callback should not be called
    client.events.emit('view', { mediaId: 2, mediaType: 'photo' });
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
