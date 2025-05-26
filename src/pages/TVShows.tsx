
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navigation from '@/components/Navigation';
import MediaGrid from '@/components/MediaGrid';
import MediaCard from '@/components/MediaCard';
import { Button } from '@/components/ui/button';
import { tmdbApi } from '@/services/tmdb';
import { TVShow } from '@/types';
import { ChevronRight } from 'lucide-react';

const TVShows = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [allShows, setAllShows] = useState<TVShow[]>([]);
  const [searchResults, setSearchResults] = useState<TVShow[] | null>(null);

  const { data: shows = [], isLoading } = useQuery({
    queryKey: ['tvShows', currentPage],
    queryFn: () => tmdbApi.getTVShows(currentPage)
  });

  const { data: trendingShows = [] } = useQuery({
    queryKey: ['trendingShows'],
    queryFn: tmdbApi.getTrendingTVShows
  });

  useEffect(() => {
    if (shows.length > 0) {
      setAllShows(prev => {
        const newShows = shows.filter(show => 
          !prev.some(existing => existing.id === show.id)
        );
        return [...prev, ...newShows];
      });
    }
  }, [shows]);

  const handleSearch = async (query: string) => {
    try {
      const results = await tmdbApi.searchTVShows(query);
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
              <h1 className="text-3xl font-bold text-white">Résultats de recherche - Séries</h1>
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
                type="tv"
                showMore
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">Aucune série trouvée.</p>
              </div>
            )}
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold text-white mb-8">Séries</h1>
            
            {trendingShows.length > 0 && (
              <MediaGrid
                title="🔥 Tendances du moment"
                media={trendingShows}
                type="tv"
              />
            )}
            
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-6">Toutes les séries populaires</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {allShows.map((show) => (
                  <div key={`${show.id}-${currentPage}`}>
                    <MediaCard media={show} type="tv" />
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

export default TVShows;
