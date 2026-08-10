import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useGrid } from '../src/useGrid';
import { useLightbox } from '../src/useLightbox';
import { useReelSwiper } from '../src/useReelSwiper';

global.IntersectionObserver = class IntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
} as any;

describe('UI React Hooks', () => {
  it('useGrid returns valid props', () => {
    const { result } = renderHook(() => useGrid({ isFetchingMore: true, hasMore: true }));
    expect(result.current.getContainerProps().role).toBe('grid');
    expect(result.current.getContainerProps()['aria-busy']).toBe(true);
    expect(result.current.getItemProps(0).role).toBe('gridcell');
  });

  it('useLightbox returns valid props', () => {
    const { result } = renderHook(() => useLightbox({ isOpen: true, onClose: () => {} }));
    expect(result.current.getDialogProps().role).toBe('dialog');
    expect(result.current.getDialogProps()['aria-modal']).toBe(true);
  });

  it('useReelSwiper returns valid props', () => {
    const { result } = renderHook(() => useReelSwiper({ itemCount: 10 }));
    expect(result.current.activeIndex).toBe(0);
    expect(result.current.getContainerProps().style).toEqual({ overflowY: 'scroll', scrollSnapType: 'y mandatory' });
  });
});
