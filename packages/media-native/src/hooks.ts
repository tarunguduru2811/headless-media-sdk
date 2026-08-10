import { useEffect } from 'react';
import { MediaEventType, EventCallback } from '@media-sdk/core';
import { useMediaClient } from './context';

export function useMediaEvent(eventType: MediaEventType, callback: EventCallback) {
  const client = useMediaClient();

  useEffect(() => {
    const unsubscribe = client.events.on(eventType, callback);
    return () => {
      unsubscribe();
    };
  }, [client, eventType, callback]);
}
