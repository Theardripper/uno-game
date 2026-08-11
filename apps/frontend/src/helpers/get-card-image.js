/**
 * Função utilitária para transformar uma carta em seu respectivo asset visual.
 * Ela garante que a resolução da imagem seja centralizada e determinística, 
 * baseada nos dados do Game Engine e nos padrões de arquivos da UI.
 *
 * @param {Object} card 
 * @param {string} card.color - "red", "blue", "green", "yellow", "wild"
 * @param {string} card.value - "0"-"9", "skip", "reverse", "draw_two", "wild", "wild_draw_four"
 * @param {string} [card.type] - opcional, fallback pro valor.
 * @returns {string} O caminho do asset (e.g. "/cards/red/skip.png")
 */
export const getCardImage = (card) => {
    if (!card) return "/cards/back.png";

    const color = card.color?.toLowerCase();
    
    // O backend pode enviar como type ou value. Usamos value como principal e type como fallback
    let value = (card.value || card.type)?.toLowerCase();

    if (!value) return "/cards/back.png";

    // Mapeamentos específicos (o Game Engine usa draw_two e wild_draw_four, os assets usam draw_2 e draw_4)
    if (value === "draw_two" || value === "draw2" || value === "+2") {
        value = "draw_2";
    } else if (value === "wild_draw_four" || value === "draw4" || value === "+4") {
        value = "draw_4";
    }

    if (color === "wild" || value === "wild" || value === "draw_4") {
        return `/cards/wild/${value === "wild" ? "wild" : "draw_4"}.png`;
    }

    if (!color) return "/cards/back.png"; // Fallback pra carta virada se faltar algo essencial

    return `/cards/${color}/${value}.png`;
};
