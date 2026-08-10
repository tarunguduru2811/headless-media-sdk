import { useCallback, useEffect, HTMLAttributes, MouseEvent } from 'react';

export interface UseLightboxProps {
  isOpen: boolean;
  onClose: () => void;
}

export function useLightbox({ isOpen, onClose }: UseLightboxProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const getBackdropProps = useCallback((): HTMLAttributes<HTMLElement> => ({
    onClick: (e: MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    'aria-hidden': !isOpen,
  }), [isOpen, onClose]);

  const getDialogProps = useCallback((): HTMLAttributes<HTMLElement> => ({
    role: 'dialog',
    'aria-modal': true,
    tabIndex: -1,
  }), []);

  const getCloseButtonProps = useCallback((): HTMLAttributes<HTMLButtonElement> => ({
    onClick: onClose,
    'aria-label': 'Close lightbox',
  }), [onClose]);

  return {
    getBackdropProps,
    getDialogProps,
    getCloseButtonProps,
  };
}
