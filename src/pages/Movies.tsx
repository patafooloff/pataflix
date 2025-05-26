
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navigation from '@/components/Navigation';
import MediaGrid from '@/components/MediaGrid';
import MediaCard from '@/components/MediaCard';
import { Button } from '@/components/ui/button';
import { tmdbApi } from '@/services/tmdb';
import { Movie } from '@/types';
import { ChevronRight } from 'lucide-react';

const Movies = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [searchResults, setSearchResults] = useState<Movie[] | null>(null);

  const { data: movies = [], isLoading } = useQuery({
    queryKey: ['movies', currentPage],
    queryFn: () => tmdbApi.getMovies(currentPage)
  });

  const { data: trendingMovies = [] } = useQuery({
    queryKey: ['trendingMovies'],
    queryFn: tmdbApi.getTrendingMovies
  });

  useEffect(() => {
    if (movies.length > 0) {
      setAllMovies(prev => {
        const newMovies = movies.filter(movie => 
          !prev.some(existing => existing.id === movie.id)
        );
        return [...prev, ...newMovies];
      });
    }
  }, [movies]);

  const handleSearch = async (query: string) => {
    try {
      const results = await tmdbApi.searchMovies(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const clearSearch = () => {
    setSearchResults(null);
  };

  const loadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <Navigation onSearch={handleSearch} />
      
      <div className="container mx-auto px-4 py-8">
        {searchResults ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-white">Résultats de recherche - Films</h1>
              <button
                onClick={clearSearch}
                className="text-red-500 hover:text-red-400 transition-colors"
              >
                Effacer
              </button>
            </div>
            
            {searchResults.length > 0 ? (
              <MediaGrid
                title=""
                media={searchResults}
                type="movie"
                showMore
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">Aucun film trouvé.</p>
              </div>
            )}
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold text-white mb-8">Films</h1>
            
            {trendingMovies.length > 0 && (
              <MediaGrid
                title="🔥 Tendances du moment"
                media={trendingMovies}
                type="movie"
              />
            )}
            
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-6">Tous les films populaires</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {allMovies.map((movie) => (
                  <div key={`${movie.id}-${currentPage}`}>
                    <MediaCard media={movie} type="movie" />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center mt-8">
              <Button
                onClick={loadMore}
                disabled={isLoading}
                size="lg"
                className="bg-red-600 hover:bg-red-700"
              >
                {isLoading ? 'Chargement...' : 'Charger plus'}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Movies;
