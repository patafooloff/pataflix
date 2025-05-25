import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import tmdbService from '../services/tmdbService';
import HeroSection from '../components/HeroSection';
import ContentRow from '../components/ContentRow';
import LoadingPage from '../components/LoadingPage';
import { Movie, TvShow } from '../types/tmdb';

const HomePage: React.FC = () => {
  const [heroContent, setHeroContent] = useState<Movie | TvShow | null>(null);

  // Fetch trending content
  const { data: trendingAll, isLoading: isTrendingLoading } = useQuery(
    'trendingAll',
    () => tmdbService.getTrending('all', 'week')
  );

  // Fetch popular movies
  const { data: popularMovies } = useQuery(
    'popularMovies',
    () => tmdbService.getPopular('movie')
  );

  // Fetch popular TV shows
  const { data: popularTvShows } = useQuery(
    'popularTvShows',
    () => tmdbService.getPopular('tv')
  );

  // Fetch top rated movies
  const { data: topRatedMovies } = useQuery(
    'topRatedMovies',
    () => tmdbService.getTopRated('movie')
  );

  // Fetch top rated TV shows
  const { data: topRatedTvShows } = useQuery(
    'topRatedTvShows',
    () => tmdbService.getTopRated('tv')
  );

  // Fetch now playing movies
  const { data: nowPlayingMovies } = useQuery(
    'nowPlayingMovies',
    () => tmdbService.getNowPlaying()
  );

  // Fetch on the air TV shows
  const { data: onTheAirTvShows } = useQuery(
    'onTheAirTvShows',
    () => tmdbService.getOnTheAir()
  );

  // Set hero content
  useEffect(() => {
    if (trendingAll && trendingAll.length > 0) {
      // Get a random item from the top 10 trending items
      const randomIndex = Math.floor(Math.random() * Math.min(10, trendingAll.length));
      setHeroContent(trendingAll[randomIndex]);
    }
  }, [trendingAll]);

  // Show loading screen while fetching initial data
  if (isTrendingLoading || !heroContent) {
    return <LoadingPage />;
  }

  return (
    <div className="pb-10">
      {/* Hero Section */}
      <HeroSection item={heroContent} />

      {/* Content Rows */}
      <div className="space-y-2 mt-6">
        {trendingAll && (
          <ContentRow 
            title="Trending Now" 
            items={trendingAll} 
            type="movie"
          />
        )}
        
        {popularMovies && (
          <ContentRow 
            title="Popular Movies" 
            items={popularMovies} 
            type="movie"
          />
        )}
        
        {popularTvShows && (
          <ContentRow 
            title="Popular TV Shows" 
            items={popularTvShows} 
            type="tv"
          />
        )}
        
        {nowPlayingMovies && (
          <ContentRow 
            title="Now Playing in Theaters" 
            items={nowPlayingMovies} 
            type="movie"
          />
        )}
        
        {onTheAirTvShows && (
          <ContentRow 
            title="Currently Airing TV Shows" 
            items={onTheAirTvShows} 
            type="tv"
          />
        )}
        
        {topRatedMovies && (
          <ContentRow 
            title="Top Rated Movies" 
            items={topRatedMovies} 
            type="movie"
          />
        )}
        
        {topRatedTvShows && (
          <ContentRow 
            title="Top Rated TV Shows" 
            items={topRatedTvShows} 
            type="tv"
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;