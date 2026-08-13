"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppToast } from "@/hooks/use-app-toast";
import { roomService } from "@/services/room.service";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function JoinRoomForm() {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { error: toastError } = useAppToast();

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    setIsLoading(true);
    try {
      // O código no backend deve estar em letras maiúsculas
      const roomCode = code.trim().toUpperCase();

      // Em vez de UNO-1234, talvez o usuário digite só 1234?
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
    <form onSubmit={handleJoin} className="flex space-x-2">
      <Input
        placeholder="Código da sala"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="h-14 text-lg text-center uppercase"
        maxLength={8}
        disabled={isLoading}
      />
      <Button
        type="submit"
        disabled={isLoading || !code.trim()}
        size="lg"
        className="h-14 px-8"
      >
        {isLoading ? "..." : <ArrowRight className="h-5 w-5" />}
      </Button>
    </form>
  );
}
