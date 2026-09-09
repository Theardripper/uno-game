import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { cn } from "@/helpers/cn";

/**
 * Modal obrigatório de seleção de cor para curingas (Wild / +4).
 * Melhorado para acessibilidade e design de "switch" (acende ao passar o mouse).
 *
 * @param {{ isOpen: boolean, onColorSelected: (color: string) => void }} props
 */
export function ColorPickerModal({ isOpen, onColorSelected }) {
    const colors = [
        { 
            key: "red",    
            label: "Vermelho", 
            base: "border-[#FF453A]/20 text-[#FF453A]/50 bg-gradient-to-b from-[#FF453A]/10 to-transparent",
            active: "hover:bg-[#FF453A] hover:border-[#FF453A] hover:text-white hover:shadow-[0_0_30px_rgba(255,69,58,0.4)] focus-visible:bg-[#FF453A] focus-visible:text-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-[#FF453A]",
            emoji: "🔴" 
        },
        { 
            key: "blue",   
            label: "Azul",     
            base: "border-[#0A84FF]/20 text-[#0A84FF]/50 bg-gradient-to-b from-[#0A84FF]/10 to-transparent",
            active: "hover:bg-[#0A84FF] hover:border-[#0A84FF] hover:text-white hover:shadow-[0_0_30px_rgba(10,132,255,0.4)] focus-visible:bg-[#0A84FF] focus-visible:text-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-[#0A84FF]",
            emoji: "🔵" 
        },
        { 
            key: "green",  
            label: "Verde",    
            base: "border-[#30D158]/20 text-[#30D158]/50 bg-gradient-to-b from-[#30D158]/10 to-transparent",
            active: "hover:bg-[#30D158] hover:border-[#30D158] hover:text-white hover:shadow-[0_0_30px_rgba(48,209,88,0.4)] focus-visible:bg-[#30D158] focus-visible:text-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-[#30D158]",
            emoji: "🟢" 
        },
        { 
            key: "yellow", 
            label: "Amarelo",  
            base: "border-[#FFD60A]/20 text-[#FFD60A]/50 bg-gradient-to-b from-[#FFD60A]/10 to-transparent",
            active: "hover:bg-[#FFD60A] hover:border-[#FFD60A] hover:text-[#1A1A1A] hover:shadow-[0_0_30px_rgba(255,214,10,0.4)] focus-visible:bg-[#FFD60A] focus-visible:text-[#1A1A1A] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-[#FFD60A]",
            emoji: "🟡" 
        },
    ];

    return (
        <Dialog
            open={isOpen}
            modal
            disablePointerDismissal
            onOpenChange={() => {}}
        >
            <DialogContent
                showCloseButton={false}
                aria-describedby="color-picker-description"
                className="bg-[#0A0A0A]/95 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.7)] rounded-[2rem] p-8 max-w-sm w-full outline-none"
            >
                <DialogHeader className="text-center mb-8">
                    <DialogTitle className="text-2xl font-black text-white tracking-tight font-(family-name:--font-baloo) flex items-center justify-center gap-2">
                        <span>✨</span> Escolha a Cor
                    </DialogTitle>
                    <p id="color-picker-description" className="text-sm text-white/50 mt-2 font-(family-name:--font-rubik)">
                        A mesa está aguardando a sua decisão para continuar a partida.
                    </p>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4" role="group" aria-label="Opções de cores">
                    {colors.map((color, i) => (
                        <motion.button
                            key={color.key}
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: i * 0.08, type: "spring", stiffness: 400, damping: 25 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.92 }}
                            onClick={() => onColorSelected(color.key)}
                            aria-label={`Escolher a cor ${color.label}`}
                            className={cn(
                                "group relative flex flex-col items-center justify-center gap-3",
                                "w-full h-28 rounded-2xl border-2 font-black uppercase text-sm tracking-widest font-(family-name:--font-rubik)",
                                "transition-all duration-300 ease-out outline-none overflow-hidden",
                                color.base,
                                color.active
                            )}
                        >
                            {/* Brilho interno (flare) ao passar o mouse */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-white/20 to-transparent transition-opacity duration-300" />
                            
                            <span className="text-3xl filter drop-shadow-md transition-transform duration-300 group-hover:scale-125 group-focus-visible:scale-125">
                                {color.emoji}
                            </span>
                            <span className="relative z-10 transition-colors duration-300">
                                {color.label}
                            </span>
                        </motion.button>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
