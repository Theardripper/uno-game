import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";

/**
 * Modal obrigatório de seleção de cor para curingas (Wild / +4).
 * Não pode ser fechado sem escolher uma cor, sem overlay clicável, sem ESC.
 *
 * @param {{ isOpen: boolean, onColorSelected: (color: string) => void }} props
 */
export function ColorPickerModal({ isOpen, onColorSelected }) {
    const colors = [
        { key: "red",    label: "Vermelho", bg: "bg-red-500",    hover: "hover:bg-red-400",    ring: "ring-red-300",    emoji: "🔴" },
        { key: "blue",   label: "Azul",     bg: "bg-blue-500",   hover: "hover:bg-blue-400",   ring: "ring-blue-300",   emoji: "🔵" },
        { key: "green",  label: "Verde",    bg: "bg-green-500",  hover: "hover:bg-green-400",  ring: "ring-green-300",  emoji: "🟢" },
        { key: "yellow", label: "Amarelo",  bg: "bg-yellow-400", hover: "hover:bg-yellow-300", ring: "ring-yellow-200", emoji: "🟡" },
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
                className="bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-8 max-w-sm w-full"
            >
                <DialogHeader className="text-center mb-6">
                    <DialogTitle className="text-2xl font-black text-white tracking-tight">
                        Escolha a cor
                    </DialogTitle>
                    <p className="text-sm text-white/50 mt-1">
                        Você jogou um curinga, escolha a próxima cor
                    </p>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4">
                    {colors.map((color, i) => (
                        <motion.button
                            key={color.key}
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.06, type: "spring", stiffness: 400, damping: 20 }}
                            whileHover={{ scale: 1.07, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onColorSelected(color.key)}
                            className={`
                                flex flex-col items-center justify-center gap-2
                                w-full h-24 rounded-2xl font-bold text-white text-base
                                shadow-xl transition-all duration-150
                                ring-0 hover:ring-4 ${color.ring}
                                ${color.bg} ${color.hover}
                            `}
                        >
                            <span className="text-3xl">{color.emoji}</span>
                            <span className="text-sm font-bold uppercase tracking-widest">
                                {color.label}
                            </span>
                        </motion.button>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
