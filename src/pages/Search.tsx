
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import MediaGrid from '@/components/MediaGrid';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { tmdbApi } from '@/services/tmdb';
import { Movie, TVShow } from '@/types';
import { Search as SearchIcon } from 'lucide-react';

const Search = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{movies: Movie[], shows: TVShow[]} | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (searchQuery?: string) => {
    const searchTerm = searchQuery || query;
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    try {
      const [movies, shows] = await Promise.all([
        tmdbApi.searchMovies(searchTerm),
        tmdbApi.searchTVShows(searchTerm)
      ]);
      setSearchResults({ movies, shows });
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const clearSearch = () => {
    setSearchResults(null);
    setQuery('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <Navigation onSearch={handleSearch} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto mb-8">
          <h1 className="text-4xl font-bold text-white text-center mb-8">Recherche</h1>
          
          <form onSubmit={handleSubmit} className="flex gap-4">
            <Input
              type="text"
              placeholder="Rechercher des films, séries..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 text-lg py-3"
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 px-8"
            >
              <SearchIcon className="w-5 h-5" />
            </Button>
          </form>
        </div>

        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <p className="text-gray-400 mt-4">Recherche en cours...</p>
          </div>
        )}

        {searchResults && !isLoading && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Résultats pour "{query}"
              </h2>
              <button
                onClick={clearSearch}
                className="text-red-500 hover:text-red-400 transition-colors"
              >
                Nouvelle recherche
              </button>
            </div>
            
            {searchResults.movies.length > 0 && (
              <MediaGrid
                title={`Films (${searchResults.movies.length})`}
                media={searchResults.movies}
                type="movie"
                showMore
              />
            )}
            
            {searchResults.shows.length > 0 && (
              <MediaGrid
                title={`Séries (${searchResults.shows.length})`}
                media={searchResults.shows}
                type="tv"
                showMore
              />
            )}
            
            {searchResults.movies.length === 0 && searchResults.shows.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">
                  Aucun résultat trouvé pour "{query}".
                </p>
                <p className="text-gray-500 mt-2">
                  Essayez avec d'autres termes de recherche.
                </p>
              </div>
            )}
          </>
        )}

        {!searchResults && !isLoading && (
          <div className="text-center py-12">
            <SearchIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">
              Commencez votre recherche en tapant le nom d'un film ou d'une série.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
