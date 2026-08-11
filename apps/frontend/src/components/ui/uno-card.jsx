import { motion } from "framer-motion";
import Image from "next/image";

/**
 * Componente visual que representa uma carta de UNO.
 * Ele tenta carregar a imagem correspondente da pasta /public/cards/
 * com base na cor e no tipo/valor informados.
 *
 * @param {Object} props
 * @param {string} props.color - red, blue, green, yellow, wild
 * @param {string} props.type - number, skip, reverse, draw2, draw4, wild
 * @param {number|string} [props.value] - 0-9 (obrigatório se type for number)
 * @param {boolean} [props.isBack] - Se verdadeiro, renderiza as costas da carta
 * @param {Object} [props.style] - Estilos CSS inline
 * @param {string} [props.className] - Classes Tailwind adicionais
 */
export const UnoCard = ({ color, type, value, isBack = false, style, className = "", ...props }) => {

    // O backend usa 'value' para tudo. Se 'type' não vier, assumimos que é igual a 'value'
    const actualType = type || value;

    const getCardImage = () => {
        if (isBack) {
            return "/cards/back.png";
        }

        const capitalizedColor = color ? color.charAt(0).toUpperCase() + color.slice(1).toLowerCase() : "";

        if (actualType === "wild") {
            return "/cards/Wild-1.png";
        }
        if (actualType === "draw4" || actualType === "+4" || actualType === "wild_draw_four") {
            return "/cards/Draw4- 1.png";
        }
        if (actualType === "draw2" || actualType === "+2" || actualType === "draw_two") {
            return `/cards/${capitalizedColor} Draw2- 1.png`;
        }
        if (actualType === "skip") {
            return `/cards/${capitalizedColor} Skip- 1.png`;
        }
        if (actualType === "reverse") {
            return `/cards/${capitalizedColor} Reverse- 1.png`;
        }
        if (actualType === "number" || (value !== undefined && !["wild", "draw_two", "wild_draw_four", "skip", "reverse"].includes(actualType))) {
            return `/cards/${capitalizedColor}- ${value}.png`;
        }

        // Fallback genérico se nada combinar
        return "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
    };

    const cardImage = getCardImage();

    // Uma representação de fallback se a imagem falhar ao carregar
    const bgColor = {
        red: "bg-red-500",
        blue: "bg-blue-500",
        green: "bg-green-500",
        yellow: "bg-yellow-500",
        wild: "bg-gray-800",
    }[color?.toLowerCase()] || "bg-gray-200";

    return (
        <motion.div
            className={`relative w-24 h-36 rounded-xl shadow-md flex items-center justify-center overflow-hidden border-2 border-white/20 bg-gray-900 ${className}`}
            style={style}
            {...props}
        >
            <Image
                src={cardImage}
                alt={`${color} ${type} ${value ?? ''}`}
                fill
                className="object-contain pointer-events-none"
                onError={(e) => {
                    // Fallback se a imagem não for encontrada
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement.classList.add(bgColor);
                    e.currentTarget.parentElement.classList.remove('bg-gray-900');
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
            />
            {/* Fallback Text: Visível apenas se a imagem falhar ao carregar */}
            <div className="flex absolute inset-0 flex-col items-center justify-center text-white font-bold text-xl drop-shadow-md">
                <span>{actualType === "number" ? value : actualType}</span>
            </div>
        </motion.div>
    );
};
