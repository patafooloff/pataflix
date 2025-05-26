import { useState, useEffect } from 'react';
import { Play, Info, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Movie, TVShow } from '@/types';
import { getBackdropUrl } from '@/services/tmdb';

interface HeroSectionProps {
  media: (Movie | TVShow)[];
}

const HeroSection = ({ media }: HeroSectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentMedia = media[currentIndex];

  useEffect(() => {
    if (media.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % media.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [media.length]);

  if (!currentMedia) return null;

  const isMovie = 'title' in currentMedia;
  const title = isMovie ? currentMedia.title : currentMedia.name;
  const year = isMovie 
    ? new Date(currentMedia.release_date).getFullYear()
    : new Date(currentMedia.first_air_date).getFullYear();

  return (
    <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 animate-fade-in"
        style={{
          backgroundImage: `url(${getBackdropUrl(currentMedia.backdrop_path)})`
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-netflix-dark/80 via-netflix-dark/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-netflix-dark/60 via-transparent to-transparent" />
      
      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold text-netflix-text-primary mb-4 animate-fade-in">
              {title}
            </h1>
            
            <div className="flex items-center space-x-4 mb-4 text-netflix-text-secondary">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span>{currentMedia.vote_average.toFixed(1)}</span>
              </div>
              <span>•</span>
              <span>{year}</span>
              <span>•</span>
              <span className="px-2 py-1 bg-netflix-red rounded text-xs font-medium text-netflix-text-primary">
                {isMovie ? 'FILM' : 'SÉRIE'}
              </span>
            </div>
            
            <p className="text-lg text-netflix-text-secondary mb-8 line-clamp-3 leading-relaxed">
              {currentMedia.overview}
            </p>
            
            <div className="flex items-center space-x-4">
              <Link to={`/${isMovie ? 'movie' : 'tv'}/${currentMedia.id}`}>
                <Button size="lg" className="bg-netflix-red text-netflix-text-primary hover:bg-netflix-red/90 px-8">
                  <Play className="w-5 h-5 mr-2 fill-current" />
                  Regarder
                </Button>
              </Link>
              
              <Link to={`/${isMovie ? 'movie' : 'tv'}/${currentMedia.id}`}>
                <Button size="lg" variant="outline" className="border-netflix-text-secondary text-netflix-text-primary hover:bg-netflix-light">
                  <Info className="w-5 h-5 mr-2" />
                  Plus d'infos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {media.slice(0, 5).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-netflix-red' : 'bg-netflix-text-secondary/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
