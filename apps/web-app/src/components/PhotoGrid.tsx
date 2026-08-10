import { Photo } from '@media-sdk/react';
import { useGrid } from '@media-sdk/ui-react';

interface PhotoGridProps {
  photos: Photo[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onPhotoClick: (photo: Photo) => void;
}

export function PhotoGrid({ photos, loading, hasMore, onLoadMore, onPhotoClick }: PhotoGridProps) {
  const grid = useGrid({
    isFetchingMore: loading,
    hasMore,
    onLoadMore,
  });

  return (
    <div className="w-full">
      <div 
        {...grid.getContainerProps()} 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
      >
        {photos.map((photo, index) => (
          <div
            key={`photo-${photo.id}-${index}`}
            {...grid.getItemProps(index)}
            className="group cursor-pointer rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 bg-white/5 border border-white/10 backdrop-blur-sm transform hover:-translate-y-2 flex flex-col"
            onClick={() => onPhotoClick(photo)}
          >
            <div className="relative overflow-hidden aspect-[4/3] rounded-t-2xl">
              {photo.src ? (
                <img 
                  src={photo.src.medium} 
                  alt={photo.alt || 'Photo'} 
                  loading="lazy"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500">No Image</div>
              )}
              {/* Overlay Gradient on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Expand Icon */}
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
              </div>
            </div>
            <div className="p-5 border-t border-white/5 flex-1 flex flex-col justify-between">
              <p className="text-sm font-semibold text-slate-200 truncate">{photo.photographer}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Photography</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Initial Empty State Loading */}
      {photos.length === 0 && loading && (
        <div className="w-full py-24 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-slate-700 border-t-purple-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-400 font-medium">Fetching photos...</p>
        </div>
      )}

      {/* Inline Trigger Div for Infinite Scroll */}
      {hasMore && photos.length > 0 && (
        <div {...grid.getLoadMoreTriggerProps()} className="w-full h-32 flex items-center justify-center mt-12 mb-8">
          {loading ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-slate-700 border-t-purple-500 rounded-full animate-spin"></div>
              <span className="text-sm text-purple-400 font-bold tracking-wide">Loading more imagery...</span>
            </div>
          ) : (
            <span className="text-slate-500 font-medium bg-white/5 px-8 py-3 rounded-full border border-white/5 shadow-inner">Scroll down to explore</span>
          )}
        </div>
      )}

      {/* Floating Scroll Loading Indicator */}
      {loading && photos.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur-xl px-6 py-3 rounded-full border border-white/20 flex items-center gap-3 z-40 shadow-2xl shadow-purple-900/50 transform animate-bounce">
          <div className="w-5 h-5 border-2 border-slate-600 border-t-purple-500 rounded-full animate-spin"></div>
          <span className="text-sm font-bold text-white tracking-wide">Loading more photos...</span>
        </div>
      )}
    </div>
  );
}
