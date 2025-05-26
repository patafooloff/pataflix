import { Movie, TVShow } from '@/types';
import MediaCard from './MediaCard';

interface MediaGridProps {
  title: string;
  media: (Movie | TVShow)[];
  type: 'movie' | 'tv';
  showMore?: boolean;
}

const MediaGrid = ({ title, media, type, showMore = false }: MediaGridProps) => {
  const displayMedia = showMore ? media : media.slice(0, 12);

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-white mb-6 animate-fade-in">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {displayMedia.map((item) => (
          <MediaCard
            key={item.id}
            media={item}
            type={type}
          />
        ))}
      </div>
    </div>
  );
};

export default MediaGrid;
