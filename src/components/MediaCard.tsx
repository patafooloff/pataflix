import { Link } from 'react-router-dom';
import { Star, Calendar } from 'lucide-react';
import { Movie, TVShow } from '@/types';
import { getImageUrl } from '@/services/tmdb';

interface MediaCardProps {
  media: Movie | TVShow;
  type: 'movie' | 'tv';
}

const MediaCard = ({ media, type }: MediaCardProps) => {
  const title = type === 'movie' ? (media as Movie).title : (media as TVShow).name;
  const releaseDate = type === 'movie' ? (media as Movie).release_date : (media as TVShow).first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';

  return (
    <Link
      to={`/${type}/${media.id}`}
      className="group relative block bg-netflix-light rounded-lg overflow-hidden hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-netflix-red/20 animate-fade-in"
    >
      <div className="aspect-[2/3] relative overflow-hidden">
        <img
          src={getImageUrl(media.poster_path)}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Note */}
        <div className="absolute top-2 right-2 bg-netflix-dark/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
          <Star className="w-3 h-3 text-yellow-500 fill-current" />
          <span className="text-xs text-netflix-text-primary font-medium">
            {media.vote_average.toFixed(1)}
          </span>
        </div>

        {/* Info au survol */}
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <h3 className="text-netflix-text-primary font-semibold text-sm mb-1 line-clamp-2">{title}</h3>
          {year && (
            <div className="flex items-center text-netflix-text-secondary text-xs">
              <Calendar className="w-3 h-3 mr-1" />
              {year}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default MediaCard;
