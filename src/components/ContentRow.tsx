import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';
import SeriesCard from './SeriesCard';
import { Movie, TvShow } from '../types/tmdb';

interface ContentRowProps {
  title: string;
  items: (Movie | TvShow)[];
  type: 'movie' | 'tv';
}

const ContentRow: React.FC<ContentRowProps> = ({ title, items, type }) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { current } = rowRef;
      const scrollAmount = current.clientWidth * 0.75;
      
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const isMovie = (item: Movie | TvShow): item is Movie => {
    return 'title' in item;
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="py-6">
      <div className="container">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => scroll('left')}
              className="p-1 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-1 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div 
        ref={rowRef}
        className="flex overflow-x-auto pb-4 hide-scrollbar"
        style={{ scrollbarWidth: 'none' }}
      >
        <div className="pl-4 md:pl-6 flex space-x-4 md:space-x-6">
          {items.map((item) => (
            <div key={item.id} className="w-32 md:w-40 lg:w-48 flex-shrink-0">
              {type === 'movie' && isMovie(item) ? (
                <MovieCard movie={item} />
              ) : (
                <SeriesCard series={item as TvShow} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentRow;