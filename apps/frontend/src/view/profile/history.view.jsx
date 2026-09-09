"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useProfileHistoryQuery } from "@/features/profile/model/use-profile";
import { ArrowLeft, Clock, PlusSquare, Search } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";

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

export function HistoryView() {
    const router = useRouter();
    const { data: historyData, isLoading } = useProfileHistoryQuery();
    
    const history = historyData?.data?.history || [];

    return (
        <div className="h-full flex flex-col p-6 overflow-y-auto w-full hide-scrollbar">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => router.back()}
                        className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight uppercase">Histórico de Partidas</h1>
                        <p className="text-sm font-medium text-gray-400 mt-1">
                            Veja o registro de todas as suas batalhas.
                        </p>
                    </div>
                </div>
            </div>

            <FadeIn>
                <div className="flex flex-col gap-4">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-8 h-8 border-4 border-t-white/80 border-white/20 rounded-full animate-spin"></div>
                        </div>
                    ) : history.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {history.map((match) => (
                                <div key={match.id} className="bg-[#1C1210] rounded-2xl p-5 border border-white/5 flex flex-col justify-between hover:bg-[#231715] transition-colors group">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center`}>
                                                <PlusSquare className={`w-5 h-5 ${match.result === 'Victory' ? 'text-teal-400' : 'text-[#FF8B8B]'}`} />
                                            </div>
                                            <div>
                                                <p className={`text-lg font-bold ${match.result === 'Victory' ? 'text-teal-400' : 'text-[#FF8B8B]'}`}>
                                                    {match.result}
                                                </p>
                                                <p className="text-xs font-mono text-white/40">{getTimeAgo(match.timeAgo)}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[#5EEAD4] font-bold text-base">+{match.xpEarned || 0} XP</p>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Ganhos</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-white/30" />
                                            <span className="text-sm font-medium text-white/60">{match.duration}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded bg-white/10 flex items-center justify-center">
                                                <span className="text-[9px] font-bold text-white/50">P</span>
                                            </div>
                                            <span className="text-sm font-medium text-white/60">{match.players} Players</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-[#1C1210] rounded-3xl border border-white/5">
                            <Search className="w-12 h-12 text-white/20 mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">Sem histórico</h3>
                            <p className="text-white/40 text-sm max-w-sm text-center">
                                Você ainda não jogou nenhuma partida. Volte ao lobby e jogue para registrar seu histórico.
                            </p>
                        </div>
                    )}
                </div>
            </FadeIn>
        </div>
    );
}
