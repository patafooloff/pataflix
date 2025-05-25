import { playerApi } from './api';
import { MoviePlayerResponse, TvShowPlayerResponse } from '../types/player';

export const playerService = {
  // Get movie player links
  getMoviePlayerLinks: async (imdbId: string): Promise<MoviePlayerResponse> => {
    try {
      const response = await playerApi.get<MoviePlayerResponse>(`/movie/${imdbId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie player links:', error);
      return { player_links: [], version: '' };
    }
  },
  
  // Get TV show player links
  getTvShowPlayerLinks: async (imdbId: string): Promise<TvShowPlayerResponse> => {
    try {
      const response = await playerApi.get<TvShowPlayerResponse>(`/tv/${imdbId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching TV show player links:', error);
      return { 
        type: 'tv', 
        series: [] 
      };
    }
  },
};

export default playerService;