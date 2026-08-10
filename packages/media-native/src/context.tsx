import React, { createContext, useContext, ReactNode } from 'react';
import { MediaClient } from '@media-sdk/core';

export const MediaContext = createContext<MediaClient | null>(null);

export interface MediaProviderProps {
  client: MediaClient;
  children: ReactNode;
}

export function MediaProvider({ client, children }: MediaProviderProps) {
  return <MediaContext.Provider value={client}>{children}</MediaContext.Provider>;
}

export function useMediaClient(): MediaClient {
  const context = useContext(MediaContext);
  if (!context) {
    throw new Error('useMediaClient must be used within a MediaProvider');
  }
  return context;
}
