import { UnoCard } from "@/components/ui/uno-card";
import { useGame } from "@/store/game/use-game";
import { isPlayableCard as isPlayable } from "@shared/game/rules";
import { AnimatePresence, motion } from "framer-motion";

export const Hand = ({ myPlayerId, isPickingColor = false, playCard }) => {
    const { hand, topCard, currentColor, currentTurn } = useGame();
    const isMyTurn = currentTurn === myPlayerId;

    if (!hand || hand.length === 0) return null;

    // Quando não é a minha vez, as cartas descem um pouco (escondendo)
    const baseTranslateY = isMyTurn ? 0 : 80;

    return (
        <div className={`relative flex justify-center items-end h-56 w-full max-w-5xl mx-auto pb-4 transition-transform duration-700 ${isPickingColor ? "pointer-events-none" : ""}`}>
            <AnimatePresence>
                {hand.map((card, index) => {
                    const offset = index - (hand.length - 1) / 2;

                    // Curva mais suave (menos rotação que antes para não ficar bagunçado)
                    const maxRotation = Math.max(1, 12 - hand.length);
                    const rotate = offset * maxRotation;

                    // Ajuste na parábola (translateY)
                    const maxArchY = Math.max(1, 3 - hand.length / 4);
                    const archY = Math.abs(offset * offset) * maxArchY;

                    const translateY = baseTranslateY + archY;

                    // Espaçamento dinâmico
                    const spacing = Math.min(100, 700 / hand.length);
                    const playable = isMyTurn && isPlayable(card, topCard, currentColor);

                    return (
                        <motion.div
                            key={card.id}
                            layoutId={`card-${card.id}`}
                            initial={{ opacity: 0, y: 150 }}
                            animate={{ opacity: 1, y: translateY, rotate }}
                            exit={{ opacity: 0, y: -50, scale: 0.5 }}
                            whileHover={playable ? { y: translateY - 50, rotate: 0, zIndex: 100, scale: 1.15 } : {}}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            className={`absolute origin-bottom ${playable ? "cursor-pointer" : "cursor-not-allowed opacity-70 hover:opacity-100"}`}
                            style={{
                                marginLeft: `${offset * spacing}px`,
                                zIndex: index,
                                willChange: "transform, opacity"
                            }}
                            onClick={() => playable && playCard(card)}
                        >
                            <UnoCard
                                color={card.color}
                                value={card.value}
                                type={card.type || card.value}
                                className="w-28 h-40 md:w-32 md:h-48 rounded-xl md:rounded-2xl border-4 border-white shadow-[0_10px_30px_rgb(0,0,0,0.6)] hover:shadow-[0_20px_50px_rgb(0,0,0,0.9)] transition-shadow"
                            />
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
};
