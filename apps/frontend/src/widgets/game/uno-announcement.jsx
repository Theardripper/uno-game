import { useGame } from "@/store/game/use-game";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

const DISPLAY_DURATION_MS = 2200;

/**
 * Banner animado que avisa TODA a mesa quando um jogador diz "UNO!" de verdade
 * (confirmado pelo servidor via `saidUno` no SERVER_GAME_STATE), para substituir o toast
 * antigo, que só aparecia pra quem clicou e não avisava os outros jogadores.
 */
export const UnoAnnouncement = () => {
    const { unoAnnouncement, actions } = useGame();

    useEffect(() => {
        if (!unoAnnouncement) return;
        const timer = setTimeout(() => actions.clearUnoAnnouncement(), DISPLAY_DURATION_MS);
        return () => clearTimeout(timer);
    }, [unoAnnouncement, actions]);

    return (
        <div className="absolute inset-0 z-50 flex items-start justify-center pt-24 pointer-events-none">
            <AnimatePresence>
                {unoAnnouncement && (
                    <motion.div
                        key={unoAnnouncement.id}
                        initial={{ opacity: 0, scale: 0.5, y: -40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.7, y: -20 }}
                        transition={{ type: "spring", stiffness: 260, damping: 18 }}
                        className="flex flex-col items-center gap-1 px-10 py-5 rounded-3xl bg-linear-to-br from-auth-btn-grad-from to-auth-btn-grad-to shadow-2xl shadow-auth-accent/50 border-4 border-white/20"
                    >
                        <span className="text-5xl font-black italic tracking-tighter text-white drop-shadow-md">
                            UNO!
                        </span>
                        <span className="text-sm font-bold uppercase tracking-widest text-white/90">
                            {unoAnnouncement.playerName} avisou a mesa
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
