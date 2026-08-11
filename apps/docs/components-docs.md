# SKILL-USING-COMPONENTS: Consuming Headless Prop-Getters

This document teaches an AI assistant how to consume headless UI components from `@media-sdk/ui-react` and apply custom styling logic.

## The Prop-Getter Pattern
Our UI library is **strictly headless**. It provides hooks that manage complex state, accessibility (ARIA attributes), and DOM interactions (IntersectionObservers), but it returns **zero markup and zero CSS**.

You must spread the returned "prop-getters" onto your own HTML elements.

## 1. Using `useGrid` (Infinite Scroll)
The `useGrid` hook automatically manages an `IntersectionObserver` to trigger a load-more callback when the user reaches the bottom of the grid.

```tsx
import { useGrid } from '@media-sdk/ui-react';

function PhotoGrid({ photos, hasMore, isFetchingMore, onLoadMore }) {
  const grid = useGrid({ hasMore, isFetchingMore, onLoadMore, rootMargin: '0px' });

  return (
    <div>
      {/* 1. Spread container props onto the grid wrapper */}
      <div {...grid.getContainerProps()} className="grid grid-cols-3 gap-4">
        {photos.map((photo, index) => (
          {/* 2. Spread item props onto each individual grid cell */}
          <div key={photo.id} {...grid.getItemProps(index)} className="rounded overflow-hidden">
            <img src={photo.src.medium} />
          </div>
        ))}
      </div>
      
      {/* 3. Render the invisible trigger div at the bottom */}
      {hasMore && (
        <div {...grid.getLoadMoreTriggerProps()} className="h-10 w-full flex items-center justify-center">
           {isFetchingMore ? 'Loading...' : 'Scroll down for more'}
        </div>
      )}
    </div>
  );
}
```

## 2. Using `useLightbox` (Accessible Modals)
The `useLightbox` hook handles Escape-key closing and click-outside backdrop behaviors.

```tsx
import { useLightbox } from '@media-sdk/ui-react';

function Modal({ isOpen, onClose, imageUrl }) {
  const lightbox = useLightbox({ isOpen, onClose });

  if (!isOpen) return null;

  return (
    // Backdrop handles click-outside closing
    <div {...lightbox.getBackdropProps()} className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      
      // Dialog handles accessibility roles and prevents event bubbling
      <div {...lightbox.getDialogProps()} className="relative bg-white p-4 rounded-xl">
        <button {...lightbox.getCloseButtonProps()} className="absolute top-2 right-2">
           Close
        </button>
        <img src={imageUrl} className="max-w-full max-h-[80vh]" />
      </div>
    </div>
  );
}
```

## 3. Using `useReelSwiper` (TikTok-Style Vertical Scrolling)
The `useReelSwiper` hook automatically tracks which video is currently visible using intersection observers and exposes it via `activeIndex`.

```tsx
import { useReelSwiper } from '@media-sdk/ui-react';

function VideoReel({ videos }) {
  const swiper = useReelSwiper({ itemCount: videos.length });

  return (
    // Apply CSS snap-scrolling to the container
    <div {...swiper.getContainerProps()} className="h-screen w-full snap-y snap-mandatory overflow-y-auto">
      {videos.map((video, index) => {
        // Automatically determine if this is the active video
        const isActive = index === swiper.activeIndex;
        
        return (
          // Apply snap-start to the children
          <div key={video.id} {...swiper.getItemProps(index)} className="h-full w-full snap-start snap-always">
             <video src={video.url} autoPlay={isActive} muted={!isActive} loop />
          </div>
        );
      })}
    </div>
  );
}
```

## Architectural Rules
1. **Never mix data-fetching inside the display components.** Headless components must only receive pure data arrays (`photos`, `videos`) and primitive states (`loading`, `hasMore`).
2. **Bring your own CSS.** You are responsible for all layout, grid structures, and animations using utility classes (like Tailwind) on top of the headless prop-getters.
