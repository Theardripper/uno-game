import { UnoCard } from "@/components/ui/uno-card";
import { useGameActions } from "@/features/game/hooks/use-game-actions";
import { useGame } from "@/store/game/use-game";
import { AnimatePresence, motion, useMotionValue } from "framer-motion";
import { cn } from "@/helpers/cn";
import { useEffect, useState, useRef } from "react";

export const GameBoard = ({ myPlayerId }) => {
    const { topCard, currentColor, deckCount, currentTurn, direction } = useGame();
    const { drawCard } = useGameActions();

    const isMyTurn = currentTurn === myPlayerId;
    const isClockwise = direction !== "counter_clockwise";

    const discardKey = topCard ? topCard.id : 'empty';

    const [isSpeedingUp, setIsSpeedingUp] = useState(false);
    const rotation = useMotionValue(0);
    const lastTimeRef = useRef(0);
    const requestRef = useRef();

    useEffect(() => {
        if (topCard) {
            setIsSpeedingUp(true);
            const timer = setTimeout(() => setIsSpeedingUp(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [topCard?.id]);

    useEffect(() => {
        // Normal: 15s/360deg = 24 deg/s. Speed up: 1s/360deg = 360 deg/s
        const speed = isSpeedingUp ? 360 : 24;
        const velocity = isClockwise ? speed : -speed;

        const animateRotation = (time) => {
            if (lastTimeRef.current != undefined) {
                const delta = (time - lastTimeRef.current) / 1000;
                // clamp delta to avoid huge jumps on tab switch
                if (delta < 0.1) {
                    rotation.set(rotation.get() + velocity * delta);
                }
            }
            lastTimeRef.current = time;
            requestRef.current = requestAnimationFrame(animateRotation);
        }
        
        requestRef.current = requestAnimationFrame(animateRotation);
        
        return () => cancelAnimationFrame(requestRef.current);
    }, [isSpeedingUp, isClockwise, rotation]);

    const colorMap = {
        red: "bg-[#FF453A]",
        blue: "bg-[#0A84FF]",
        green: "bg-[#30D158]",
        yellow: "bg-[#FFD60A]",
        wild: "bg-white/20"
    };

    const displayColor = currentColor || topCard?.color || "wild";
    const glowColor = colorMap[displayColor];

    return (
        <div className="flex flex-col items-center justify-center h-full w-full relative gap-6">

            {/* Mesa Central */}
            <div className="relative flex items-center justify-center gap-6 md:gap-10 p-20 scale-110">

                {/* Efeitos de fundo e Anel Giratório */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    
                    {/* Brilho intenso no centro se for o meu turno */}
                    <AnimatePresence>
                        {isMyTurn && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 0.4, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.5 }}
                                className={cn("absolute w-80 h-80 rounded-full blur-3xl", glowColor)}
                            />
                        )}
                    </AnimatePresence>
                    
                    {/* Brilho suave da carta atual no fundo */}
                    <motion.div
                        key={displayColor}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.15 }}
                        transition={{ duration: 0.5 }}
                        className={cn("absolute w-80 h-80 rounded-full blur-3xl", glowColor)}
                    />

                    {/* Trilho de fundo sutil */}
                    <div className="w-[420px] h-[420px] rounded-full border border-white/5" />

                    {/* Linhas com gradiente girando continuamente com motor de física (evita pulo no reverse) */}
                    <motion.div
                        className="absolute w-[420px] h-[420px]"
                        style={{ rotate: rotation, willChange: "transform" }}
                    >
                        <svg viewBox="0 0 420 420" className="w-full h-full transform -rotate-45">
                            <defs>
                                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="white" stopOpacity="0.8" />
                                    <stop offset="100%" stopColor="white" stopOpacity="0" />
                                </linearGradient>
                                <linearGradient id="grad2" x1="100%" y1="100%" x2="0%" y2="0%">
                                    <stop offset="0%" stopColor="white" stopOpacity="0.8" />
                                    <stop offset="100%" stopColor="white" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            
                            <path 
                                d="M 210 10 A 200 200 0 0 1 410 210" 
                                fill="none" 
                                stroke="url(#grad1)" 
                                strokeWidth="8" 
                                strokeLinecap="round" 
                            />
                            
                            <path 
                                d="M 210 410 A 200 200 0 0 1 10 210" 
                                fill="none" 
                                stroke="url(#grad2)" 
                                strokeWidth="8" 
                                strokeLinecap="round" 
                            />
                        </svg>
                    </motion.div>
                </div>

                {/* Discard Pile (Pilha de Descarte) */}
                <div className="relative w-[130px] h-[190px] md:w-[150px] md:h-[220px] z-10 transform -rotate-6">
                    {topCard ? (
                        <AnimatePresence mode="popLayout">
                            <motion.div
                                key={`discard-${discardKey}`}
                                layoutId={`card-${topCard.id}`}
                                initial={{ opacity: 0, scale: 0.5, y: -50, rotate: -30 }}
                                // eslint-disable-next-line react-hooks/purity
                                animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
                                exit={{ opacity: 0, scale: 0.5, y: 50 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="absolute inset-0 shadow-2xl"
                                style={{ willChange: "transform, opacity" }}
                            >
                                <UnoCard
                                    color={topCard.color}
                                    type={topCard.type}
                                    value={topCard.value}
                                    className="w-full h-full rounded-2xl border-4 border-white"
                                />
                            </motion.div>
                        </AnimatePresence>
                    ) : (
                        <div className="w-full h-full border-2 border-dashed border-white/20 rounded-2xl flex items-center justify-center">
                            <span className="text-white/40 text-xs font-(family-name:--font-rubik)">Vazio</span>
                        </div>
                    )}
                </div>

                {/* Draw Pile (Deck de Compras) */}
                <div className="flex flex-col items-center gap-3 z-10">
                    <div className="relative transform rotate-6 hover:rotate-8 transition-transform">
                        {/* Simula um monte de cartas */}
                        <div className="absolute top-2 left-2 w-[130px] h-[190px] md:w-[150px] md:h-[220px] bg-[#1a100e] rounded-2xl border-4 border-white/80" />
                        <div className="absolute top-1 left-1 w-[130px] h-[190px] md:w-[150px] md:h-[220px] bg-[#1a100e] rounded-2xl border-4 border-white/90" />

                        <motion.div
                            onClick={() => isMyTurn && drawCard()}
                            whileHover={isMyTurn ? { y: -10, scale: 1.05 } : {}}
                            whileTap={isMyTurn ? { scale: 0.95 } : {}}
                            className={cn(
                                "relative z-10 w-[130px] h-[190px] md:w-[150px] md:h-[220px] transition-all shadow-2xl",
                                isMyTurn ? "cursor-pointer" : "cursor-not-allowed opacity-80"
                            )}
                            title={isMyTurn ? "Comprar carta" : "Não é sua vez"}
                        >
                            <UnoCard
                                isBack={true}
                                className="w-full h-full rounded-2xl border-4 border-white"
                            />
                        </motion.div>
                    </div>
                </div>

            </div>

            {/* Cor da carta da vez */}
            <div className="relative z-20 mt-4 px-6 py-2 rounded-full bg-[#1a100e]/80 backdrop-blur-md border border-white/5 flex items-center gap-3 shadow-lg">
                <motion.div 
                    layoutId="color-indicator"
                    className={cn("w-3 h-3 rounded-full shadow-inner border border-white/20", glowColor)} 
                />
                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                    Cor da carta da vez: <strong className="text-white ml-1">{displayColor}</strong>
                </span>
            </div>
        </div>
    );
};
