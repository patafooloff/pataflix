import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Info } from 'lucide-react';
import { getImageUrl } from '../services/api';
import { Movie, TvShow } from '../types/tmdb';

interface HeroSectionProps {
  item: Movie | TvShow;
}

const HeroSection: React.FC<HeroSectionProps> = ({ item }) => {
  const navigate = useNavigate();
  const isMovie = 'title' in item;
  
  const title = isMovie ? (item as Movie).title : (item as TvShow).name;
  const overview = item.overview;
  const backdropPath = item.backdrop_path;
  const id = item.id;
  
  const handlePlayClick = () => {
    if (isMovie) {
      navigate(`/movie/${id}`);
    } else {
      navigate(`/series/${id}`);
    }
  };
  
  const handleInfoClick = () => {
    if (isMovie) {
      navigate(`/movie/${id}`);
    } else {
      navigate(`/series/${id}`);
    }
  };
  
  return (
    <div className="relative w-full h-[70vh] md:h-[80vh]">
      {/* Backdrop Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={getImageUrl(backdropPath, 'original')} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="hero-gradient"></div>
      </div>
      
      {/* Content */}
      <div className="container relative z-10 h-full flex flex-col justify-end pb-20">
        <div className="max-w-2xl slide-up" style={{ animationDelay: '0.3s' }}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">{title}</h1>
          <p className="text-sm md:text-base text-foreground/80 mb-8 line-clamp-3 md:line-clamp-4">
            {overview}
          </p>
          
          <div className="flex space-x-4">
            <button 
              onClick={handlePlayClick}
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-md flex items-center font-medium transition-colors"
            >
              <Play className="w-5 h-5 mr-2" /> Play Now
            </button>
            <button 
              onClick={handleInfoClick}
              className="px-6 py-3 bg-secondary hover:bg-secondary/80 text-white rounded-md flex items-center font-medium transition-colors"
            >
              <Info className="w-5 h-5 mr-2" /> More Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;