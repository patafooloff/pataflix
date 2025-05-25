import React, { useState } from 'react';

interface PlayerLink {
  player: string;
  link: string;
  is_hd?: boolean;
}

interface PlayerEmbedProps {
  playerLinks: PlayerLink[];
}

const PlayerEmbed: React.FC<PlayerEmbedProps> = ({ playerLinks }) => {
  const [activePlayer, setActivePlayer] = useState<string | null>(
    playerLinks.length > 0 ? playerLinks[0].player : null
  );

  if (!playerLinks || playerLinks.length === 0) {
    return (
      <div className="bg-secondary/50 rounded-lg p-8 text-center">
        <p className="text-lg">No player links available for this content.</p>
      </div>
    );
  }

  const activeLink = playerLinks.find(link => link.player === activePlayer)?.link;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-4">
        {playerLinks.map((link) => (
          <button
            key={link.player}
            onClick={() => setActivePlayer(link.player)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activePlayer === link.player 
                ? 'bg-primary text-white' 
                : 'bg-secondary hover:bg-secondary/80 text-foreground'
            }`}
          >
            {link.player.charAt(0).toUpperCase() + link.player.slice(1)}
            {link.is_hd && <span className="ml-1 text-xs bg-green-500 text-white px-1 rounded">HD</span>}
          </button>
        ))}
      </div>

      <div className="aspect-video w-full overflow-hidden bg-black rounded-lg">
        {activeLink ? (
          <iframe
            src={activeLink}
            className="w-full h-full"
            allowFullScreen
            allow="autoplay; encrypted-media"
            title="Video Player"
          ></iframe>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Player not available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerEmbed;