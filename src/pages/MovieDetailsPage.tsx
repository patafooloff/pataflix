import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import tmdbService from '../services/tmdbService';
import playerService from '../services/playerService';
import { getImageUrl } from '../services/api';
import LoadingPage from '../components/LoadingPage';
import PlayerEmbed from '../components/PlayerEmbed';
import ContentRow from '../components/ContentRow';
import { Star, Clock, Calendar, User, Film, Play } from 'lucide-react';

const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [showPlayer, setShowPlayer] = useState(false);
  
  // Fetch movie details
  const { 
    data: movie, 
    isLoading: isMovieLoading,
    error: movieError
  } = useQuery(
    ['movieDetails', id],
    () => id ? tmdbService.getMovieDetails(id) : Promise.reject('No ID provided'),
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
  
  // Fetch player links when movie details are available
  const { 
    data: playerData, 
    isLoading: isPlayerLoading 
  } = useQuery(
    ['moviePlayer', movie?.external_ids?.imdb_id],
    () => movie?.external_ids?.imdb_id 
      ? playerService.getMoviePlayerLinks(movie.external_ids.imdb_id) 
      : Promise.reject('No IMDB ID available'),
    {
      enabled: !!movie?.external_ids?.imdb_id,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
  
  // Format runtime
  const formatRuntime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  // Format date
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  // Show loading screen while fetching initial data
  if (isMovieLoading) {
    return <LoadingPage />;
  }
  
  // Show error if movie not found
  if (movieError || !movie) {
    return (
      <div className="pt-20 pb-10 container">
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-2">Movie Not Found</h2>
          <p className="text-muted-foreground">
            The movie you're looking for doesn't exist or is unavailable.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="pb-10">
      {/* Hero Banner */}
      <div className="relative h-[70vh] md:h-[80vh]">
        <div className="absolute inset-0 z-0">
          <img 
            src={getImageUrl(movie.backdrop_path, 'original')} 
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-transparent"></div>
        </div>
        
        <div className="container relative z-10 h-full pt-20 flex flex-col justify-end pb-10">
          <div className="flex flex-col md:flex-row md:items-end md:space-x-8">
            {/* Poster */}
            <div className="hidden md:block w-64 flex-shrink-0 mb-6">
              <img 
                src={getImageUrl(movie.poster_path)} 
                alt={movie.title}
                className="w-full rounded-lg shadow-lg"
              />
            </div>
            
            {/* Details */}
            <div className="flex-grow">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{movie.title}</h1>
              
              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm md:text-base text-foreground/80">
                {movie.vote_average > 0 && (
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-500 mr-1" />
                    <span>{movie.vote_average.toFixed(1)}/10</span>
                  </div>
                )}
                
                {movie.runtime > 0 && (
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-1" />
                    <span>{formatRuntime(movie.runtime)}</span>
                  </div>
                )}
                
                {movie.release_date && (
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-1" />
                    <span>{formatDate(movie.release_date)}</span>
                  </div>
                )}
                
                {movie.genres && movie.genres.length > 0 && (
                  <div className="flex items-center">
                    <Film className="w-5 h-5 mr-1" />
                    <span>{movie.genres.map(g => g.name).join(', ')}</span>
                  </div>
                )}
              </div>
              
              {/* Overview */}
              <p className="text-base md:text-lg mb-8 line-clamp-4 md:line-clamp-none">
                {movie.overview}
              </p>
              
              {/* Watch Button */}
              <button 
                onClick={() => setShowPlayer(true)}
                className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-md flex items-center font-medium transition-colors"
                disabled={isPlayerLoading || !playerData?.player_links?.length}
              >
                <Play className="w-5 h-5 mr-2" /> 
                {isPlayerLoading ? 'Loading Players...' : 'Watch Now'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Player */}
      {showPlayer && playerData && playerData.player_links && playerData.player_links.length > 0 && (
        <div className="container my-8">
          <h2 className="text-2xl font-bold mb-4">
            Watch {movie.title} {playerData.version && `(${playerData.version})`}
          </h2>
          <PlayerEmbed playerLinks={playerData.player_links} />
        </div>
      )}
      
      {/* Cast */}
      {movie.credits && movie.credits.cast && movie.credits.cast.length > 0 && (
        <div className="container my-8">
          <h2 className="text-2xl font-bold mb-4">Cast</h2>
          <div className="flex overflow-x-auto space-x-4 pb-4">
            {movie.credits.cast.slice(0, 10).map((person) => (
              <div key={person.id} className="flex-shrink-0 w-32">
                <div className="aspect-[2/3] relative overflow-hidden rounded-lg bg-secondary">
                  {person.profile_path ? (
                    <img 
                      src={getImageUrl(person.profile_path)} 
                      alt={person.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <h3 className="mt-2 text-sm font-medium truncate">{person.name}</h3>
                <p className="text-xs text-muted-foreground truncate">{person.character}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Similar Movies */}
      {movie.similar && movie.similar.results && movie.similar.results.length > 0 && (
        <ContentRow 
          title="Similar Movies" 
          items={movie.similar.results} 
          type="movie"
        />
      )}
    </div>
  );
};

export default MovieDetailsPage;