import { UnoCard } from "@/components/ui/uno-card";
import { useGameActions } from "@/features/game/hooks/use-game-actions";
import { useGame } from "@/store/game/use-game";
import { AnimatePresence, motion } from "framer-motion";

/**
 * GameBoard representa a mesa central do jogo de UNO.
 * Ele consome o estado global do jogo para renderizar:
 * - A pilha de descarte (com a carta do topo)
 * - O deck de compras
 * - A cor atual
 * - O jogador da vez
 */
export const GameBoard = () => {
    const { topCard, currentColor, currentTurn, deckCount } = useGame();
    const { drawCard } = useGameActions();

    // Utilizaremos o próprio topCard como chave para refazer a animação
    const discardKey = topCard ? `${topCard.color}-${topCard.type}-${topCard.value}` : 'empty';

    const colorMap = {
        red: "bg-red-500",
        blue: "bg-blue-500",
        green: "bg-green-500",
        yellow: "bg-yellow-500",
        wild: "bg-gray-800"
    };

    const displayColor = currentColor || topCard?.color || "wild";

    return (
        <div className="flex flex-col items-center justify-center h-full w-full relative p-8">

            {/* Indicador de turno atual no centro (opcional, já que PlayerSlots também mostram) */}
            <div className="absolute top-4 text-center">
                <span className="text-sm text-white/70 uppercase tracking-wider font-bold">Vez do Jogador</span>
                <p className="text-xl font-bold text-white">{currentTurn || "Aguardando..."}</p>
            </div>

            {/* Mesa Central */}
            <div className="relative flex items-center justify-center gap-12 p-12 bg-white rounded-[3rem] border border-gray-200 shadow-2xl">

                {/* Draw Pile (Deck de Compras) */}
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        {/* Simula um monte de cartas */}
                        <div className="absolute top-2 left-2 w-24 h-36 bg-gray-300 rounded-xl border border-gray-400" />
                        <div className="absolute top-1 left-1 w-24 h-36 bg-gray-200 rounded-xl border border-gray-300" />

                        <div onClick={() => drawCard()}>
                            <UnoCard
                                isBack={true}
                                className="relative z-10 hover:-translate-y-2 transition-transform cursor-pointer shadow-xl shadow-black/20"
                            />
                        </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {deckCount} Restantes
                    </span>
                </div>

                {/* Área da Cor Atual (Current Color Ring) */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <motion.div
                        key={displayColor}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.15 }}
                        transition={{ duration: 0.5 }}
                        className={`w-72 h-72 rounded-full blur-3xl ${colorMap[displayColor] || "bg-gray-500"}`}
                    />
                </div>

                {/* Discard Pile (Pilha de Descarte) */}
                <div className="flex flex-col items-center gap-4 z-10">
                    <div className="relative w-24 h-36">
                        {topCard ? (
                            <AnimatePresence mode="popLayout">
                                <motion.div
                                    key={`discard-${discardKey}`}
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
                            <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center">
                                <span className="text-gray-400 text-xs">Vazio</span>
                            </div>
                        )}
                    </div>
                    <span className="text-sm font-bold uppercase tracking-widest px-4 py-1 rounded-full bg-gray-100 text-gray-700 shadow-inner flex items-center gap-2 border border-gray-200">
                        <span className={`w-3 h-3 rounded-full ${colorMap[displayColor] || "bg-gray-500"}`} />
                        {currentColor || topCard?.color || "Nenhuma"}
                    </span>
                </div>

            </div>
        </div>
    );
};
