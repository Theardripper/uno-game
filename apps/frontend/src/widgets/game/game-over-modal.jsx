import { useEffect, useState } from "react";
import { useGame } from "@/store/game/use-game";
import { Button } from "@/components/ui/button";
import { Trophy, Frown, AlertCircle } from "lucide-react";
import confetti from "canvas-confetti";


export const GameOverModal = ({ localPlayerId, onLeave, isLeaving }) => {
    const { status, winnerId, endReason, players } = useGame();
    const [hasFired, setHasFired] = useState(false);

    useEffect(() => {
        if (status === "finished" && winnerId === localPlayerId && !hasFired) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#ef4444', '#3b82f6', '#22c55e', '#eab308'] // Cores do UNO
            });
            setHasFired(true);
        }
    }, [status, winnerId, localPlayerId, hasFired]);

    if (status !== "finished") return null;

    const winner = players.find(p => p.id === winnerId);
    const isLocalWinner = winnerId === localPlayerId;
    const isWalkover = endReason === "PLAYER_LEFT";

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm pointer-events-auto">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl border-4 border-slate-200 flex flex-col items-center text-center transform transition-all animate-in zoom-in-95">
                
                {/* Icon Header */}
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-inner ${
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
                    {isLocalWinner ? "Você Venceu!" : "Fim de Jogo"}
                </h1>

                {/* Winner Info */}
                {winner ? (
                    <div className="flex flex-col items-center mb-6 bg-slate-50 w-full py-4 rounded-2xl border border-slate-100">
                        <div className="w-16 h-16 rounded-full bg-slate-200 mb-3 border-2 border-white shadow-sm overflow-hidden relative">
                            <img 
                                src={winner.avatarSeed?.startsWith("http") ? winner.avatarSeed : `https://api.dicebear.com/9.x/avataaars/svg?seed=${winner.avatarSeed || winner.name}`}
                                alt={winner.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h2 className="text-xl font-bold text-slate-700">{winner.name}</h2>
                        <p className="text-sm font-medium text-slate-500">
                            {isLocalWinner ? "venceu a partida!" : "foi o grande vencedor!"}
                        </p>
                    </div>
                ) : (
                    <div className="mb-6">
                        <p className="text-slate-600">A partida terminou sem vencedores.</p>
                    </div>
                )}

                {/* Reason */}
                <div className="flex items-center justify-center gap-2 mb-8 text-sm font-medium px-4 py-2 bg-blue-50 text-blue-700 rounded-full">
                    <AlertCircle size={16} />
                    <span>
                        {isWalkover 
                            ? "Vitória por abandono dos adversários (W.O.)" 
                            : "O vencedor ficou sem cartas"}
                    </span>
                </div>

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
