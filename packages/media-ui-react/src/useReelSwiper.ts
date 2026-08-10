import { useCallback, useRef, useEffect, useState, HTMLAttributes } from 'react';

export interface UseReelSwiperProps {
  itemCount: number;
}

export function useReelSwiper({ itemCount }: UseReelSwiperProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const itemRefs = useRef<Map<number, HTMLElement>>(new Map());

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            if (!isNaN(index)) {
              setActiveIndex(index);
            }
          }
        });
      },
      { threshold: 0.6 }
    );

    const currentMap = itemRefs.current;
    currentMap.forEach((node) => observerRef.current?.observe(node));

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const getContainerProps = useCallback((): HTMLAttributes<HTMLElement> => ({
    style: {
      overflowY: 'scroll',
      scrollSnapType: 'y mandatory',
    },
  }), []);

  const getItemProps = useCallback((index: number) => {
    return {
      'data-index': index,
      style: {
        scrollSnapAlign: 'start',
      },
      ref: (node: HTMLElement | null) => {
        if (node) {
          itemRefs.current.set(index, node);
          observerRef.current?.observe(node);
        } else {
          const oldNode = itemRefs.current.get(index);
          if (oldNode) observerRef.current?.unobserve(oldNode);
          itemRefs.current.delete(index);
        }
      },
    };
  }, []);

  return {
    getContainerProps,
    getItemProps,
    activeIndex,
  };
}
