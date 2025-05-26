
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navigation from '@/components/Navigation';
import VideoPlayer from '@/components/VideoPlayer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { tmdbApi, getImageUrl, getBackdropUrl } from '@/services/tmdb';
import { streamingApi } from '@/services/streaming';
import { Movie, MoviePlayerResponse } from '@/types';
import { Star, Calendar, Clock, ArrowLeft, Play } from 'lucide-react';

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [playerData, setPlayerData] = useState<MoviePlayerResponse | null>(null);
  const [isLoadingStreams, setIsLoadingStreams] = useState(false);

  const { data: movie, isLoading } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => tmdbApi.getMovieDetails(Number(id)),
    enabled: !!id
  });

  const loadStreams = async () => {
    if (!movie?.imdb_id) return;
    
    setIsLoadingStreams(true);
    try {
      const streams = await streamingApi.getMovieStreams(movie.imdb_id);
      setPlayerData(streams);
    } catch (error) {
      console.error('Error loading streams:', error);
    } finally {
      setIsLoadingStreams(false);
    }
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

  if (!movie) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Film non trouvé</h1>
            <Link to="/movies">
              <Button className="bg-red-600 hover:bg-red-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux films
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const year = new Date(movie.release_date).getFullYear();
  const runtime = (movie as any).runtime || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${getBackdropUrl(movie.backdrop_path)})`
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
              src={getImageUrl(movie.poster_path)}
              alt={movie.title}
              className="w-full max-w-sm mx-auto rounded-lg shadow-2xl"
            />
          </div>

          {/* Informations */}
          <div className="md:col-span-2 text-white">
            <div className="mb-4">
              <Link to="/movies" className="text-red-500 hover:text-red-400 flex items-center mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux films
              </Link>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">{movie.title}</h1>
            
            <div className="flex items-center space-x-6 mb-6 text-gray-300">
              <div className="flex items-center space-x-1">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <span className="font-semibold">{movie.vote_average.toFixed(1)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-5 h-5" />
                <span>{year}</span>
              </div>
              {runtime > 0 && (
                <div className="flex items-center space-x-1">
                  <Clock className="w-5 h-5" />
                  <span>{Math.floor(runtime / 60)}h {runtime % 60}min</span>
                </div>
              )}
            </div>

            <p className="text-lg text-gray-300 mb-8 leading-relaxed max-w-4xl">
              {movie.overview}
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <Button
                onClick={loadStreams}
                disabled={isLoadingStreams || !movie.imdb_id}
                size="lg"
                className="bg-red-600 hover:bg-red-700"
              >
                <Play className="w-5 h-5 mr-2" />
                {isLoadingStreams ? 'Chargement...' : 'Regarder maintenant'}
              </Button>
            </div>

            {movie.imdb_id && (
              <p className="text-sm text-gray-400">
                IMDB ID: {movie.imdb_id}
              </p>
            )}
          </div>
        </div>

        {/* Lecteur vidéo */}
        {playerData && (
          <div className="mt-12">
            <VideoPlayer
              playerLinks={playerData.player_links}
              version={playerData.version}
            />
          </div>
        )}

        {isLoadingStreams && (
          <Card className="mt-12 p-8 bg-gray-800 border-gray-700 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-300">Chargement des lecteurs...</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
