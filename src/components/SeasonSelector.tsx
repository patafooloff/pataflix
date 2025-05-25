import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Season } from '../types/player';

interface SeasonSelectorProps {
  seasons: Season[];
  onSelectSeason: (season: Season) => void;
  onSelectEpisode: (season: Season, episodeNumber: string) => void;
}

const SeasonSelector: React.FC<SeasonSelectorProps> = ({ 
  seasons, 
  onSelectSeason,
  onSelectEpisode
}) => {
  const [selectedSeason, setSelectedSeason] = useState<Season>(seasons[0]);
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSeasonSelect = (season: Season) => {
    setSelectedSeason(season);
    onSelectSeason(season);
    setIsOpen(false);
  };
  
  if (!seasons || seasons.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between bg-secondary p-3 rounded-md"
        >
          <span>{`Season ${selectedSeason.number}: ${selectedSeason.title}`}</span>
          <ChevronDown className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-secondary border border-border rounded-md shadow-lg overflow-auto max-h-60">
            {seasons.map((season) => (
              <button
                key={season.number}
                onClick={() => handleSeasonSelect(season)}
                className={`w-full text-left px-4 py-2 hover:bg-secondary/80 transition-colors ${
                  selectedSeason.number === season.number ? 'bg-secondary/80' : ''
                }`}
              >
                {`Season ${season.number}: ${season.title}`}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <h3 className="font-medium">Episodes</h3>
        <div className="space-y-2">
          {selectedSeason.episodes.map((episode) => (
            <button
              key={episode.number}
              onClick={() => onSelectEpisode(selectedSeason, episode.number)}
              className="w-full text-left p-3 bg-secondary/50 hover:bg-secondary rounded-md transition-colors"
            >
              <div className="flex justify-between">
                <span>{`Episode ${episode.number}`}</span>
                <span className="text-sm text-muted-foreground">
                  {Object.keys(episode.versions).join(' / ')}
                </span>
              </div>
              {episode.versions.vf && (
                <p className="text-sm text-muted-foreground mt-1">{episode.versions.vf.title}</p>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeasonSelector;