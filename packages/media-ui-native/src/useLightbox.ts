import { useCallback } from 'react';

export interface UseLightboxProps {
  isOpen: boolean;
  onClose: () => void;
}

export function useLightbox({ isOpen, onClose }: UseLightboxProps) {
  const getBackdropProps = useCallback(() => ({
    onPress: onClose,
    accessible: true,
    accessibilityLabel: 'Close lightbox background',
  }), [onClose]);

  const getDialogProps = useCallback(() => ({
    accessibilityViewIsModal: true,
  }), []);

  const getCloseButtonProps = useCallback(() => ({
    onPress: onClose,
    accessibilityRole: 'button' as const,
    accessibilityLabel: 'Close lightbox',
  }), [onClose]);

  return {
    getBackdropProps,
    getDialogProps,
    getCloseButtonProps,
  };
}
