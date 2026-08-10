import { MediaClientConfig, PhotosResponse, VideosResponse } from './types';
import { MediaEventEmitter } from './events';

export class MediaClient {
  private apiKey: string;
  public events: MediaEventEmitter;

  // Cache and Deduplication maps
  private cache: Map<string, unknown> = new Map();
  private pendingRequests: Map<string, Promise<unknown>> = new Map();

  constructor(config: MediaClientConfig) {
    this.apiKey = config.apiKey;
    this.events = new MediaEventEmitter();

    // Auto-register default listener for console logging
    this.events.on('view', (payload) => {
      console.log(`[MediaClient] View event:`, payload);
    });
    this.events.on('download', (payload) => {
      console.log(`[MediaClient] Download event:`, payload);
    });
  }

  private async fetchWithCache<T>(endpoint: string, queryParams: Record<string, string | number>): Promise<T> {
    const url = new URL(`https://api.pexels.com/v1/${endpoint}`);
    
    // Normalize and sort keys to generate deterministic cache key
    const sortedKeys = Object.keys(queryParams).sort();
    sortedKeys.forEach(key => {
      url.searchParams.append(key, String(queryParams[key]));
    });

    const cacheKey = url.toString();

    // Return cached result if available
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey) as T;
    }

    // Return pending promise if request is already in flight (deduplication)
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey) as Promise<T>;
    }

    // Execute new request
    const requestPromise = fetch(url.toString(), {
      headers: {
        Authorization: this.apiKey,
      },
    }).then(async (response) => {
      if (!response.ok) {
        throw new Error(`Pexels API error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      // Store in cache
      this.cache.set(cacheKey, data);
      return data;
    }).finally(() => {
      // Remove from pending requests when done
      this.pendingRequests.delete(cacheKey);
    });

    this.pendingRequests.set(cacheKey, requestPromise);
    return requestPromise as Promise<T>;
  }

  // --- API Methods ---

  public async searchPhotos(query: string, page: number = 1, perPage: number = 15): Promise<PhotosResponse> {
    return this.fetchWithCache<PhotosResponse>('search', { query, page, per_page: perPage });
  }

  public async getCuratedPhotos(page: number = 1, perPage: number = 15): Promise<PhotosResponse> {
    return this.fetchWithCache<PhotosResponse>('curated', { page, per_page: perPage });
  }

  public async searchVideos(query: string, page: number = 1, perPage: number = 15): Promise<VideosResponse> {
    // Note: Video search endpoint uses /videos prefix
    return this.fetchWithCache<VideosResponse>('../videos/search', { query, page, per_page: perPage });
  }

  public async getPopularVideos(page: number = 1, perPage: number = 15): Promise<VideosResponse> {
    return this.fetchWithCache<VideosResponse>('../videos/popular', { page, per_page: perPage });
  }

  public clearCache(): void {
    this.cache.clear();
  }
}
