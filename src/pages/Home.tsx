
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import MediaGrid from '@/components/MediaGrid';
import { tmdbApi } from '@/services/tmdb';
import { Movie, TVShow } from '@/types';

const Home = () => {
  const [searchResults, setSearchResults] = useState<{movies: Movie[], shows: TVShow[]} | null>(null);

  const { data: popularMovies = [] } = useQuery({
    queryKey: ['popularMovies'],
    queryFn: tmdbApi.getPopularMovies
  });

  const { data: trendingMovies = [] } = useQuery({
    queryKey: ['trendingMovies'],
    queryFn: tmdbApi.getTrendingMovies
  });

  const { data: popularShows = [] } = useQuery({
    queryKey: ['popularShows'],
    queryFn: tmdbApi.getPopularTVShows
  });

  const { data: trendingShows = [] } = useQuery({
    queryKey: ['trendingShows'],
    queryFn: tmdbApi.getTrendingTVShows
  });

  const handleSearch = async (query: string) => {
    try {
      const [movies, shows] = await Promise.all([
        tmdbApi.searchMovies(query),
        tmdbApi.searchTVShows(query)
      ]);
      setSearchResults({ movies, shows });
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const clearSearch = () => {
    setSearchResults(null);
  };

  const heroContent = [...trendingMovies.slice(0, 3), ...trendingShows.slice(0, 2)];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <Navigation onSearch={handleSearch} />
      
      {searchResults ? (
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-white">Résultats de recherche</h1>
            <button
              onClick={clearSearch}
              className="text-red-500 hover:text-red-400 transition-colors"
            >
              Effacer
            </button>
          </div>
          
          {searchResults.movies.length > 0 && (
            <MediaGrid
              title="Films trouvés"
              media={searchResults.movies}
              type="movie"
              showMore
            />
          )}
          
          {searchResults.shows.length > 0 && (
            <MediaGrid
              title="Séries trouvées"
              media={searchResults.shows}
              type="tv"
              showMore
            />
          )}
          
          {searchResults.movies.length === 0 && searchResults.shows.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">Aucun résultat trouvé.</p>
            </div>
          )}
        </div>
      ) : (
        <>
          <HeroSection media={heroContent} />
          
          <div className="container mx-auto px-4 py-8 space-y-12">
            <MediaGrid
              title="Films tendance"
              media={trendingMovies}
              type="movie"
            />
            
            <MediaGrid
              title="Films populaires"
              media={popularMovies}
              type="movie"
            />
            
            <MediaGrid
              title="Séries tendance"
              media={trendingShows}
              type="tv"
            />
            
            <MediaGrid
              title="Séries populaires"
              media={popularShows}
              type="tv"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
