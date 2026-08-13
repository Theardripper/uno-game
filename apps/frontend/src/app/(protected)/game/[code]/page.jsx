"use client";

import { Button } from "@/components/ui/button";
import { useGameSocket } from "@/hooks/game/use-game-socket";
import { socketClient } from "@/socket/socket-client";
import { useAuth } from "@/store/auth/use-auth";
import { useGame } from "@/store/game/use-game";
import { useGameStore } from "@/store/game/game.store";
import { LobbyEvents } from "@shared/socket/events";
import { GameBoard } from "@/widgets/game/game-board";
import { Hand } from "@/widgets/game/hand";
import { HUD } from "@/widgets/game/hud";
import { PlayerSlot } from "@/widgets/game/player-slot";
import { GameOverModal } from "@/widgets/game/game-over-modal";
import { Settings } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function GamePage() {
    const { code } = useParams();
    const router = useRouter();
    const { accessToken } = useAuth();

    const { players, status, winnerId } = useGame();
    const [showSettings, setShowSettings] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);
    
    // 1. Extrair playerId do token de forma derivada
    const myPlayerId = useMemo(() => {
        if (!accessToken) return null;
        try {
            const payload = JSON.parse(atob(accessToken.split('.')[1]));
            return payload.id || payload.sub;
        } catch(e) {
            console.error("Erro ao decodificar token", e);
            return null;
        }
    }, [accessToken]);

    useEffect(() => {
        if (!accessToken) {
            router.push("/auth/login");
        }
    }, [accessToken, router]);

    const handleLeaveGame = () => {
        if (isLeaving) return;
        setIsLeaving(true);
        socketClient.emit(LobbyEvents.CLIENT_LEAVE_ROOM, { roomCode: code }, () => {
            useGameStore.getState().actions.reset();
            router.push("/lobby");
        });

        // Fallback for timeout
        setTimeout(() => {
            useGameStore.getState().actions.reset();
            router.push("/lobby");
        }, 1000);
    };

    // 2. Inicializar Sockets através do hook centralizado
    useGameSocket(code, myPlayerId);

    // Extrair jogadores para posicionamento baseado na perspectiva do jogador local
    let rotatedPlayers = [...players];
    if (myPlayerId) {
        const myIndex = rotatedPlayers.findIndex(p => p.id === myPlayerId);
        if (myIndex !== -1) {
            rotatedPlayers = [...rotatedPlayers.slice(myIndex), ...rotatedPlayers.slice(0, myIndex)];
        }
    }

    const bottomPlayer = rotatedPlayers[0];
    const leftPlayer = rotatedPlayers[1];
    const topPlayer = rotatedPlayers[2];
    const rightPlayer = rotatedPlayers[3];

    return (
        <div className="relative w-full h-dvh bg-white overflow-hidden select-none flex flex-col font-sans">

            {/* Fundo da Mesa (Radial Gradient para foco no centro) */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-blue-900/20 via-neutral-950 to-neutral-950 pointer-events-none" />

            {/* HUD (Timer, UNO Button) */}
            <HUD />

            {/* Layout da Mesa (Grid) */}
            <div className="absolute inset-0 grid grid-rows-[1fr_3fr_1fr] grid-cols-[1fr_3fr_1fr] p-4 gap-4 pointer-events-none">

                {/* Top Section */}
                <div className="col-start-2 row-start-1 flex items-start justify-center pt-8 pointer-events-auto">
                    {topPlayer && <PlayerSlot playerId={topPlayer.id} position="top" />}
                </div>

                {/* Left Section */}
                <div className="col-start-1 row-start-2 flex items-center justify-start pl-8 pointer-events-auto">
                    {leftPlayer && <PlayerSlot playerId={leftPlayer.id} position="left" />}
                </div>

                {/* Center Section (Mesa) */}
                <div className="col-start-2 row-start-2 flex items-center justify-center pointer-events-auto z-10">
                    <GameBoard />
                </div>

                {/* Right Section */}
                <div className="col-start-3 row-start-2 flex items-center justify-end pr-8 pointer-events-auto">
                    {rightPlayer && <PlayerSlot playerId={rightPlayer.id} position="right" />}
                </div>

                {/* Bottom Section (Minha Mão) */}
                <div className="col-start-2 row-start-3 flex flex-col items-center justify-end pb-4 pointer-events-auto z-20">
                    <Hand />
                    <div className="mt-4">
                        {bottomPlayer && <PlayerSlot playerId={bottomPlayer.id} position="bottom" />}
                    </div>
                </div>
            </div>

            {/* GameOver Modal Overlay */}
            <GameOverModal 
                localPlayerId={myPlayerId} 
                onLeave={handleLeaveGame}
                isLeaving={isLeaving}
            />

            {/* Settings Button */}
            <div className="absolute top-6 right-6 z-100 pointer-events-auto">
                <Button variant="outline" size="icon" className="bg-white/90 backdrop-blur-md text-slate-800 border-slate-200 hover:bg-white shadow-lg rounded-full w-12 h-12" onClick={() => setShowSettings(true)}>
                    <Settings className="w-6 h-6 text-slate-700" />
                </Button>
            </div>

            {/* Settings Modal */}
            {showSettings && (
                <div className="absolute inset-0 z-200 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto">
                    <div className="bg-white text-slate-900 p-6 rounded-2xl shadow-2xl w-full max-w-sm border border-slate-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Configurações</h2>
                            <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-700 text-3xl leading-none">&times;</button>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                                <h3 className="font-semibold text-red-600 mb-2">Sair da partida?</h3>
                                <p className="text-sm text-slate-600 mb-5">Você realmente deseja abandonar esta partida? A partida será encerrada para você.</p>

                                <div className="flex justify-end gap-3">
                                    <Button variant="outline" className="bg-white border-slate-300 text-slate-700 hover:bg-slate-50" onClick={() => setShowSettings(false)} disabled={isLeaving}>Cancelar</Button>
                                    <Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white shadow-md" onClick={handleLeaveGame} disabled={isLeaving}>
                                        {isLeaving ? "Saindo..." : "Sair do Jogo"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
