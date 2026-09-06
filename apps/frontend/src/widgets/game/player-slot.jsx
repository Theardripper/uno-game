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

    // Mesmo bloco visual pra todo mundo (inclusive o jogador local em "bottom"):
    // ícone quadrado com brilho, nome em pill e contagem de cartas em pips.
    return (
        <div className="relative flex flex-col items-center gap-2">

            <div className="relative">
                {/* Brilho atrás do ícone, mais intenso quando é a vez do jogador */}
                <AnimatePresence>
                    <motion.div
                        key={isMyTurn ? "glow-active" : "glow-idle"}
                        className={`absolute inset-0 rounded-2xl blur-xl scale-125 ${isMyTurn ? "bg-auth-accent/70" : "bg-auth-accent/25"}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    />
                </AnimatePresence>

                <Avatar className={`relative w-16 h-16 rounded-2xl after:rounded-2xl border-2 ${isMyTurn ? "border-auth-accent" : "border-white/20"}`}>
                    <AvatarImage src={avatarUrl} alt={player.name} className="rounded-2xl" />
                    <AvatarFallback className="rounded-2xl">{player.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
            </div>

            <span className={`text-xs font-bold px-3 py-1 rounded-full truncate max-w-25 font-(family-name:--font-rubik) ${isMyTurn ? "bg-auth-accent text-auth-accent-foreground" : "bg-black/60 text-white/90"}`}>
                {player.name}
            </span>

            {/* Contagem de cartas em pips (o jogador local já vê a própria mão, não precisa da contagem) */}
            <div className="flex gap-1 flex-wrap justify-center max-w-25">
                {Array.from({ length: player.cardCount ?? 0 }).map((_, i) => (
                    <span key={i} className="w-2.5 h-2.5 rounded-xs bg-auth-accent" />
                ))}
            </div>

            {/* Badge flutuante caso seja a vez */}
            {isMyTurn && position === "top" && (
                <Badge className="absolute -top-3 right-0 animate-bounce bg-auth-accent text-auth-accent-foreground font-(family-name:--font-rubik)">Pensando...</Badge>
            )}
        </div>
    );
};
