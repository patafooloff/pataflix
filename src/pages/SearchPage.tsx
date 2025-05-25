import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import tmdbService from '../services/tmdbService';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';
import SeriesCard from '../components/SeriesCard';
import Pagination from '../components/Pagination';
import LoadingPage from '../components/LoadingPage';
import { Search } from 'lucide-react';
import { Movie, TvShow } from '../types/tmdb';

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  
  // Get query from URL
  useEffect(() => {
    const queryFromUrl = searchParams.get('q');
    if (queryFromUrl) {
      setQuery(queryFromUrl);
    }
    
    const pageFromUrl = searchParams.get('page');
    if (pageFromUrl) {
      setPage(parseInt(pageFromUrl));
    } else {
      setPage(1);
    }
  }, [searchParams]);
  
  // Search
  const { 
    data: searchResults,
    isLoading,
    isFetching
  } = useQuery(
    ['search', query, page],
    () => tmdbService.searchMulti(query, page),
    {
      enabled: query.length > 0,
      keepPreviousData: true
    }
  );
  
  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    
    // Update URL
    if (newQuery) {
      const params = new URLSearchParams();
      params.set('q', newQuery);
      params.set('page', '1');
      setSearchParams(params);
      setPage(1);
    }
  };
  
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    
    // Update URL
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Show loading screen for initial load
  if (isLoading && !searchResults) {
    return <LoadingPage />;
  }
  
  const isMovie = (item: any): item is Movie => {
    return item.media_type === 'movie' || 'title' in item;
  };
  
  const isTvShow = (item: any): item is TvShow => {
    return item.media_type === 'tv' || 'name' in item;
  };
  
  const results = searchResults?.results || [];
  const totalPages = searchResults?.total_pages || 1;
  
  return (
    <div className="pt-20 pb-10">
      <div className="container space-y-8">
        <h1 className="text-3xl font-bold">Search</h1>
        
        {/* Search Bar */}
        <SearchBar 
          fullWidth={true} 
          autoFocus={!query} 
          initialQuery={query} 
          onSearch={handleSearch} 
        />
        
        {/* Search Results */}
        {query ? (
          <div>
            {isFetching && (
              <div className="py-4">
                <div className="animate-pulse text-center">Searching...</div>
              </div>
            )}
            
            {results.length > 0 ? (
              <>
                <h2 className="text-xl font-semibold mb-4">
                  Search results for "{query}"
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                  {results.map((item) => {
                    if (isMovie(item)) {
                      return <MovieCard key={`movie-${item.id}`} movie={item as Movie} />;
                    } else if (isTvShow(item)) {
                      return <SeriesCard key={`tv-${item.id}`} series={item as TvShow} />;
                    }
                    return null;
                  })}
                </div>
                
                {/* Pagination */}
                <Pagination 
                  currentPage={page} 
                  totalPages={Math.min(totalPages, 500)} 
                  onPageChange={handlePageChange} 
                />
              </>
            ) : (
              <div className="text-center py-20">
                <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-xl">No results found for "{query}"</p>
                <p className="text-muted-foreground mt-2">
                  Try different keywords or check the spelling
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20">
            <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-xl">Search for movies, TV shows, or people</p>
            <p className="text-muted-foreground mt-2">
              Enter a search term above to find what you're looking for
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;