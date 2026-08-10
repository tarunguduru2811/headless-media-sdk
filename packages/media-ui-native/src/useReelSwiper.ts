import { useCallback, useState } from 'react';

export interface UseReelSwiperProps {
  itemCount: number;
}

export function useReelSwiper({ itemCount }: UseReelSwiperProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const getContainerProps = useCallback(() => ({
    pagingEnabled: true,
    showsVerticalScrollIndicator: false,
    onMomentumScrollEnd: (event: any) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const layoutHeight = event.nativeEvent.layoutMeasurement.height;
      if (layoutHeight > 0) {
        const index = Math.round(offsetY / layoutHeight);
        setActiveIndex(index);
      }
    },
  }), []);

  const getItemProps = useCallback((index: number) => ({
    // Typically in RN FlatList/ScrollView, items don't need scrollSnapAlign style.
  }), []);

  return {
    getContainerProps,
    getItemProps,
    activeIndex,
  };
}
