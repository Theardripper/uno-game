"use client"

import { useProfileHistoryQuery, useUserQuery } from "@/features/profile/model/use-profile";
import { PlusSquare } from "lucide-react";
import { useRouter } from "next/navigation";

// Helper to format ISO date to time ago
function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Agora mesmo";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min atrás`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} horas atrás`;
    if (diffInSeconds < 172800) return "Ontem";
    return `${Math.floor(diffInSeconds / 86400)} dias atrás`;
}

export function RecentGames() {
  const router = useRouter();
  const { data: historyData, isLoading } = useProfileHistoryQuery();
  const { data: userData } = useUserQuery();

  const history = historyData?.data?.history || [];
  const displayHistory = history.slice(0, 3);
  const playerName = userData?.data?.player?.name || "Player";

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-[0.15em]">
          Partidas Recentes
        </h3>
        <button
          onClick={() => router.push("/profile/history")}
          className="text-[10px] font-mono text-white/40 hover:text-white uppercase tracking-widest transition-colors"
        >
          Ver todas
        </button>
      </div>

      <div className="space-y-3 overflow-hidden flex-1 min-h-0">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
             <div className="w-6 h-6 border-2 border-t-white/80 border-white/20 rounded-full animate-spin"></div>
          </div>
        ) : displayHistory.length > 0 ? displayHistory.map((game) => (
          <div
            key={game.id}
            className="flex items-center justify-between bg-[#2A1B19]/50 hover:bg-[#2A1B19] p-4 rounded-2xl border border-white/5 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <PlusSquare className={`w-5 h-5 ${game.result === "Victory" ? "text-teal-400" : "text-[#FFB4AA]"}`} />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">{playerName}</h4>
                <p className="text-xs text-gray-500 uppercase font-semibold mt-0.5">
                  {game.result} | {getTimeAgo(game.timeAgo)}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-[#5EEAD4] font-bold text-sm">+{game.xpEarned || 0} XP</p>
              <p className="text-xs text-gray-500 font-medium">{game.duration}</p>
            </div>
          </div>
        )) : (
          <div className="flex items-center justify-center py-8 bg-[#2A1B19]/30 rounded-2xl border border-white/5">
             <p className="text-white/40 text-sm">Nenhuma partida recente.</p>
          </div>
        )}
      </div>
    </div>
  );
}
