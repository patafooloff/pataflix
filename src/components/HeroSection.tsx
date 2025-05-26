
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
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{
          backgroundImage: `url(${getBackdropUrl(currentMedia.backdrop_path)})`
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      
      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in">
              {title}
            </h1>
            
            <div className="flex items-center space-x-4 mb-4 text-white/80">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span>{currentMedia.vote_average.toFixed(1)}</span>
              </div>
              <span>•</span>
              <span>{year}</span>
              <span>•</span>
              <span className="px-2 py-1 bg-red-600 rounded text-xs font-medium">
                {isMovie ? 'FILM' : 'SÉRIE'}
              </span>
            </div>
            
            <p className="text-lg text-white/90 mb-8 line-clamp-3 leading-relaxed">
              {currentMedia.overview}
            </p>
            
            <div className="flex items-center space-x-4">
              <Link to={`/${isMovie ? 'movie' : 'tv'}/${currentMedia.id}`}>
                <Button size="lg" className="bg-white text-black hover:bg-white/90 px-8">
                  <Play className="w-5 h-5 mr-2 fill-current" />
                  Regarder
                </Button>
              </Link>
              
              <Link to={`/${isMovie ? 'movie' : 'tv'}/${currentMedia.id}`}>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
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
              index === currentIndex ? 'bg-white' : 'bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
