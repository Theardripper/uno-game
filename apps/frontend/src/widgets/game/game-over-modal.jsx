import { Button } from "@/components/ui/button";
import { useGame } from "@/store/game/use-game";
import confetti from "canvas-confetti";
import { AlertCircle, Frown, Trophy } from "lucide-react";
import { useEffect, useRef } from "react";

export const GameOverModal = ({ localPlayerId, onLeave, isLeaving }) => {
    const { status, winnerId, endReason, players, matchResults } = useGame();
    const hasFired = useRef(false);

    useEffect(() => {
        if (status === "finished" && winnerId === localPlayerId && !hasFired.current) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#ef4444', '#3b82f6', '#22c55e', '#eab308'] // Cores do UNO
            });
            hasFired.current = true;
        }
    }, [status, winnerId, localPlayerId]);

    if (status !== "finished") return null;

    const winner = players.find(p => p.id === winnerId);
    const isLocalWinner = winnerId === localPlayerId;
    const isWalkover = endReason === "PLAYER_LEFT";
    const myResult = matchResults?.find(r => r.playerId === localPlayerId);

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm pointer-events-auto overflow-y-auto py-10">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl border-4 border-slate-200 flex flex-col items-center text-center transform transition-all animate-in zoom-in-95 my-auto">

                {/* Icon Header */}
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-inner ${
                    isLocalWinner ? "bg-yellow-100 text-yellow-600" : "bg-slate-100 text-slate-500"
                }`}>
                    {isLocalWinner ? (
                        <Trophy size={40} className="animate-bounce" />
                    ) : (
                        <Frown size={40} />
                    )}
                </div>

                {/* Title */}
                <h1 className="text-3xl font-black text-slate-800 uppercase tracking-wider mb-2">
                    {isLocalWinner ? "Você Venceu!" : (isWalkover ? "Vitória por W.O." : "Fim de Jogo")}
                </h1>

                {/* Winner Info */}
                {winner ? (
                    <div className="flex flex-col items-center mb-6 bg-slate-50 w-full py-4 rounded-2xl border border-slate-100">
                        <div className="w-16 h-16 rounded-full bg-slate-200 mb-2 border-2 border-white shadow-sm overflow-hidden relative">
                            <img
                                src={winner.avatarSeed?.startsWith("http") ? winner.avatarSeed : `https://api.dicebear.com/9.x/avataaars/svg?seed=${winner.avatarSeed || winner.name}`}
                                alt={winner.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h2 className="text-xl font-bold text-slate-700">{winner.name}</h2>
                        <p className="text-sm font-medium text-slate-500">
                            {isLocalWinner ? "venceu a partida!" : (isWalkover ? "venceu por abandono!" : "foi o grande vencedor!")}
                        </p>
                    </div>
                ) : (
                    <div className="mb-6">
                        <p className="text-slate-600">A partida terminou sem vencedores.</p>
                    </div>
                )}

                {/* Local Player Stats */}
                {myResult && (
                    <div className="w-full bg-slate-100 rounded-2xl p-5 mb-6 text-left shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <div className="text-slate-600 font-semibold text-sm uppercase tracking-widest">Seu Resultado</div>
                            {myResult.level > myResult.previousLevel && (
                                <div className="text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full animate-pulse">
                                    ✨ LEVEL UP!
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-center mb-2">
                            <span className="text-slate-600 font-medium">Score</span>
                            <span className="text-lg font-bold text-slate-800">{myResult.score} pts</span>
                        </div>

                        <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200">
                            <span className="text-slate-600 font-medium">Experiência</span>
                            <span className="text-lg font-bold text-green-600">+{myResult.xpEarned} XP</span>
                        </div>

                        {/* Progression Bar */}
                        <div className="w-full">
                            <div className="flex justify-between items-end mb-1">
                                <span className="font-bold text-slate-700">Nível {myResult.level}</span>
                            </div>

                            {/* Bar Math */}
                            {(() => {
                                const levelStartTotalXp = 100 * Math.pow(myResult.level - 1, 2);
                                const nextLevelTotalXp = 100 * Math.pow(myResult.level, 2);
                                const currentLevelXp = myResult.totalXp - levelStartTotalXp;
                                const levelSize = nextLevelTotalXp - levelStartTotalXp;
                                const percentage = Math.min(100, Math.max(0, (currentLevelXp / levelSize) * 100));

                                return (
                                    <>
                                        <div className="w-full bg-slate-300 h-3 rounded-full overflow-hidden mb-1">
                                            <div
                                                className="bg-blue-500 h-full rounded-full transition-all duration-1000 ease-out"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-xs text-slate-500 font-medium">
                                            <span>{currentLevelXp} / {levelSize} XP</span>
                                            <span>Faltam {nextLevelTotalXp - myResult.totalXp} XP</span>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                )}

                {/* Reason (if no results or just to show the explicit reason) */}
                {!myResult && (
                    <div className="flex items-center justify-center gap-2 mb-8 text-sm font-medium px-4 py-2 bg-blue-50 text-blue-700 rounded-full w-full">
                        <AlertCircle size={16} />
                        <span className="truncate max-w-full">
                            {isWalkover
                                ? "Abandono (W.O.)"
                                : "O vencedor ficou sem cartas"}
                        </span>
                    </div>
                )}

                {/* Actions */}
                <Button
                    className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold h-12 text-lg rounded-xl shadow-md transition-transform active:scale-95"
                    onClick={onLeave}
                    disabled={isLeaving}
                >
                    {isLeaving ? "Saindo..." : "Voltar ao Lobby"}
                </Button>
            </div>
        </div>
    );
};
