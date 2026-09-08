import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGame } from "@/store/game/use-game";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/helpers/cn";

export const PlayerSlot = ({ playerId, position = "top" }) => {
    const { players, currentTurn } = useGame();

    const player = players.find(p => p.id === playerId);

    if (!player) return null;

    const isMyTurn = currentTurn === playerId;
    const isLocal = position === "bottom";

    const avatarUrl = player.avatarSeed
        ? (player.avatarSeed.startsWith("http") ? player.avatarSeed : `https://api.dicebear.com/9.x/avataaars/svg?seed=${player.avatarSeed}`)
        : "https://api.dicebear.com/9.x/avataaars/svg?seed=fallback";

    if (isLocal) {
        return (
            <div className="relative flex flex-col items-center">
                <Avatar className="w-16 h-16 rounded-2xl border-2 border-white/10 shadow-lg">
                    <AvatarImage src={avatarUrl} alt="Você" className="object-cover" />
                    <AvatarFallback className="rounded-2xl bg-[#2A1B19] text-white">VC</AvatarFallback>
                </Avatar>
                
                <div className="absolute -bottom-2 -right-4 bg-[#2A1B19]/90 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
                    Você
                </div>
            </div>
        );
    }

    return (
        <div className="relative flex flex-col items-center gap-3">

            <div className="relative">
                {/* Glow intenso verde/amarelo quando é a vez */}
                <AnimatePresence>
                    {isMyTurn && (
                        <motion.div
                            key="glow-active"
                            className="absolute inset-0 rounded-2xl blur-xl scale-150 bg-[#CCFF00]/60"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        />
                    )}
                </AnimatePresence>

                <Avatar className={cn(
                    "relative w-16 h-16 rounded-2xl border-[3px] shadow-lg transition-colors",
                    isMyTurn ? "border-[#CCFF00]" : "border-[#CCFF00]/20"
                )}>
                    <AvatarImage src={avatarUrl} alt={player.name} className="object-cover" />
                    <AvatarFallback className="rounded-2xl bg-[#CCFF00]/20 text-[#CCFF00]">
                        {player.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            </div>

            <div className="bg-[#2A1B19]/80 backdrop-blur-md border border-white/5 text-white/90 text-xs font-bold px-4 py-1.5 rounded-full shadow-sm max-w-28 truncate text-center">
                {player.name}
            </div>

            {/* Mini Cartas traseiras */}
            <div className="flex gap-1 justify-center max-w-[120px] flex-wrap">
                <AnimatePresence>
                    {Array.from({ length: Math.min(player.cardCount ?? 0, 15) }).map((_, i) => (
                        <motion.div 
                            key={`minicard-${playerId}-${i}`}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            className="w-4 h-6 rounded-[2px] bg-[#C0000A] border-[1.5px] border-white/90 shadow-sm" 
                        />
                    ))}
                    {player.cardCount > 15 && (
                        <span className="text-white/50 text-[10px] font-bold self-end ml-1">+{player.cardCount - 15}</span>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
