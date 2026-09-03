import { Button } from "@/components/ui/button";
import { GAME_CONSTANTS } from "@/constants/game.constants";
import { useGameActions } from "@/features/game/hooks/use-game-actions";
import { useGame } from "@/store/game/use-game";
import { motion } from "framer-motion";
import { AlertCircle, Timer } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Contagem regressiva do turno atual.
 *
 * Recebe `key={currentTurn}` de quem a renderiza: isso força o React a
 * remontar o componente a cada turno novo, dando um `timeLeft` fresco de
 * cara (via useState) sem precisar resetar o estado de dentro de um efeito
 * (o que o React recomenda evitar, resetar via `key` no lugar de um
 * `setState` síncrono no corpo do efeito).
 */
function TurnTimer() {
    const [timeLeft, setTimeLeft] = useState(GAME_CONSTANTS.TURN_DURATION_SECONDS);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const isWarning = timeLeft <= GAME_CONSTANTS.TURN_WARNING_SECONDS;

    return (  <motion.div
            animate={isWarning ? { scale: [1, 1.1, 1], color: ["#fff", "#ef4444", "#fff"] } : {}}
            transition={{ repeat: isWarning ? Infinity : 0, duration: 0.5 }}
            className={`flex items-center gap-3 px-6 py-3 rounded-full bg-black/60 backdrop-blur-md border ${isWarning ? 'border-red-500 shadow-lg shadow-red-500/20' : 'border-white/10 shadow-xl'}`}
        >
            {isWarning ? <AlertCircle className="w-6 h-6 text-red-500" /> : <Timer className="w-6 h-6 text-white/70" />}
            <span className={`text-2xl font-mono font-bold tracking-widest ${isWarning ? 'text-red-500' : 'text-white'}`}>
                00:{timeLeft.toString().padStart(2, '0')}
            </span>
        </motion.div>
    );
}

/**
 * HUD principal do jogo.
 * Exibe o Timer e o botão de UNO.
 */
export const HUD = () => {
    const { currentTurn, hand } = useGame();
    const { callUno } = useGameActions();

    // Regra do UNO: só pode declarar com exatamente 1 carta na mão (validado pelo backend).
    const canCallUno = hand?.length === 1;

    // O aviso de "UNO!" pra mesa toda vem do servidor (SERVER_GAME_STATE -> saidUno),
    // tratado em game.handler.js/UnoAnnouncement — aqui só emitimos a ação.
    const handleCallUno = () => {
        if (!canCallUno) return;
        callUno();
    };

    return (
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">

            {/* Top HUD: Timer */}
            <div className="w-full flex justify-center">
                <TurnTimer key={currentTurn} />
            </div>

            {/* Bottom HUD: Controles do Jogador (Botão UNO) — sempre visível, só destrava com 1 carta na mão */}
            <div className="w-full flex justify-end items-end pb-12 pr-12 pointer-events-auto">
                <Button
                    size="lg"
                    disabled={!canCallUno}
                    className="w-32 h-32 rounded-full bg-linear-to-br from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 border-4 border-white/20 shadow-2xl shadow-red-500/50 flex flex-col items-center justify-center gap-2 group transition-all"
                    onClick={handleCallUno}
                >
                    <span className="text-4xl font-black italic tracking-tighter drop-shadow-md group-hover:scale-110 transition-transform">
                        UNO!
                    </span>
                </Button>
            </div>

        </div>
    );
};
