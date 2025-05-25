import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../services/api';
import { Star, Calendar } from 'lucide-react';
import { TvShow } from '../types/tmdb';

interface SeriesCardProps {
  series: TvShow;
  className?: string;
}

const SeriesCard: React.FC<SeriesCardProps> = ({ series, className = '' }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/series/${series.id}`);
  };
  
  return (
    <div 
      className={`movie-card group ${className}`}
      onClick={handleClick}
    >
      <div className="aspect-[2/3] relative overflow-hidden rounded-lg">
        <img 
          src={getImageUrl(series.poster_path)} 
          alt={series.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        <div className="movie-card-overlay">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-medium text-sm truncate">{series.name}</h3>
            <div className="flex items-center mt-1 text-xs text-white/80">
              <div className="flex items-center">
                <Star className="w-3 h-3 mr-1 text-yellow-400" />
                <span>{series.vote_average.toFixed(1)}</span>
              </div>
              <div className="flex items-center ml-3">
                <Calendar className="w-3 h-3 mr-1" />
                <span>{series.first_air_date?.split('-')[0] || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeriesCard;