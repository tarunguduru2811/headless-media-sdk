import { useEffect, useState, useCallback, useRef } from 'react';
import { useMediaClient, useMediaEvent, Photo, Video } from '@media-sdk/react';
import { SearchBar } from './components/SearchBar';
import { PhotoGrid } from './components/PhotoGrid';
import { VideoReel } from './components/VideoReel';
import { MediaLightbox } from './components/MediaLightbox';

type MediaType = 'photo' | 'video';

function App() {
  const client = useMediaClient();
  const [activeTab, setActiveTab] = useState<MediaType>('photo');
  const [query, setQuery] = useState('');
  
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const loadingRef = useRef(false);

  // Lightbox State
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  
  // Tracking
  useMediaEvent('view', (payload) => {
    console.log('[Analytics tracking]: user viewed', payload.mediaType, payload.mediaId);
  });
  
  useMediaEvent('download', (payload) => {
    console.log('[Analytics tracking]: user downloaded', payload.mediaType, payload.mediaId);
  });

  const loadMedia = async (isNewQuery: boolean = false) => {
    if (loadingRef.current || (!hasMore && !isNewQuery)) return;
    
    loadingRef.current = true;
    setLoading(true);
    
    const currentPage = isNewQuery ? 1 : page;
    
    try {
      // Minimum UX delay to prevent the loader from flickering too fast on fast connections
      await new Promise(resolve => setTimeout(resolve, 600));

      if (activeTab === 'photo') {
        const response = query 
          ? await client.searchPhotos(query, currentPage, 15)
          : await client.getCuratedPhotos(currentPage, 15);
          
        if (isNewQuery) setPhotos(response.photos);
        else setPhotos((prev) => [...prev, ...response.photos]);
        setHasMore(response.photos.length > 0 && !!response.next_page);
      } else {
        const response = query 
          ? await client.searchVideos(query, currentPage, 15)
          : await client.getPopularVideos(currentPage, 15);
          
        if (isNewQuery) setVideos(response.videos);
        else setVideos((prev) => [...prev, ...response.videos]);
        setHasMore(response.videos.length > 0 && !!response.next_page);
      }
      setPage(currentPage + 1);
    } catch (error) {
      console.error(`Failed to load ${activeTab}s:`, error);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia(true);
  }, [activeTab, query]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
    client.events.emit('view', { mediaId: photo.id, mediaType: 'photo' });
  };

  const handleVideoFocus = useCallback((video: Video) => {
    client.events.emit('view', { mediaId: video.id, mediaType: 'video' });
  }, [client.events]);

  const handlePhotoDownload = async () => {
    if (!selectedPhoto) return;
    try {
      const response = await fetch(selectedPhoto.src.original);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `photo-${selectedPhoto.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      client.events.emit('download', { mediaId: selectedPhoto.id, mediaType: 'photo' });
    } catch (err) {
      console.error('Download failed', err);
    }
  };

  const handleVideoDownload = async (video: Video) => {
    try {
      const file = video.video_files.sort((a, b) => (b.width * b.height) - (a.width * a.height))[0];
      const response = await fetch(file.link);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `video-${video.id}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      client.events.emit('download', { mediaId: video.id, mediaType: 'video' });
    } catch (err) {
      console.error('Download failed', err);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950 text-slate-50 selection:bg-purple-500/30 selection:text-white">
      {/* Ambient glowing background effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full mix-blend-screen filter blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '4s' }}></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full mix-blend-screen filter blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '6s' }}></div>
      
      <div className="relative z-10 p-4 md:p-8 max-w-[1400px] mx-auto">
        <div className="flex flex-col mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
              Media Hub
            </h1>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
            <SearchBar onSearch={setQuery} placeholder={`Discover amazing ${activeTab}s...`} />
            
            <div className="flex bg-white/5 backdrop-blur-md p-1.5 rounded-xl border border-white/10 w-full md:w-auto shadow-2xl">
              <button 
                className={`flex-1 md:px-8 py-3 rounded-lg font-medium transition-all duration-300 ${activeTab === 'photo' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/25 scale-[1.02]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                onClick={() => setActiveTab('photo')}
              >
                Photos (Grid)
              </button>
              <button 
                className={`flex-1 md:px-8 py-3 rounded-lg font-medium transition-all duration-300 ${activeTab === 'video' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/25 scale-[1.02]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                onClick={() => setActiveTab('video')}
              >
                Videos (Reels)
              </button>
            </div>
          </div>
          
          {query && (
            <div className="mt-6 flex items-center gap-2 text-slate-400 font-medium">
              <span>Showing results for</span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-white border border-white/10 shadow-sm">{query}</span>
            </div>
          )}
        </div>
        
        {activeTab === 'photo' ? (
          <PhotoGrid 
            photos={photos} 
            loading={loading} 
            hasMore={hasMore} 
            onLoadMore={() => loadMedia(false)} 
            onPhotoClick={handlePhotoClick} 
          />
        ) : (
          <VideoReel 
            videos={videos} 
            loading={loading} 
            hasMore={hasMore} 
            onLoadMore={() => loadMedia(false)} 
            onVideoFocus={handleVideoFocus} 
            onDownload={handleVideoDownload}
          />
        )}

        <MediaLightbox 
          isOpen={!!selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          onDownload={handlePhotoDownload}
          content={selectedPhoto && (
            <img 
              src={selectedPhoto.src?.large2x || selectedPhoto.src?.large} 
              alt={selectedPhoto.alt} 
              className="w-full h-full object-contain p-2 md:p-4"
            />
          )}
        />
      </div>
    </div>
  );
}

export default App;
