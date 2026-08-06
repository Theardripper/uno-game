"use client";

import { Button } from "@/components/ui/button";
import { roomService } from "@/services/room.service";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAppToast } from "../../hooks/use-app-toast";

export function CreateRoomButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { success, error: toastError } = useAppToast();

  const handleCreateRoom = async () => {
    setIsLoading(true);
    try {
      const response = await roomService.createRoom();
      const room = response.data?.room;

      if (room && room.code) {
        success(`Código: ${room.code}`, "Sala criada!");
        router.push(`/room/${room.code}`);
      }
    } catch (error) {
      toastError("Não foi possível criar a sala.", "Erro");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCreateRoom}
      disabled={isLoading}
      size="lg"
      className="w-full text-lg h-14"
    >
      {isLoading ? (
        "Criando..."
      ) : (
        <>
          <Plus className="mr-2 h-5 w-5" /> Criar Nova Sala
        </>
      )}
    </Button>
  );
}
