import { Button } from "@/components/ui/button";
import { useGame } from "@/store/game/use-game";
import confetti from "canvas-confetti";
import { Medal, Trophy, RotateCcw, BarChart2, ListOrdered, Star } from "lucide-react";
import { useEffect, useRef, useMemo } from "react";
import { cn } from "@/helpers/cn";

export const GameOverModal = ({ localPlayerId, onLeave, isLeaving }) => {
    const { status, winnerId, endReason, players, matchResults, matchDetails } = useGame();
    const hasFired = useRef(false);

    useEffect(() => {
        if (status === "finished" && winnerId === localPlayerId && !hasFired.current) {
            confetti({
                particleCount: 200,
                spread: 100,
                origin: { y: 0.5 },
                colors: ['#ef4444', '#3b82f6', '#22c55e', '#eab308']
            });
            hasFired.current = true;
        }
    }, [status, winnerId, localPlayerId]);

    // Sorting ranking: Winner is 1st, then sort remaining by score ascending (lowest score is better in UNO)
    const ranking = useMemo(() => {
        if (!matchResults) return [];
        const sorted = [...matchResults].sort((a, b) => {
            if (a.playerId === winnerId) return -1;
            if (b.playerId === winnerId) return 1;
            return a.score - b.score;
        });
        return sorted;
    }, [matchResults, winnerId]);

    if (status !== "finished") return null;

    const isLocalWinner = winnerId === localPlayerId;
    const winner = players.find(p => p.id === winnerId) || players[0];
    const myResult = matchResults?.find(r => r.playerId === localPlayerId);

    const titleColor = isLocalWinner ? "text-[#FF5545] drop-shadow-[0_0_40px_rgba(255,85,69,0.8)]" : "text-[#80D2FF] drop-shadow-[0_0_40px_rgba(128,210,255,0.8)]";
    const boxGlow = isLocalWinner ? "shadow-[0_0_60px_rgba(255,85,69,0.15)]" : "shadow-[0_0_60px_rgba(128,210,255,0.15)]";
    const badgeBg = isLocalWinner ? "bg-[#34C759]" : "bg-[#80D2FF]";

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md pointer-events-auto overflow-y-auto font-sans">
            <div className="flex flex-col items-center w-full max-w-5xl px-4 py-10 animate-in zoom-in-95 duration-500">
                
                {/* Title */}
                <h1 className={cn("text-6xl md:text-[80px] font-black uppercase tracking-tighter mb-12 font-(family-name:--font-baloo)", titleColor)}>
                    {isLocalWinner ? "VITÓRIA!" : "BOM JOGO!"}
                </h1>

                {/* Winner Card */}
                {winner && (
                    <div className={cn("relative flex flex-col items-center p-8 bg-[#1a100e] rounded-2xl border border-white/5 mb-16 min-w-[300px]", boxGlow)}>
                        <div className={cn("absolute -top-4 flex items-center gap-1.5 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-[#1a100e] shadow-lg", badgeBg)}>
                            <Trophy size={14} />
                            Campeão da Partida
                        </div>
                        
                        <div className={cn("w-28 h-28 rounded-full border-[3px] shadow-2xl mb-5 overflow-hidden relative bg-[#2A1B19]", isLocalWinner ? "border-[#FF453A]" : "border-[#80D2FF]")}>
                            <img
                                src={winner.avatarSeed?.startsWith("http") ? winner.avatarSeed : `https://api.dicebear.com/9.x/avataaars/svg?seed=${winner.avatarSeed || winner.name}`}
                                alt={winner.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-1.5">{winner.name}</h2>
                        <p className="text-[10px] text-white/40 font-mono tracking-widest uppercase">Prism Legend</p>
                    </div>
                )}

                {/* Grid 3 Columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-14">
                    
                    {/* Column 1: Detalhes da Partida */}
                    <div className="flex flex-col p-6 bg-[#1a100e] rounded-2xl border border-white/5 shadow-xl">
                        <div className="flex items-center gap-2 mb-6 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                            <BarChart2 size={14} />
                            Detalhes da Partida
                        </div>
                        
                        <div className="flex justify-between items-center py-3.5 border-b border-white/5">
                            <span className="text-white/60 text-sm font-medium">Duração</span>
                            <span className="text-white font-bold">{matchDetails?.duration || "0:00"}</span>
                        </div>
                        <div className="flex justify-between items-center py-3.5 border-b border-white/5">
                            <span className="text-white/60 text-sm font-medium">Cards Jogadas</span>
                            <span className="text-white font-bold">{matchDetails?.cardsPlayed || 0}</span>
                        </div>
                        <div className="flex justify-between items-center py-3.5">
                            <span className="text-white/60 text-sm font-medium">UNO!!!</span>
                            <span className="text-[#34C759] font-bold">{matchDetails?.unosSaid || 0}</span>
                        </div>
                    </div>

                    {/* Column 2: Ranking Final */}
                    <div className="flex flex-col p-6 bg-[#1a100e] rounded-2xl border border-white/5 shadow-xl relative">
                        <div className="flex items-center gap-2 mb-5 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                            <ListOrdered size={14} />
                            Ranking Final
                        </div>

                        <div className="flex flex-col gap-2">
                            {ranking.map((r, i) => (
                                <div key={r.playerId} className={cn("flex items-center gap-3 p-2.5 rounded-xl transition-colors", r.playerId === localPlayerId ? "bg-[#351b1a] border border-[#FF5545]/20" : "")}>
                                    <span className="text-white/40 font-black text-sm w-4 text-center">{i + 1}</span>
                                    <div className="w-8 h-8 rounded-full bg-black/40 overflow-hidden shadow-inner">
                                        <img src={r.avatarSeed?.startsWith("http") ? r.avatarSeed : `https://api.dicebear.com/9.x/avataaars/svg?seed=${r.avatarSeed || r.name}`} alt={r.name} className="w-full h-full object-cover" />
                                    </div>
                                    <span className={cn("font-semibold text-sm flex-1", r.playerId === localPlayerId ? "text-white" : "text-white/60")}>
                                        {r.playerId === localPlayerId ? "Você" : r.name}
                                    </span>
                                    {i === 0 && <Medal size={16} className="text-white/30" />}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Column 3: Recompensas */}
                    {myResult && (
                        <div className="flex flex-col p-6 bg-[#1a100e] rounded-2xl border border-white/5 shadow-xl relative">
                            <div className="flex items-center gap-2 mb-6 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                                <Star size={14} />
                                Recompensas
                            </div>

                            <div className="flex flex-col mt-auto pb-2">
                                <div className="flex justify-between items-end mb-3">
                                    <span className="text-white/70 font-medium text-sm">XP Ganho</span>
                                    <span className="text-3xl font-black text-[#5AC8FA]">+{myResult.xpEarned}</span>
                                </div>

                                {(() => {
                                    const levelStartTotalXp = 100 * Math.pow(myResult.level - 1, 2);
                                    const nextLevelTotalXp = 100 * Math.pow(myResult.level, 2);
                                    const currentLevelXp = myResult.totalXp - levelStartTotalXp;
                                    const levelSize = nextLevelTotalXp - levelStartTotalXp;
                                    const percentage = Math.min(100, Math.max(0, (currentLevelXp / levelSize) * 100));

                                    return (
                                        <div className="w-full mt-2">
                                            <div className="w-full bg-black/50 h-2.5 rounded-full overflow-hidden mb-2 relative border border-white/5">
                                                <div
                                                    className="bg-[#5AC8FA] h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(90,200,250,0.8)]"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between text-[9px] font-bold text-white/30 uppercase tracking-widest">
                                                <span>Level {myResult.level}</span>
                                                <span>Level {myResult.level + 1}</span>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="flex items-center gap-4 mt-2">
                    <Button
                        variant="ghost"
                        className="h-12 px-8 rounded-full border border-white/10 bg-[#1a100e] hover:bg-[#2A1B19] text-white/60 hover:text-white font-bold tracking-widest text-[11px] uppercase transition-all"
                        onClick={onLeave}
                        disabled={isLeaving}
                    >
                        Voltar
                    </Button>
                    <Button
                        className="h-12 px-8 rounded-full bg-[#FF8B71] hover:bg-[#FF7355] text-[#1a100e] font-black tracking-widest text-[11px] uppercase shadow-[0_0_25px_rgba(255,139,113,0.3)] gap-2 transition-all hover:scale-105 active:scale-95"
                    >
                        <RotateCcw size={15} />
                        Jogar Novamente
                    </Button>
                </div>

            </div>
        </div>
    );
};
