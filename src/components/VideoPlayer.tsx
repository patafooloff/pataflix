import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PlayerLink } from '@/types';
import { Play, ExternalLink } from 'lucide-react';

interface VideoPlayerProps {
  playerLinks: PlayerLink[];
  version: string;
}

const VideoPlayer = ({ playerLinks, version }: VideoPlayerProps) => {
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerLink | null>(null);

  if (playerLinks.length === 0) {
    return (
      <Card className="p-6 bg-netflix-light border-netflix-gray animate-fade-in">
        <p className="text-center text-netflix-text-secondary">
          Aucun lecteur disponible pour ce contenu.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-netflix-text-primary">Lecteurs disponibles</h3>
        <span className="px-3 py-1 bg-netflix-red text-netflix-text-primary text-sm rounded-full">
          {version}
        </span>
      </div>

      {/* Sélection du lecteur */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {playerLinks.map((player, index) => (
          <Button
            key={index}
            variant={selectedPlayer === player ? "default" : "outline"}
            className={`h-auto p-4 flex flex-col items-center space-y-2 ${
              selectedPlayer === player 
                ? "bg-netflix-red hover:bg-netflix-red/90 border-netflix-red" 
                : "border-netflix-gray text-netflix-text-secondary hover:text-netflix-text-primary hover:border-netflix-text-secondary"
            }`}
            onClick={() => setSelectedPlayer(player)}
          >
            <Play className="w-5 h-5" />
            <span className="text-sm font-medium capitalize">{player.player}</span>
            {player.is_hd && (
              <span className="text-xs bg-success px-2 py-1 rounded">HD</span>
            )}
          </Button>
        ))}
      </div>

      {/* Lecteur intégré */}
      {selectedPlayer && (
        <Card className="bg-netflix-light border-netflix-gray overflow-hidden">
          <div className="aspect-video">
            <iframe
              src={selectedPlayer.link}
              className="w-full h-full"
              allowFullScreen
              frameBorder="0"
              title={`Lecteur ${selectedPlayer.player}`}
            />
          </div>
          <div className="p-4 flex items-center justify-between">
            <span className="text-netflix-text-secondary">
              Lecteur: <span className="text-netflix-text-primary font-medium capitalize">{selectedPlayer.player}</span>
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(selectedPlayer.link, '_blank')}
              className="text-netflix-text-secondary hover:text-netflix-text-primary"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Ouvrir dans un nouvel onglet
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default VideoPlayer;
