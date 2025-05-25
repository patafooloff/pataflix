import { tmdbApi, getImageUrl } from './api';
import { 
  Movie, 
  TvShow, 
  MovieDetails, 
  TvShowDetails, 
  SearchResults,
  Genre
} from '../types/tmdb';

export const tmdbService = {
  // Home page
  getTrending: async (mediaType: 'all' | 'movie' | 'tv' = 'all', timeWindow: 'day' | 'week' = 'week') => {
    const response = await tmdbApi.get<{ results: (Movie | TvShow)[] }>(`/trending/${mediaType}/${timeWindow}`);
    return response.data.results;
  },
  
  getPopular: async (mediaType: 'movie' | 'tv') => {
    const response = await tmdbApi.get<{ results: (Movie | TvShow)[] }>(`/${mediaType}/popular`);
    return response.data.results;
  },
  
  getTopRated: async (mediaType: 'movie' | 'tv') => {
    const response = await tmdbApi.get<{ results: (Movie | TvShow)[] }>(`/${mediaType}/top_rated`);
    return response.data.results;
  },
  
  getNowPlaying: async () => {
    const response = await tmdbApi.get<{ results: Movie[] }>('/movie/now_playing');
    return response.data.results;
  },
  
  getOnTheAir: async () => {
    const response = await tmdbApi.get<{ results: TvShow[] }>('/tv/on_the_air');
    return response.data.results;
  },
  
  // Movie details
  getMovieDetails: async (id: string): Promise<MovieDetails> => {
    const response = await tmdbApi.get<MovieDetails>(`/movie/${id}`, {
      params: {
        append_to_response: 'videos,credits,similar,external_ids',
      },
    });
    return response.data;
  },
  
  // TV Show details
  getTvShowDetails: async (id: string): Promise<TvShowDetails> => {
    const response = await tmdbApi.get<TvShowDetails>(`/tv/${id}`, {
      params: {
        append_to_response: 'videos,credits,similar,external_ids',
      },
    });
    return response.data;
  },
  
  // Search
  searchMulti: async (query: string, page: number = 1): Promise<SearchResults> => {
    const response = await tmdbApi.get<SearchResults>('/search/multi', {
      params: {
        query,
        page,
        include_adult: false,
      },
    });
    return response.data;
  },
  
  // Get movies by genre
  getMoviesByGenre: async (genreId: number, page: number = 1) => {
    const response = await tmdbApi.get<{ results: Movie[], total_pages: number }>('/discover/movie', {
      params: {
        with_genres: genreId,
        page,
        sort_by: 'popularity.desc',
      },
    });
    return response.data;
  },
  
  // Get TV shows by genre
  getTvShowsByGenre: async (genreId: number, page: number = 1) => {
    const response = await tmdbApi.get<{ results: TvShow[], total_pages: number }>('/discover/tv', {
      params: {
        with_genres: genreId,
        page,
        sort_by: 'popularity.desc',
      },
    });
    return response.data;
  },
  
  // Get genres
  getGenres: async (type: 'movie' | 'tv'): Promise<Genre[]> => {
    const response = await tmdbApi.get<{ genres: Genre[] }>(`/genre/${type}/list`);
    return response.data.genres;
  },
};

export default tmdbService;