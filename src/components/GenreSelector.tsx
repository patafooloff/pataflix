import React from 'react';
import { Genre } from '../types/tmdb';

interface GenreSelectorProps {
  genres: Genre[];
  selectedGenre: number | null;
  onSelectGenre: (genreId: number | null) => void;
}

const GenreSelector: React.FC<GenreSelectorProps> = ({ 
  genres, 
  selectedGenre, 
  onSelectGenre 
}) => {
  return (
    <div className="mb-8">
      <div className="container">
        <h2 className="text-lg font-medium mb-4">Filter by Genre</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onSelectGenre(null)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedGenre === null 
                ? 'bg-primary text-white' 
                : 'bg-secondary hover:bg-secondary/80'
            }`}
          >
            All
          </button>
          
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => onSelectGenre(genre.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedGenre === genre.id 
                  ? 'bg-primary text-white' 
                  : 'bg-secondary hover:bg-secondary/80'
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GenreSelector;