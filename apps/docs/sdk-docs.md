# SKILL-WIRING-DATA: Integrating the Headless Media SDK

This document teaches an AI assistant how to properly wire the `@media-sdk/react` data layer into a consumer React application.

## 1. Setup the Media Provider
To use the SDK, you must first initialize the `MediaClient` and provide it via the `MediaProvider` at the root of your application. Both are imported from `@media-sdk/react`.

```tsx
import { MediaProvider, MediaClient } from '@media-sdk/react';


// Initialize the core client with your API key
const client = new MediaClient({ apiKey: 'YOUR_PEXELS_API_KEY' });

function Root() {
  return (
    <MediaProvider client={client}>
      <App />
    </MediaProvider>
  );
}
```

## 2. Invoking Data Hooks
Inside any component wrapped by the provider, use the `useMediaClient` hook to access the client instance and fetch data. 
**Note:** All network requests are automatically deduplicated and cached by the core SDK.

```tsx
import { useState, useEffect } from 'react';
import { useMediaClient, Photo } from '@media-sdk/react';

function PhotoGallery() {
  const client = useMediaClient();
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    async function fetchPhotos() {
      // Fetch the first page of 15 curated photos
      const response = await client.getCuratedPhotos(1, 15);
      setPhotos(response.photos);
    }
    fetchPhotos();
  }, [client]);

  return <div>{/* Render photos */}</div>;
}
```

## 3. Managing Tracking Events
The SDK includes a built-in event emitter for analytics (`view` and `download`). Use the `useMediaEvent` hook to automatically subscribe and unsubscribe to these events globally.

```tsx
import { useMediaEvent } from '@media-sdk/react';

function AnalyticsTracker() {
  // Automatically handles subscription and unsubscription on unmount
  useMediaEvent('view', (payload) => {
    console.log(`User viewed ${payload.mediaType} ID: ${payload.mediaId}`);
  });

  useMediaEvent('download', (payload) => {
    console.log(`User downloaded ${payload.mediaType} ID: ${payload.mediaId}`);
  });

  return null;
}
```

To emit an event from a component interaction (e.g., a user clicks a download button):

```tsx
const client = useMediaClient();

const handleDownloadClick = (photoId: number) => {
  client.events.emit('download', { mediaId: photoId, mediaType: 'photo' });
};
```

## Architectural Rules
1. **Never import from `@media-sdk/core`** inside the UI layer. All types (e.g. `Photo`, `Video`) are re-exported via `@media-sdk/react`.
2. Do not attempt to store the `MediaClient` instance in React state (`useState`). Instantiate it once outside the tree or in a `useMemo` at the root level.
