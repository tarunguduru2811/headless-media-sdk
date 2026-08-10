import { useEffect } from 'react';
import { Video } from '@media-sdk/react';
import { useReelSwiper } from '@media-sdk/ui-react';

interface VideoReelProps {
  videos: Video[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onVideoFocus: (video: Video) => void;
  onDownload: (video: Video) => void;
}

export function VideoReel({ videos, loading, hasMore, onLoadMore, onVideoFocus, onDownload }: VideoReelProps) {
  const swiper = useReelSwiper({ itemCount: videos.length });

  const activeVideo = videos[swiper.activeIndex];
  useEffect(() => {
    if (activeVideo) {
      onVideoFocus(activeVideo);
    }
  }, [activeVideo, onVideoFocus]);

  return (
    <div className="w-full max-w-[420px] mx-auto h-[75vh] relative rounded-[2.5rem] overflow-hidden bg-slate-950 shadow-2xl shadow-purple-900/30 border-8 border-slate-900 ring-1 ring-white/10">
      <div 
        {...swiper.getContainerProps()} 
        className="w-full h-full snap-y snap-mandatory overflow-y-auto overflow-x-hidden scroll-smooth"
        style={{ scrollbarWidth: 'none' }}
        onScroll={(e) => {
          const target = e.target as HTMLElement;
          if (hasMore && !loading && target.scrollHeight - target.scrollTop <= target.clientHeight + 100) {
            onLoadMore();
          }
        }}
      >
        {videos.map((video, index) => {
          const isActive = index === swiper.activeIndex;
          const file = video.video_files.sort((a, b) => (b.width * b.height) - (a.width * a.height))[0];
          
          return (
            <div
              key={`reel-${video.id}-${index}`}
              {...swiper.getItemProps(index)}
              className="w-full h-full relative flex items-center justify-center bg-black snap-start snap-always group"
            >
              <video 
                src={file?.link}
                poster={video.image}
                loop
                muted={!isActive}
                autoPlay={isActive}
                playsInline
                className={`w-full h-full object-cover transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-50'}`}
              />
              
              {/* Rich Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90 pointer-events-none"></div>
              
              {/* Overlay Details and Actions */}
              <div className="absolute bottom-0 left-0 right-0 p-8 pb-10 flex justify-between items-end">
                <div className="pointer-events-none">
                  <p className="text-white font-bold text-2xl drop-shadow-md mb-2">{video.user.name}</p>
                  <div className="flex items-center gap-3">
                    <span className="bg-purple-600/80 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-bold tracking-wide border border-white/10 shadow-lg">{video.duration}s</span>
                    <span className="text-slate-300 text-sm font-medium flex items-center gap-1">
                      <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      HD Video
                    </span>
                  </div>
                </div>
                
                {/* Download Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownload(video);
                  }}
                  className="bg-white/10 hover:bg-purple-600 text-white p-3.5 rounded-full transition-all backdrop-blur-md border border-white/20 transform hover:scale-110 active:scale-95 shadow-xl"
                  title="Download Video"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                </button>
              </div>
            </div>
          );
        })}
        
        {/* Initial Empty State Loading */}
        {videos.length === 0 && loading && (
          <div className="h-full flex flex-col items-center justify-center bg-black snap-start">
            <div className="w-12 h-12 border-4 border-slate-700 border-t-purple-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-400 font-medium">Fetching reels...</p>
          </div>
        )}

        {/* Inline Loading Slide at end of reel */}
        {loading && videos.length > 0 && (
          <div className="w-full h-full relative flex flex-col items-center justify-center bg-black snap-start snap-always">
            <div className="w-10 h-10 border-4 border-slate-700 border-t-purple-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-400 font-medium">Buffering next reel...</p>
          </div>
        )}
      </div>

      {/* Floating Scroll Loading Indicator */}
      {loading && videos.length > 0 && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 flex items-center gap-3 z-50 shadow-2xl pointer-events-none">
          <div className="w-4 h-4 border-2 border-slate-600 border-t-purple-500 rounded-full animate-spin"></div>
          <span className="text-xs font-bold text-white tracking-widest uppercase">Buffering</span>
        </div>
      )}
    </div>
  );
}
