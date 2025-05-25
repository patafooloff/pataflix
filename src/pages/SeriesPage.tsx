import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import tmdbService from '../services/tmdbService';
import SeriesCard from '../components/SeriesCard';
import GenreSelector from '../components/GenreSelector';
import Pagination from '../components/Pagination';
import LoadingPage from '../components/LoadingPage';
import { Genre } from '../types/tmdb';

const SeriesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  
  // Extract genre from URL if present
  useEffect(() => {
    const genreFromUrl = searchParams.get('genre');
    if (genreFromUrl) {
      setSelectedGenre(parseInt(genreFromUrl));
    }
    
    const pageFromUrl = searchParams.get('page');
    if (pageFromUrl) {
      setCurrentPage(parseInt(pageFromUrl));
    }
  }, [searchParams]);
  
  // Fetch genres
  const { data: genres, isLoading: isGenresLoading } = useQuery<Genre[]>(
    'tvGenres',
    () => tmdbService.getGenres('tv')
  );
  
  // Fetch TV shows by genre or popular if no genre selected
  const { 
    data: seriesData, 
    isLoading: isSeriesLoading,
    isFetching
  } = useQuery(
    ['series', selectedGenre, currentPage],
    () => selectedGenre 
      ? tmdbService.getTvShowsByGenre(selectedGenre, currentPage)
      : tmdbService.getPopular('tv').then(results => ({ results, total_pages: 500 }))
  );
  
  const handleGenreSelect = (genreId: number | null) => {
    setSelectedGenre(genreId);
    setCurrentPage(1);
    
    // Update URL
    const params = new URLSearchParams();
    if (genreId) {
      params.set('genre', genreId.toString());
    }
    params.set('page', '1');
    setSearchParams(params);
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    
    // Update URL
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    setSearchParams(params);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Show loading screen while fetching initial data
  if (isGenresLoading || (!genres && isSeriesLoading)) {
    return <LoadingPage />;
  }
  
  const series = seriesData?.results || [];
  const totalPages = seriesData?.total_pages || 1;
  
  return (
    <div className="pt-20 pb-10">
      <div className="container">
        <h1 className="text-3xl font-bold mb-6">TV Series</h1>
      </div>
      
      {/* Genre Selector */}
      {genres && (
        <GenreSelector 
          genres={genres} 
          selectedGenre={selectedGenre} 
          onSelectGenre={handleGenreSelect} 
        />
      )}
      
      {/* Series Grid */}
      <div className="container">
        {isFetching && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
            <div className="animate-pulse">Loading...</div>
          </div>
        )}
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {series.map(show => (
            <SeriesCard key={show.id} series={show} />
          ))}
        </div>
        
        {series.length === 0 && !isFetching && (
          <div className="text-center py-20">
            <p className="text-lg">No TV series found.</p>
          </div>
        )}
        
        {/* Pagination */}
        <Pagination 
          currentPage={currentPage} 
          totalPages={Math.min(totalPages, 500)} // TMDB API limits to 500 pages
          onPageChange={handlePageChange} 
        />
      </div>
    </div>
  );
};

export default SeriesPage;