import { Badge } from "@/components/ui/badge";
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
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <motion.div
            animate={isWarning ? { scale: [1, 1.1, 1], color: ["#fff", "#ef4444", "#fff"] } : {}}
            transition={{ repeat: isWarning ? Infinity : 0, duration: 0.5 }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border ${isWarning ? 'border-red-500 shadow-lg shadow-red-500/20' : 'border-white/10 shadow-md'}`}
        >
            {isWarning ? <AlertCircle className="w-3.5 h-3.5 text-red-500" /> : <Timer className="w-3.5 h-3.5 text-white/60" />}
            <div className="flex flex-col leading-none">
                <span className="text-[7px] font-bold uppercase tracking-widest text-white/50 font-(family-name:--font-rubik)">Round</span>
                <span className={`text-sm font-mono font-bold tracking-widest ${isWarning ? 'text-red-500' : 'text-white'}`}>
                    {minutes}:{seconds.toString().padStart(2, '0')}
                </span>
            </div>
        </motion.div>
    );
}

/**
 * HUD principal do jogo.
 * Exibe o Timer e o botão de UNO.
 */
export const HUD = ({ myPlayerId }) => {
    const { currentTurn, hand } = useGame();
    const { callUno } = useGameActions();
    const isMyTurn = currentTurn === myPlayerId;

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

            {/* Top HUD: Round Timer + Indicador de turno */}
            <div className="w-full flex items-center gap-3">
                <TurnTimer key={currentTurn} />

                {isMyTurn && (
                    <Badge className="bg-auth-accent text-auth-accent-foreground font-(family-name:--font-rubik)">
                        Sua vez!
                    </Badge>
                )}
            </div>

            {/* Bottom HUD: Controles do Jogador (Botão UNO) — sempre visível, só destrava com 1 carta na mão */}
            <div className="w-full flex justify-end items-end pb-10 pr-10 pointer-events-auto">
                <div className="relative">
                    {/* Brilho atrás do botão — mais forte quando dá pra declarar UNO */}
                    <div className={`absolute inset-0 rounded-full blur-2xl scale-125 transition-opacity duration-300 pointer-events-none ${canCallUno ? "bg-auth-accent/70" : "bg-auth-accent/20"}`} />

                    <Button
                        size="lg"
                        disabled={!canCallUno}
                        className="relative w-28 h-28 rounded-full bg-linear-to-br from-auth-btn-grad-from to-auth-btn-grad-to border-4 border-white/20 shadow-xl flex flex-col items-center justify-center gap-2 group transition-all"
                        onClick={handleCallUno}
                    >
                        <span className="text-3xl font-black italic tracking-tighter drop-shadow-md group-hover:scale-110 transition-transform font-(family-name:--font-baloo)">
                            UNO!
                        </span>
                    </Button>
                </div>
            </div>

        </div>
    );
};
