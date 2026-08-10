export type MediaEventType = 'view' | 'download';

export interface MediaEventPayload {
  type: MediaEventType;
  mediaId: string | number;
  mediaType: 'photo' | 'video';
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export type EventCallback = (payload: MediaEventPayload) => void;

export interface Photo {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  liked: boolean;
  alt: string;
}

export interface Video {
  id: number;
  width: number;
  height: number;
  url: string;
  image: string;
  duration: number;
  user: {
    id: number;
    name: string;
    url: string;
  };
  video_files: Array<{
    id: number;
    quality: string;
    file_type: string;
    width: number;
    height: number;
    link: string;
  }>;
  video_pictures: Array<{
    id: number;
    picture: string;
    nr: number;
  }>;
}

export interface PexelsResponse<T> {
  page: number;
  per_page: number;
  total_results: number;
  next_page?: string;
  prev_page?: string;
}

export interface PhotosResponse extends PexelsResponse<Photo> {
  photos: Photo[];
}

export interface VideosResponse extends PexelsResponse<Video> {
  videos: Video[];
}

export interface MediaClientConfig {
  apiKey: string;
}
