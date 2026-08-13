import { UnoCard } from "@/components/ui/uno-card";
import { useGameActions } from "@/hooks/game/use-game-actions";
import { useGame } from "@/store/game/use-game";
import { AnimatePresence, motion } from "framer-motion";

export const Hand = () => {
    const { hand } = useGame();
    const { playCard } = useGameActions();

    if (!hand || hand.length === 0) return null;

    return (
        <div className="relative flex justify-center items-end h-56 w-full max-w-4xl mx-auto px- pb-8">
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

                    return (
                        <motion.div
                            key={card.id}
                            initial={{ opacity: 0, y: 150 }}
                            animate={{ opacity: 1, y: translateY, rotate }}
                            exit={{ opacity: 0, y: -50, scale: 0.5 }}
                            whileHover={{ y: -40, rotate: 0, zIndex: 100, scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="absolute origin-bottom cursor-pointer transition-shadow"
                            style={{
                                marginLeft: `${offset * spacing}px`,
                                zIndex: index
                            }}
                            onClick={() => playCard(card)}
                        >
                            <UnoCard
                                color={card.color}
                                value={card.value}
                                type={card.type || card.value}
                                className="w-32 h-48 shadow-[0_8px_30px_rgb(0,0,0,0.5)] hover:shadow-[0_20px_50px_rgb(0,0,0,0.8)]"
                            />
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
};
