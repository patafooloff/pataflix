
import { MoviePlayerResponse, TVPlayerResponse } from '@/types';

const STREAMING_API_BASE = 'https://colossal-latrina-movixfrembedapi-acb05587.koyeb.app/api/imdb';

export const streamingApi = {
  // Obtenir les lecteurs pour un film
  getMovieStreams: async (imdbId: string): Promise<MoviePlayerResponse> => {
    try {
      const response = await fetch(`${STREAMING_API_BASE}/movie/${imdbId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch movie streams');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching movie streams:', error);
      return { player_links: [], version: 'VF' };
    }
  },

  // Obtenir les lecteurs pour une série
  getTVStreams: async (imdbId: string): Promise<TVPlayerResponse> => {
    try {
      const response = await fetch(`${STREAMING_API_BASE}/tv/${imdbId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch TV streams');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching TV streams:', error);
      return { type: 'tv', series: [] };
    }
  }
};
