"use client";

import { FadeIn } from "@/components/motion/fade-in";
import { useGame } from "@/store/game/use-game";
import { History, MessageSquareText } from "lucide-react";
import { useEffect, useRef } from "react";

const actionMessages = {
    "played_card": (playerName, detail) => `${playerName} jogou um ${detail?.card?.value === "wild_draw_four" ? "+4" : detail?.card?.value === "wild" ? "Curinga" : detail?.card?.value}`,
    "drew_card": (playerName, detail) => `${playerName} comprou ${detail?.cardCount} carta(s)`,
    "said_uno": (playerName) => `${playerName} gritou UNO!!!`,
    "challenge_success": (playerName, detail) => `${playerName} desafiou com sucesso!`,
    "challenge_failed": (playerName, detail) => `${playerName} tentou desafiar e falhou`,
};

export function GameLog() {
    const { history, players } = useGame();
    const logRef = useRef(null);

    // Auto-scroll para a última mensagem
    useEffect(() => {
        console.log("GameLog History:", history);
        if (logRef.current) {
            logRef.current.scrollTop = logRef.current.scrollHeight;
        }
    }, [history]);

    // if (!history || history.length === 0) return null;

    return (
        <FadeIn>
            <div className="w-64 max-h-[20vh] bg-[#1a100e]/80 backdrop-blur-md rounded-2xl border border-white/5 flex flex-col overflow-hidden shadow-2xl pointer-events-auto">
                <div className="p-3 border-b border-white/5 bg-white/5 flex items-center gap-2">
                    <History className="w-4 h-4 text-white/50" />
                    <span className="text-xs font-bold text-white/70 uppercase tracking-widest">Auditoria</span>
                </div>

                <div ref={logRef} className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                    {(!history || history.length === 0) && (
                        <div className="text-white/40 text-xs italic text-center mt-2">
                            Aguardando a primeira jogada...
                        </div>
                    )}
                    {history?.map((log, i) => {
                        const player = players.find((p) => p.id === log.player);
                        const playerName = player ? player.name : "Alguém";

                        const getMessage = actionMessages[log.action] || (() => `${playerName} fez uma ação desconhecida`);
                        const message = getMessage(playerName, log);

                        return (
                            <div key={`${log.timestamp}-${i}`} className="text-xs flex gap-2 items-start">
                                <MessageSquareText className="w-3 h-3 text-white/30 mt-0.5 shrink-0" />
                                <div>
                                    <span className="text-white/90 font-medium leading-tight">{message}</span>
                                    {log.detail?.card?.color && log.detail?.card?.color !== 'wild' && (
                                        <div className="mt-1 flex items-center gap-1.5">
                                            <div className={`w-2 h-2 rounded-full border border-white/20`}
                                                style={{
                                                    backgroundColor: log.detail.card.color === 'red' ? '#FF453A' :
                                                                     log.detail.card.color === 'blue' ? '#0A84FF' :
                                                                     log.detail.card.color === 'green' ? '#30D158' :
                                                                     log.detail.card.color === 'yellow' ? '#FFD60A' : '#FFFFFF'
                                                }}
                                            />
                                            <span className="text-[9px] text-white/40 uppercase font-bold tracking-wider">
                                                {log.detail.card.color}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </FadeIn>
    );
}
