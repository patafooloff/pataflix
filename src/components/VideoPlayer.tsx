
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
      <Card className="p-6 bg-gray-800 border-gray-700">
        <p className="text-center text-gray-400">
          Aucun lecteur disponible pour ce contenu.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Lecteurs disponibles</h3>
        <span className="px-3 py-1 bg-red-600 text-white text-sm rounded-full">
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
                ? "bg-red-600 hover:bg-red-700 border-red-600" 
                : "border-gray-600 text-gray-300 hover:text-white hover:border-gray-500"
            }`}
            onClick={() => setSelectedPlayer(player)}
          >
            <Play className="w-5 h-5" />
            <span className="text-sm font-medium capitalize">{player.player}</span>
            {player.is_hd && (
              <span className="text-xs bg-green-600 px-2 py-1 rounded">HD</span>
            )}
          </Button>
        ))}
      </div>

      {/* Lecteur intégré */}
      {selectedPlayer && (
        <Card className="bg-gray-800 border-gray-700 overflow-hidden">
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
            <span className="text-gray-300">
              Lecteur: <span className="text-white font-medium capitalize">{selectedPlayer.player}</span>
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(selectedPlayer.link, '_blank')}
              className="text-gray-300 hover:text-white"
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
