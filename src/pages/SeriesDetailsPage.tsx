import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import tmdbService from '../services/tmdbService';
import playerService from '../services/playerService';
import { getImageUrl } from '../services/api';
import LoadingPage from '../components/LoadingPage';
import PlayerEmbed from '../components/PlayerEmbed';
import SeasonSelector from '../components/SeasonSelector';
import ContentRow from '../components/ContentRow';
import { Star, Calendar, User, Tv } from 'lucide-react';
import { Season, Episode } from '../types/player';

const SeriesDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<string | null>(null);
  const [currentPlayers, setCurrentPlayers] = useState<any[]>([]);
  
  // Fetch series details
  const { 
    data: series, 
    isLoading: isSeriesLoading,
    error: seriesError
  } = useQuery(
    ['seriesDetails', id],
    () => id ? tmdbService.getTvShowDetails(id) : Promise.reject('No ID provided'),
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
  
  // Fetch player links when series details are available
  const { 
    data: playerData, 
    isLoading: isPlayerLoading 
  } = useQuery(
    ['seriesPlayer', series?.external_ids?.imdb_id],
    () => series?.external_ids?.imdb_id 
      ? playerService.getTvShowPlayerLinks(series.external_ids.imdb_id) 
      : Promise.reject('No IMDB ID available'),
    {
      enabled: !!series?.external_ids?.imdb_id,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
  
  // Set initial season and episode when data is loaded
  useEffect(() => {
    if (playerData && playerData.series && playerData.series.length > 0) {
      const firstSeries = playerData.series[0];
      if (firstSeries.seasons && firstSeries.seasons.length > 0) {
        setSelectedSeason(firstSeries.seasons[0]);
        
        if (firstSeries.seasons[0].episodes && firstSeries.seasons[0].episodes.length > 0) {
          setSelectedEpisode(firstSeries.seasons[0].episodes[0].number);
        }
      }
    }
  }, [playerData]);
  
  // Update player when episode changes
  useEffect(() => {
    if (selectedSeason && selectedEpisode) {
      const episode = selectedSeason.episodes.find(e => e.number === selectedEpisode);
      if (episode && episode.versions.vf && episode.versions.vf.players) {
        setCurrentPlayers(episode.versions.vf.players);
      }
    }
  }, [selectedSeason, selectedEpisode]);
  
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
  
  const handleSeasonSelect = (season: Season) => {
    setSelectedSeason(season);
    if (season.episodes && season.episodes.length > 0) {
      setSelectedEpisode(season.episodes[0].number);
    } else {
      setSelectedEpisode(null);
    }
  };
  
  const handleEpisodeSelect = (season: Season, episodeNumber: string) => {
    setSelectedSeason(season);
    setSelectedEpisode(episodeNumber);
  };
  
  // Show loading screen while fetching initial data
  if (isSeriesLoading) {
    return <LoadingPage />;
  }
  
  // Show error if series not found
  if (seriesError || !series) {
    return (
      <div className="pt-20 pb-10 container">
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-2">TV Series Not Found</h2>
          <p className="text-muted-foreground">
            The TV series you're looking for doesn't exist or is unavailable.
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
            src={getImageUrl(series.backdrop_path, 'original')} 
            alt={series.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-transparent"></div>
        </div>
        
        <div className="container relative z-10 h-full pt-20 flex flex-col justify-end pb-10">
          <div className="flex flex-col md:flex-row md:items-end md:space-x-8">
            {/* Poster */}
            <div className="hidden md:block w-64 flex-shrink-0 mb-6">
              <img 
                src={getImageUrl(series.poster_path)} 
                alt={series.name}
                className="w-full rounded-lg shadow-lg"
              />
            </div>
            
            {/* Details */}
            <div className="flex-grow">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{series.name}</h1>
              
              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm md:text-base text-foreground/80">
                {series.vote_average > 0 && (
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-500 mr-1" />
                    <span>{series.vote_average.toFixed(1)}/10</span>
                  </div>
                )}
                
                {series.first_air_date && (
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-1" />
                    <span>{formatDate(series.first_air_date)}</span>
                  </div>
                )}
                
                {series.genres && series.genres.length > 0 && (
                  <div className="flex items-center">
                    <Tv className="w-5 h-5 mr-1" />
                    <span>{series.genres.map(g => g.name).join(', ')}</span>
                  </div>
                )}
                
                {series.number_of_seasons > 0 && (
                  <div>
                    <span>{series.number_of_seasons} Season{series.number_of_seasons !== 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
              
              {/* Overview */}
              <p className="text-base md:text-lg mb-8 line-clamp-4 md:line-clamp-none">
                {series.overview}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Season & Episodes */}
          <div className="md:col-span-1 order-2 md:order-1">
            <h2 className="text-2xl font-bold mb-4">Episodes</h2>
            
            {isPlayerLoading ? (
              <div className="text-center py-8">
                <p>Loading episodes...</p>
              </div>
            ) : playerData && playerData.series && playerData.series.length > 0 && playerData.series[0].seasons ? (
              <SeasonSelector 
                seasons={playerData.series[0].seasons} 
                onSelectSeason={handleSeasonSelect}
                onSelectEpisode={handleEpisodeSelect}
              />
            ) : (
              <div className="bg-secondary/50 rounded-lg p-8 text-center">
                <p>No episodes available for this series.</p>
              </div>
            )}
          </div>
          
          {/* Player */}
          <div className="md:col-span-2 order-1 md:order-2">
            <h2 className="text-2xl font-bold mb-4">
              {selectedSeason && selectedEpisode ? (
                <>
                  S{selectedSeason.number} E{selectedEpisode}: {
                    selectedSeason.episodes
                      .find(e => e.number === selectedEpisode)?.versions.vf?.title || 'Episode'
                  }
                </>
              ) : (
                'Watch Episodes'
              )}
            </h2>
            
            {currentPlayers && currentPlayers.length > 0 ? (
              <PlayerEmbed 
                playerLinks={currentPlayers.map(p => ({ 
                  player: p.name.toLowerCase(), 
                  link: p.link 
                }))} 
              />
            ) : (
              <div className="bg-secondary/50 rounded-lg p-8 text-center">
                <p>Select an episode to watch.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Cast */}
      {series.credits && series.credits.cast && series.credits.cast.length > 0 && (
        <div className="container my-8">
          <h2 className="text-2xl font-bold mb-4">Cast</h2>
          <div className="flex overflow-x-auto space-x-4 pb-4">
            {series.credits.cast.slice(0, 10).map((person) => (
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
      
      {/* Similar Series */}
      {series.similar && series.similar.results && series.similar.results.length > 0 && (
        <ContentRow 
          title="Similar TV Shows" 
          items={series.similar.results} 
          type="tv"
        />
      )}
    </div>
  );
};

export default SeriesDetailsPage;