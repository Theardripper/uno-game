import { PlayerCard } from "./player-card";
import { EmptySlotCard } from "./empty-slot-card";

export function PlayersGrid({ room, playerId }) {
  if (!room) return null;
  
  const maxPlayers = room.maxPlayers || 4;
  const currentPlayersCount = room.playerDetails?.length || 0;
  const emptySlotsCount = Math.max(0, maxPlayers - currentPlayersCount);

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
        Jogadores
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {room.playerDetails?.map((player) => {
          const isMe = player.id === playerId;
          const isHost = player.id === room.hostId;
          
          return (
            <PlayerCard 
              key={player.id} 
              player={player} 
              isMe={isMe} 
              isHost={isHost} 
            />
          );
        })}

        {Array.from({ length: emptySlotsCount }).map((_, i) => (
          <EmptySlotCard key={`empty-${i}`} />
        ))}
      </div>
    </div>
  );
}
