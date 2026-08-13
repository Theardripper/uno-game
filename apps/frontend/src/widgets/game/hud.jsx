import { Button } from "@/components/ui/button";
import { GAME_CONSTANTS } from "@/constants/game.constants";
import { useGame } from "@/store/game/use-game";
import { motion } from "framer-motion";
import { AlertCircle, Timer } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * HUD principal do jogo.
 * Exibe o Timer e o botão de UNO.
 */
export const HUD = () => {
    const { currentTurn } = useGame();
    const [timeLeft, setTimeLeft] = useState(GAME_CONSTANTS.TURN_DURATION_SECONDS);

    // Inicia e limpa o intervalo do timer, resetando sempre que o turno mudar
    useEffect(() => {
        setTimeLeft(GAME_CONSTANTS.TURN_DURATION_SECONDS);
        const interval = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(interval);
    }, [currentTurn]);

    const isWarning = timeLeft <= GAME_CONSTANTS.TURN_WARNING_SECONDS;

    return (
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">

            {/* Top HUD: Timer */}
            <div className="w-full flex justify-center">
                <motion.div
                    animate={isWarning ? { scale: [1, 1.1, 1], color: ["#fff", "#ef4444", "#fff"] } : {}}
                    transition={{ repeat: isWarning ? Infinity : 0, duration: 0.5 }}
                    className={`flex items-center gap-3 px-6 py-3 rounded-full bg-black/60 backdrop-blur-md border ${isWarning ? 'border-red-500 shadow-lg shadow-red-500/20' : 'border-white/10 shadow-xl'}`}
                >
                    {isWarning ? <AlertCircle className="w-6 h-6 text-red-500" /> : <Timer className="w-6 h-6 text-white/70" />}
                    <span className={`text-2xl font-mono font-bold tracking-widest ${isWarning ? 'text-red-500' : 'text-white'}`}>
                        00:{timeLeft.toString().padStart(2, '0')}
                    </span>
                </motion.div>
            </div>

            {/* Bottom HUD: Controles do Jogador (Botão UNO) */}
            <div className="w-full flex justify-end items-end pb-12 pr-12 pointer-events-auto">
                <Button
                    size="lg"
                    className="w-32 h-32 rounded-full bg-linear-to-br from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 border-4 border-white/20 shadow-2xl shadow-red-500/50 flex flex-col items-center justify-center gap-2 group transition-all"
                    onClick={() => console.log("UNO button clicked")}
                >
                    <span className="text-4xl font-black italic tracking-tighter drop-shadow-md group-hover:scale-110 transition-transform">
                        UNO!
                    </span>
                </Button>
            </div>

        </div>
    );
};
