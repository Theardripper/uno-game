import { UnoCard } from "@/components/ui/uno-card";
import { useGameActions } from "@/features/game/hooks/use-game-actions";
import { useGame } from "@/store/game/use-game";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, RotateCw } from "lucide-react";

/**
 * GameBoard representa a mesa central do jogo de UNO.
 * Ele consome o estado global do jogo para renderizar:
 * - A pilha de descarte (com a carta do topo)
 * - O deck de compras (clicável só no turno do jogador local)
 * - A cor atual
 * - O sentido de rotação dos turnos
 *
 * @param {{ myPlayerId: string }} props
 */
export const GameBoard = ({ myPlayerId }) => {
    const { topCard, currentColor, deckCount, currentTurn, direction } = useGame();
    const { drawCard } = useGameActions();

    const isMyTurn = currentTurn === myPlayerId;

    // O id da carta (não cor/valor) garante que cartas repetidas (ex: dois "amarelo 5"
    // seguidos) sejam tratadas como itens distintos pelo AnimatePresence, e é o mesmo
    // id usado como layoutId em hand.jsx — é o que permite a animação de "voo".
    const discardKey = topCard ? topCard.id : 'empty';

    const colorMap = {
        red: "bg-red-500",
        blue: "bg-blue-500",
        green: "bg-green-500",
        yellow: "bg-yellow-500",
        wild: "bg-gray-800"
    };

    const displayColor = currentColor || topCard?.color || "wild";
    const isClockwise = direction !== "counter_clockwise";

    return (
        <div className="flex flex-col items-center justify-center h-full w-full relative gap-6">

            {/* Mesa Central */}
            <div className="relative flex items-center justify-center gap-8 p-16">

                {/* Anel decorativo ao redor das cartas */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-90 h-90 rounded-full border border-auth-accent/20" />
                    <motion.div
                        key={displayColor}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.2 }}
                        transition={{ duration: 0.5 }}
                        className={`absolute w-72 h-72 rounded-full blur-3xl ${colorMap[displayColor] || "bg-gray-500"}`}
                    />
                </div>

                {/* Indicador de direção — animado quando muda */}
                <motion.div
                    key={direction}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/10"
                >
                    <motion.div
                        animate={{ rotate: isClockwise ? 0 : 180 }}
                        transition={{ type: "spring", stiffness: 200, damping: 18 }}
                    >
                        {isClockwise
                            ? <RotateCw className="w-3.5 h-3.5 text-white/70" />
                            : <RotateCcw className="w-3.5 h-3.5 text-white/70" />
                        }
                    </motion.div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                        {isClockwise ? "Horário" : "Anti-horário"}
                    </span>
                </motion.div>

                {/* Discard Pile (Pilha de Descarte) */}
                <div className="relative w-24 h-36 z-10">
                    {topCard ? (
                        <AnimatePresence mode="popLayout">
                            <motion.div
                                key={`discard-${discardKey}`}
                                layoutId={`card-${topCard.id}`}
                                initial={{ opacity: 0, scale: 0.5, y: -50, rotate: -15 }}
                                // eslint-disable-next-line react-hooks/purity
                                animate={{ opacity: 1, scale: 1, y: 0, rotate: Math.random() * 10 - 5 }}
                                exit={{ opacity: 0, scale: 0.5, y: 50 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="absolute inset-0 shadow-xl shadow-black/50"
                            >
                                <UnoCard
                                    color={topCard.color}
                                    type={topCard.type}
                                    value={topCard.value}
                                    className="w-full h-full"
                                />
                            </motion.div>
                        </AnimatePresence>
                    ) : (
                        <div className="w-full h-full border-2 border-dashed border-white/20 rounded-xl flex items-center justify-center">
                            <span className="text-white/40 text-xs">Vazio</span>
                        </div>
                    )}
                </div>

                {/* Draw Pile (Deck de Compras) — clicável só no turno do jogador local */}
                <div className="flex flex-col items-center gap-2 z-10">
                    <div className="relative">
                        {/* Simula um monte de cartas */}
                        <div className="absolute top-2 left-2 w-24 h-36 bg-black/30 rounded-xl border border-white/10" />
                        <div className="absolute top-1 left-1 w-24 h-36 bg-black/20 rounded-xl border border-white/10" />

                        <motion.div
                            onClick={() => isMyTurn && drawCard()}
                            whileHover={isMyTurn ? { y: -6, scale: 1.04 } : {}}
                            whileTap={isMyTurn ? { scale: 0.97 } : {}}
                            className={`relative z-10 transition-all ${isMyTurn ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
                            title={isMyTurn ? "Comprar carta" : "Não é sua vez"}
                        >
                            <UnoCard
                                isBack={true}
                                className="shadow-xl shadow-black/40"
                            />
                            {/* Brilho pulsante no deck quando é o turno */}
                            {isMyTurn && (
                                <motion.div
                                    className="absolute -inset-1 rounded-xl border-2 border-auth-accent/60 pointer-events-none"
                                    animate={{ opacity: [0.4, 1, 0.4] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                />
                            )}
                        </motion.div>
                    </div>
                    <span className="text-xs font-semibold text-white/50 bg-black/30 px-3 py-1 rounded-full">
                        {deckCount} Restantes
                    </span>
                </div>

            </div>

            {/* Cor da carta da vez */}
            <span className="text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-white/80 shadow-inner flex items-center gap-2 border border-white/10">
                <span className={`w-2.5 h-2.5 rounded-full ${colorMap[displayColor] || "bg-gray-500"}`} />
                Cor da carta da vez: {currentColor || topCard?.color || "nenhuma"}
            </span>
        </div>
    );
};
