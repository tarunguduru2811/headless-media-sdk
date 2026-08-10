import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MediaClient } from '../src/client';

describe('MediaClient', () => {
  let client: MediaClient;
  const originalFetch = global.fetch;

  beforeEach(() => {
    client = new MediaClient({ apiKey: 'test_key' });
    // Mock global fetch
    global.fetch = vi.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('should auto-register logging for events', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    client.events.emit('view', { mediaId: 1, mediaType: 'photo' });
    expect(logSpy).toHaveBeenCalledWith(
      '[MediaClient] View event:',
      expect.objectContaining({ type: 'view', mediaId: 1 })
    );
    
    client.events.emit('download', { mediaId: 2, mediaType: 'video' });
    expect(logSpy).toHaveBeenCalledWith(
      '[MediaClient] Download event:',
      expect.objectContaining({ type: 'download', mediaId: 2 })
    );
  });

  it('should cache successful responses', async () => {
    const mockResponse = { photos: [] };
    const fetchMock = vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    } as Response);

    // First request
    const result1 = await client.getCuratedPhotos(1, 15);
    expect(result1).toEqual(mockResponse);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    // Second request (should hit cache)
    const result2 = await client.getCuratedPhotos(1, 15);
    expect(result2).toEqual(mockResponse);
    expect(fetchMock).toHaveBeenCalledTimes(1); // Still 1!
  });

  it('should deduplicate simultaneous requests', async () => {
    const mockResponse = { photos: [] };
    
    // Add delay to fetch
    const fetchMock = vi.mocked(global.fetch).mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            ok: true,
            json: () => Promise.resolve(mockResponse)
          } as Response);
        }, 50);
      });
    });

    // Fire two identical requests simultaneously
    const promise1 = client.searchPhotos('nature', 1, 15);
    const promise2 = client.searchPhotos('nature', 1, 15);

    const [result1, result2] = await Promise.all([promise1, promise2]);

    expect(result1).toEqual(mockResponse);
    expect(result2).toEqual(mockResponse);
    
    // Should only have made ONE network request
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
