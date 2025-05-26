import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { tmdbApi, getImageUrl, getBackdropUrl } from '@/services/tmdb';
import { streamingApi } from '@/services/streaming';
import { TVShow, TVPlayerResponse, Episode } from '@/types';
import { Star, Calendar, ArrowLeft, Play, ExternalLink } from 'lucide-react';

const TVShowDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [playerData, setPlayerData] = useState<TVPlayerResponse | null>(null);
  const [isLoadingStreams, setIsLoadingStreams] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState<{
    seasonNumber: number;
    episodeNumber: string;
    episode: Episode;
  } | null>(null);
  const [selectedPlayerLink, setSelectedPlayerLink] = useState<string | null>(null);

  const { data: show, isLoading } = useQuery({
    queryKey: ['tvShow', id],
    queryFn: () => tmdbApi.getTVShowDetails(Number(id)),
    enabled: !!id
  });

  const loadStreams = async () => {
    if (!show?.external_ids?.imdb_id) return;
    
    setIsLoadingStreams(true);
    try {
      const streams = await streamingApi.getTVStreams(show.external_ids.imdb_id);
      setPlayerData(streams);
    } catch (error) {
      console.error('Error loading streams:', error);
    } finally {
      setIsLoadingStreams(false);
    }
  };

  const playEpisode = (seasonNumber: number, episodeNumber: string, episode: Episode) => {
    setSelectedEpisode({ seasonNumber, episodeNumber, episode });
    setSelectedPlayerLink(null); // Reset player selection
  };

  const selectPlayer = (playerLink: string) => {
    setSelectedPlayerLink(playerLink);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Série non trouvée</h1>
            <Link to="/series">
              <Button className="bg-red-600 hover:bg-red-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux séries
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const year = new Date(show.first_air_date).getFullYear();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${getBackdropUrl(show.backdrop_path)})`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Poster */}
          <div className="md:col-span-1">
            <img
              src={getImageUrl(show.poster_path)}
              alt={show.name}
              className="w-full max-w-sm mx-auto rounded-lg shadow-2xl"
            />
          </div>

          {/* Informations */}
          <div className="md:col-span-2 text-white">
            <div className="mb-4">
              <Link to="/series" className="text-red-500 hover:text-red-400 flex items-center mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux séries
              </Link>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">{show.name}</h1>
            
            <div className="flex items-center space-x-6 mb-6 text-gray-300">
              <div className="flex items-center space-x-1">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <span className="font-semibold">{show.vote_average.toFixed(1)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-5 h-5" />
                <span>{year}</span>
              </div>
            </div>

            <p className="text-lg text-gray-300 mb-8 leading-relaxed max-w-4xl">
              {show.overview}
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <Button
                onClick={loadStreams}
                disabled={isLoadingStreams || !show.external_ids?.imdb_id}
                size="lg"
                className="bg-red-600 hover:bg-red-700"
              >
                <Play className="w-5 h-5 mr-2" />
                {isLoadingStreams ? 'Chargement...' : 'Voir les épisodes'}
              </Button>
            </div>

            {show.external_ids?.imdb_id && (
              <p className="text-sm text-gray-400">
                IMDB ID: {show.external_ids.imdb_id}
              </p>
            )}
          </div>
        </div>

        {/* Lecteur vidéo intégré */}
        {selectedPlayerLink && selectedEpisode && (
          <Card className="mt-8 bg-gray-800 border-gray-700 overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                {show.name} - Saison {selectedEpisode.seasonNumber} - Épisode {selectedEpisode.episodeNumber}: {selectedEpisode.episode.versions.vf.title}
              </h3>
              <div className="aspect-video">
                <iframe
                  src={selectedPlayerLink}
                  className="w-full h-full"
                  allowFullScreen
                  frameBorder="0"
                  title={`Lecteur - S${selectedEpisode.seasonNumber}E${selectedEpisode.episodeNumber}`}
                />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-gray-300">
                  En cours de lecture
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(selectedPlayerLink, '_blank')}
                  className="text-gray-300 hover:text-white"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Ouvrir dans un nouvel onglet
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Épisodes */}
        {playerData && playerData.series.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Épisodes</h2>
            
            {playerData.series.map((series, seriesIndex) => (
              <Card key={seriesIndex} className="bg-gray-800 border-gray-700 mb-8">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">{series.title}</h3>
                  
                  <Tabs defaultValue={series.seasons[0]?.number.toString()} className="w-full">
                    <TabsList className="grid w-full grid-cols-auto bg-gray-700">
                      {series.seasons.map((season) => (
                        <TabsTrigger 
                          key={season.number} 
                          value={season.number.toString()}
                          className="data-[state=active]:bg-red-600"
                        >
                          {season.title}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {series.seasons.map((season) => (
                      <TabsContent key={season.number} value={season.number.toString()}>
                        <div className="grid gap-4 mt-4">
                          {season.episodes.map((episode) => (
                            <Card key={episode.number} className="bg-gray-700 border-gray-600">
                              <div className="p-4">
                                <div className="flex items-center justify-between mb-4">
                                  <div>
                                    <h4 className="text-white font-medium">
                                      Épisode {episode.number}: {episode.versions.vf.title}
                                    </h4>
                                    <p className="text-gray-400 text-sm">
                                      {episode.versions.vf.players.length} lecteur(s) disponible(s)
                                    </p>
                                  </div>
                                  <Button
                                    onClick={() => playEpisode(season.number, episode.number, episode)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    <Play className="w-4 h-4 mr-2" />
                                    Sélectionner
                                  </Button>
                                </div>

                                {/* Lecteurs pour cet épisode */}
                                {selectedEpisode?.seasonNumber === season.number && 
                                 selectedEpisode?.episodeNumber === episode.number && (
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {episode.versions.vf.players.map((player, index) => (
                                      <Button
                                        key={index}
                                        variant={selectedPlayerLink === player.link ? "default" : "outline"}
                                        className={`h-auto p-4 flex flex-col items-center space-y-2 ${
                                          selectedPlayerLink === player.link
                                            ? "bg-red-600 hover:bg-red-700 border-red-600" 
                                            : "border-gray-600 text-gray-300 hover:text-white hover:border-gray-500"
                                        }`}
                                        onClick={() => selectPlayer(player.link)}
                                      >
                                        <Play className="w-5 h-5" />
                                        <span className="text-sm font-medium">{player.name}</span>
                                      </Button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
              </Card>
            ))}
          </div>
        )}

        {isLoadingStreams && (
          <Card className="mt-12 p-8 bg-gray-800 border-gray-700 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-300">Chargement des épisodes...</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TVShowDetails;
