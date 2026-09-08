import { recentGames } from "@/shared/mocks/home.mock";
import { PlusSquare } from "lucide-react";

export function RecentGames() {
  return (
    <div className="flex flex-col h-full min-h-0">
      <h3 className="text-gray-400 text-xs font-bold uppercase tracking-[0.15em] mb-4 flex-shrink-0">
        Partidas Recentes
      </h3>
      
      <div className="space-y-3 overflow-hidden flex-1 min-h-0">
        {recentGames.map((game) => (
          <div 
            key={game.id} 
            className="flex items-center justify-between bg-[#2A1B19]/50 hover:bg-[#2A1B19] p-4 rounded-2xl border border-white/5 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <PlusSquare className="w-5 h-5 text-[#FFB4AA]" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">{game.playerName}</h4>
                <p className="text-xs text-gray-500 uppercase font-semibold mt-0.5">
                  {game.status} | {game.timeAgo}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-[#5EEAD4] font-bold text-sm">{game.xp} XP</p>
              <p className="text-xs text-gray-500 font-medium">Rank {game.rank}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
