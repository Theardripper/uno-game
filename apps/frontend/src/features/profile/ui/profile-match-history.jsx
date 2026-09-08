import React from "react";
import { Clock } from "lucide-react";

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
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">{match.timeAgo}</p>
        </div>
    );
}

export function ProfileMatchHistory({ history }) {
    // Empty state se não tiver histórico
    const displayHistory = history?.length > 0 ? history : [
        { id: 1, result: "Victory", duration: "6:12", players: 3, timeAgo: "2 horas atrás" },
        { id: 2, result: "Defeat", duration: "8:45", players: 4, timeAgo: "5 horas atrás" },
        { id: 3, result: "Victory", duration: "5:30", players: 2, timeAgo: "Ontem" },
        { id: 4, result: "Victory", duration: "5:30", players: 2, timeAgo: "Ontem" },
    ];

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Histórico</h2>
                <button className="text-[10px] font-mono text-white/40 hover:text-white uppercase tracking-widest transition-colors">
                    Ver todas
                </button>
            </div>
            <div className="flex flex-col gap-3">
                {displayHistory.map((match) => (
                    <HistoryItem key={match.id} match={match} />
                ))}
            </div>
        </div>
    );
}
