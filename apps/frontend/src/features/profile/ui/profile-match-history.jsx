import React from "react";
import { Clock } from "lucide-react";
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

function HistoryItem({ match }) {
    const isVictory = match.result === "Victory";
    return (
        <div className="bg-[#1C1210] rounded-2xl p-4 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className={`w-1 h-10 rounded-full ${isVictory ? 'bg-teal-400' : 'bg-[#FF8B8B]'}`}></div>
                <div>
                    <p className={`text-lg font-bold ${isVictory ? 'text-teal-400' : 'text-[#FF8B8B]'}`}>
                        {match.result}
                    </p>
                    <p className="text-xs font-mono text-white/40 flex items-center gap-1.5 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {match.duration} • vs {match.players} Players
                    </p>
                </div>
            </div>
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">{getTimeAgo(match.timeAgo)}</p>
        </div>
    );
}

export function ProfileMatchHistory({ history }) {
    const router = useRouter();
    // Use the actual history or empty array
    const displayHistory = history?.length > 0 ? history.slice(0, 4) : [];

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Histórico</h2>
                <button 
                    onClick={() => router.push("/profile/history")}
                    className="text-[10px] font-mono text-white/40 hover:text-white uppercase tracking-widest transition-colors"
                >
                    Ver todas
                </button>
            </div>
            <div className="flex flex-col gap-3">
                {displayHistory.length > 0 ? displayHistory.map((match) => (
                    <HistoryItem key={match.id} match={match} />
                )) : (
                    <div className="bg-[#1C1210] rounded-2xl p-6 border border-white/5 flex items-center justify-center">
                        <p className="text-white/40 text-sm">Nenhuma partida encontrada.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
