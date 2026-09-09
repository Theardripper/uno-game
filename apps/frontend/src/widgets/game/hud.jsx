import { Button } from "@/components/ui/button";
import { GAME_CONSTANTS } from "@/constants/game.constants";
import { useGameActions } from "@/features/game/hooks/use-game-actions";
import { useGame } from "@/store/game/use-game";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Timer } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/helpers/cn";

/**
 * Contagem regressiva do turno atual.
 */
function TurnTimer({ isMyTurn, drawCard }) {
    const [timeLeft, setTimeLeft] = useState(GAME_CONSTANTS.TURN_DURATION_SECONDS);
    const [hasFired, setHasFired] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (timeLeft === 0 && isMyTurn && !hasFired) {
            setHasFired(true);
            drawCard();
        }
    }, [timeLeft, isMyTurn, hasFired, drawCard]);

    const isWarning = timeLeft <= GAME_CONSTANTS.TURN_WARNING_SECONDS;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <motion.div
            animate={isWarning ? { scale: [1, 1.05, 1] } : {}}
            transition={{ repeat: isWarning ? Infinity : 0, duration: 0.5 }}
            className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-full backdrop-blur-md shadow-lg transition-colors border",
                isWarning 
                    ? "bg-[#2A1B19]/90 border-red-500/50" 
                    : "bg-[#2A1B19]/80 border-white/5"
            )}
        >
            <div className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full bg-white/5",
                isWarning ? "text-red-500" : "text-white/60"
            )}>
                {isWarning ? <AlertCircle className="w-4 h-4" /> : <Timer className="w-4 h-4" />}
            </div>
            <div className="flex flex-col leading-none pr-2">
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/50 mb-0.5">Round</span>
                <span className={cn(
                    "text-base font-black tracking-widest font-(family-name:--font-rubik)",
                    isWarning ? 'text-red-500' : 'text-white'
                )}>
                    {minutes}:{seconds.toString().padStart(2, '0')}
                </span>
            </div>
        </motion.div>
    );
}

/**
 * HUD principal do jogo.
 */
export const HUD = ({ myPlayerId }) => {
    const { currentTurn, hand } = useGame();
    const { callUno, drawCard } = useGameActions();
    const isMyTurn = currentTurn === myPlayerId;

    const canCallUno = hand?.length === 1;

    const handleCallUno = () => {
        if (!canCallUno) return;
        callUno();
    };

    return (
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8">

            {/* Top HUD: Round Timer + SUA VEZ! */}
            <div className="w-full flex items-center gap-4">
                <TurnTimer key={currentTurn} isMyTurn={isMyTurn} drawCard={drawCard} />

                <AnimatePresence>
                    {isMyTurn && (
                        <motion.div
                            initial={{ opacity: 0, x: -20, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-[#FF453A]/40 blur-xl rounded-full" />
                            <div className="relative bg-gradient-to-r from-[#FF5545] to-[#C0000A] text-white px-6 py-3 rounded-full font-black text-sm uppercase tracking-widest shadow-lg border border-[#FF453A]/50">
                                Sua vez!
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom HUD: Botão UNO */}
            <div className="w-full flex justify-end items-end pointer-events-auto">
                <div className="relative">
                    {/* Brilho atrás do botão */}
                    <div className={cn(
                        "absolute inset-0 rounded-full blur-3xl scale-150 transition-all duration-500 pointer-events-none",
                        canCallUno ? "bg-[#FF453A]/60" : "bg-black/20"
                    )} />

                    <button
                        disabled={!canCallUno}
                        className={cn(
                            "relative w-36 h-36 rounded-full flex flex-col items-center justify-center transition-all shadow-2xl",
                            canCallUno 
                                ? "bg-[#C0000A] hover:bg-[#A00008] border-8 border-[#FF453A]/20 cursor-pointer scale-100 hover:scale-105 active:scale-95" 
                                : "bg-[#8B0000] border-8 border-white/5 opacity-80 cursor-not-allowed scale-95"
                        )}
                        onClick={handleCallUno}
                    >
                        {/* Brilho interno sutil */}
                        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-full pointer-events-none" />
                        
                        <span className="text-4xl font-black italic tracking-tighter drop-shadow-md text-white font-(family-name:--font-baloo) transform -rotate-12">
                            UNO
                        </span>
                    </button>
                </div>
            </div>

        </div>
    );
};
