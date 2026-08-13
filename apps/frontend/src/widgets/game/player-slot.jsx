import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useGame } from "@/store/game/use-game";
import { AnimatePresence, motion } from "framer-motion";

/**
 * PlayerSlot representa um jogador na mesa.
 * Exibe Avatar, Nome, Cartas restantes e se é o turno dele.
 *
 * @param {Object} props
 * @param {string} props.playerId - ID do jogador para buscar no store
 * @param {string} props.position - top, left, right, bottom (para alinhar layouts)
 */
export const PlayerSlot = ({ playerId, position = "top" }) => {
    const { players, currentTurn } = useGame();

    // Busca os dados do jogador no estado global
    const player = players.find(p => p.id === playerId);

    if (!player) return null;

    const isMyTurn = currentTurn === playerId;

    // Define URL do Avatar (suporta fallback ou URL direta)
    const avatarUrl = player.avatarSeed
        ? (player.avatarSeed.startsWith("http") ? player.avatarSeed : `https://api.dicebear.com/9.x/avataaars/svg?seed=${player.avatarSeed}`)
        : "https://api.dicebear.com/9.x/avataaars/svg?seed=fallback";

    // Ajusta o layout dependendo da posição na tela
    const isVertical = position === "left" || position === "right";
    const layoutClasses = isVertical
        ? "flex-col items-center text-center space-y-2"
        : "flex-row items-center space-x-3";

    return (
        <div className={`relative flex ${layoutClasses} p-3 rounded-2xl transition-all duration-300 ${isMyTurn ? "bg-primary/20 border-2 border-primary shadow-lg shadow-primary/30 text-white" : "bg-black/50 border border-white/10 text-white/90"}`}>

            {/* Indicador animado de turno */}
            <AnimatePresence>
                {isMyTurn && (
                    <motion.div
                        key="turn-indicator"
                        className="absolute -inset-1 rounded-2xl border-2 border-primary"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{
                            opacity: [0.5, 1, 0.5],
                            scale: [1, 1.03, 1]
                        }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{
                            repeat: Infinity,
                            duration: 2,
                            ease: "easeInOut"
                        }}
                    />
                )}
            </AnimatePresence>

            <Avatar className={`border-2 ${isMyTurn ? "border-primary" : "border-muted"} ${isVertical ? "w-16 h-16" : "w-12 h-12"}`}>
                <AvatarImage src={avatarUrl} alt={player.name} />
                <AvatarFallback>{player.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>

            <div className={`flex flex-col ${isVertical ? "items-center" : "items-start"}`}>
                <span className="font-bold text-sm truncate max-w-25">{player.name}</span>
                <Badge variant="secondary" className="mt-1 text-xs px-2 py-0">
                    {player.cardCount ?? 7} Cartas
                </Badge>
            </div>

            {/* Badge flutuante caso seja a vez */}
            {isMyTurn && position === "top" && (
                <Badge className="absolute -top-3 right-0 animate-bounce">Pensando...</Badge>
            )}
        </div>
    );
};
