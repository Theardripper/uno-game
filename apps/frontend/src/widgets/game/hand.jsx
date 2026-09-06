import { UnoCard } from "@/components/ui/uno-card";
import { useGame } from "@/store/game/use-game";
import { isPlayableCard as isPlayable } from "@shared/game/rules";
import { AnimatePresence, motion } from "framer-motion";

export const Hand = ({ myPlayerId, isPickingColor = false, playCard }) => {
    const { hand, topCard, currentColor, currentTurn } = useGame();
    const isMyTurn = currentTurn === myPlayerId;

    if (!hand || hand.length === 0) return null;

    return (
        <div className={`relative flex justify-center items-end h-48 w-full max-w-4xl mx-auto px- pb-8 ${isPickingColor ? "pointer-events-none" : ""}`}>
            <AnimatePresence>
                {hand.map((card, index) => {
                    const offset = index - (hand.length - 1) / 2;

                    // Se houver muitas cartas, reduzimos o arco e o espaçamento
                    const maxRotation = Math.max(1, 15 - hand.length);
                    const rotate = offset * maxRotation;

                    const maxTranslateY = Math.max(1, 5 - hand.length / 2);
                    const translateY = Math.abs(offset) * maxTranslateY;

                    // Espaçamento dinâmico para evitar que ultrapasse a tela
                    const spacing = Math.min(120, 800 / hand.length);
                    // isPlayable só compara a carta com o topo; sem isMyTurn, cartas
                    // compatíveis ficavam clicáveis fora da vez e o servidor rejeitava.
                    const playable = isMyTurn && isPlayable(card, topCard, currentColor);

                    return (
                        <motion.div
                            key={card.id}
                            layoutId={`card-${card.id}`}
                            initial={{ opacity: 0, y: 150 }}
                            animate={{ opacity: 1, y: translateY, rotate }}
                            exit={{ opacity: 0, y: -50, scale: 0.5 }}
                            whileHover={playable ? { y: -40, rotate: 0, zIndex: 100, scale: 1.1 } : {}}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className={`absolute origin-bottom transition-shadow ${playable ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
                            style={{
                                marginLeft: `${offset * spacing}px`,
                                zIndex: index
                            }}
                            onClick={() => playable && playCard(card)}
                        >
                            <UnoCard
                                color={card.color}
                                value={card.value}
                                type={card.type || card.value}
                                className="w-24 h-36 shadow-[0_8px_30px_rgb(0,0,0,0.5)] hover:shadow-[0_20px_50px_rgb(0,0,0,0.8)]"
                            />
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
};
