import { useCallback } from 'react';

export interface UseGridProps {
  isFetchingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export function useGrid({ isFetchingMore = false, hasMore = false, onLoadMore }: UseGridProps = {}) {
  const getContainerProps = useCallback(() => ({
    accessibilityRole: 'grid' as const,
  }), []);

  const getItemProps = useCallback((index: number) => ({
    accessibilityRole: 'button' as const, 
  }), []);

  const getLoadMoreTriggerProps = useCallback(() => ({
    onEndReached: () => {
      if (hasMore && !isFetchingMore && onLoadMore) {
        onLoadMore();
      }
    },
    onEndReachedThreshold: 0.5,
  }), [hasMore, isFetchingMore, onLoadMore]);

  return {
    getContainerProps,
    getItemProps,
    getLoadMoreTriggerProps,
    isFetchingMore,
    hasMore,
  };
}
