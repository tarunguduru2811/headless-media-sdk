import { useLightbox } from '@media-sdk/ui-react';

interface MediaLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
  content: React.ReactNode;
}

export function MediaLightbox({ isOpen, onClose, onDownload, content }: MediaLightboxProps) {
  const lightbox = useLightbox({ isOpen, onClose });

  if (!isOpen) return null;

  return (
    <div 
      {...lightbox.getBackdropProps()} 
      className="fixed inset-0 bg-slate-950/95 z-50 flex flex-col items-center justify-center p-2 sm:p-4 md:p-8 backdrop-blur-xl transition-all duration-300"
    >
      {/* Top Action Bar - Fixed within flex container so it never overlaps content */}
      <div className="w-full max-w-7xl flex justify-end gap-2 sm:gap-4 mb-4 mt-2 sm:mt-0 px-2 shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDownload();
          }}
          className="bg-white/10 hover:bg-purple-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl text-sm sm:text-base font-medium flex items-center gap-2 sm:gap-3 transition-all backdrop-blur-md border border-white/10 hover:border-white/30 shadow-2xl transform active:scale-95"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          <span className="hidden sm:inline">High-Res Download</span>
          <span className="sm:hidden">Download</span>
        </button>
        <button 
          {...lightbox.getCloseButtonProps()} 
          className="bg-white/10 hover:bg-red-500/80 text-white p-2 sm:p-3 rounded-xl transition-all backdrop-blur-md border border-white/10 shadow-2xl transform active:scale-95"
          aria-label="Close lightbox"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      
      {/* Media Container - Flex-1 min-h-0 ensures it fills remaining space without expanding beyond screen */}
      <div 
        {...lightbox.getDialogProps()} 
        className="relative bg-black/40 rounded-xl sm:rounded-2xl max-w-7xl w-full flex-1 flex items-center justify-center outline-none overflow-hidden shadow-2xl shadow-purple-900/20 ring-1 ring-white/10 min-h-0"
        onClick={(e) => e.stopPropagation()}
      >
        {content}
      </div>
    </div>
  );
}
