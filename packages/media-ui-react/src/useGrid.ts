import { useCallback, useRef, useEffect, HTMLAttributes, RefCallback } from 'react';

export interface UseGridProps {
  isFetchingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  rootMargin?: string;
}

export function useGrid({ isFetchingMore = false, hasMore = false, onLoadMore, rootMargin = '0px' }: UseGridProps = {}) {
  const observer = useRef<IntersectionObserver | null>(null);

  // Keep references to changing props without triggering ref recreations
  const stateRef = useRef({ isFetchingMore, hasMore, onLoadMore });
  useEffect(() => {
    stateRef.current = { isFetchingMore, hasMore, onLoadMore };
  }, [isFetchingMore, hasMore, onLoadMore]);

  const triggerRef = useCallback<RefCallback<HTMLElement>>((node) => {
    if (observer.current) observer.current.disconnect();

    if (node) {
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          const { isFetchingMore, hasMore, onLoadMore } = stateRef.current;
          if (!isFetchingMore && hasMore && onLoadMore) {
            onLoadMore();
          }
        }
      }, { rootMargin, threshold: 0.5 });

      observer.current.observe(node);
    }
  }, [rootMargin]);

  const getContainerProps = useCallback((): HTMLAttributes<HTMLElement> => ({
    role: 'grid',
    'aria-busy': isFetchingMore,
  }), [isFetchingMore]);

  const getItemProps = useCallback((index: number): HTMLAttributes<HTMLElement> => ({
    role: 'gridcell',
    tabIndex: 0,
  }), []);

  const getLoadMoreTriggerProps = useCallback(() => ({
    ref: triggerRef,
    role: 'presentation',
  }), [triggerRef]);

  return {
    getContainerProps,
    getItemProps,
    getLoadMoreTriggerProps,
    isFetchingMore,
    hasMore,
  };
}
