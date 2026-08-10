import { useEffect, useRef } from 'react';
import { MediaEventType, EventCallback } from '@media-sdk/core';
import { useMediaClient } from './context';

export function useMediaEvent(eventType: MediaEventType, callback: EventCallback) {
  const client = useMediaClient();
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const unsubscribe = client.events.on(eventType, (payload) => {
      savedCallback.current(payload);
    });
    return () => {
      unsubscribe();
    };
  }, [client, eventType]);
}
