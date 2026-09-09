"use client";

import React, { useState } from "react";
import { X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { roomService } from "@/services/room.service";
import { useAppToast } from "@/hooks/use-app-toast";
import { useRouter } from "next/navigation";

export function JoinRoomModal({ onClose }) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { error: toastError } = useAppToast();

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    setIsLoading(true);
    try {
      const roomCode = code.trim().toUpperCase();
      const finalCode = roomCode.startsWith("UNO-") ? roomCode : `UNO-${roomCode}`;

      await roomService.joinRoom(finalCode);
      router.push(`/room/${finalCode}`);
    } catch (error) {
      toastError(error.response?.data?.message || "Verifique o código e tente novamente.", "Erro ao entrar na sala");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#1C1210] border border-white/10 p-8 rounded-3xl max-w-md w-full mx-4 shadow-2xl relative animate-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <h2 className="text-2xl font-bold text-white mb-2">Entrar na Sala</h2>
        <p className="text-white/50 text-sm mb-6">Digite o código de 4 dígitos da sala privada.</p>
        
        <form onSubmit={handleJoin} className="flex flex-col gap-4">
          <Input
            autoFocus
            placeholder="Ex: 1234"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="h-16 text-2xl text-center uppercase bg-[#241715] border-white/5 focus-visible:ring-1 focus-visible:ring-blue-500/50 rounded-2xl tracking-[0.2em]"
            maxLength={8}
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !code.trim()}
            variant="accent"
            size="xl"
            fullWidth
            className="mt-2 text-lg tracking-wide uppercase"
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
