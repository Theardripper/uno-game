"use client";

import React, { useState } from "react";
import { PlusCircle, Grid3X3, Globe } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import Link from "next/link";
import { HubActionCard } from "./hub-action-card";
import { JoinRoomModal } from "./join-room-modal";
import { useUserQuery } from "@/features/profile/model/use-profile";
import { roomService } from "@/services/room.service";
import { useAppToast } from "@/hooks/use-app-toast";
import { useRouter } from "next/navigation";

export function HubWidget() {
  const { data: userData } = useUserQuery();
  const user = userData?.data?.player;
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const router = useRouter();
  const { success, error: toastError } = useAppToast();

  const handleCreateRoom = async () => {
    setIsCreatingRoom(true);
    try {
      const response = await roomService.createRoom({});
      const room = response.data?.room;

      if (room && room.code) {
        success(`Código: ${room.code}`, "Sala criada!");
        router.push(`/room/${room.code}`);
      }
    } catch (error) {
      toastError("Não foi possível criar a sala.", "Erro");
      console.log(error);
    } finally {
      setIsCreatingRoom(false);
    }
  };

  return (
    <div className="h-full bg-transparent flex flex-col p-6 overflow-y-auto w-full hide-scrollbar">
      {/* Header */}
      <div className="flex justify-between items-start mb-12">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight uppercase mb-1">
            Hub de Games
          </h1>
          <p className="text-white/50 text-sm">
            Escolha o modo de game do qual você gostaria de jogar
          </p>
        </div>
        
        {/* User Info Right Corner */}
        <div className="flex items-center gap-4">
          {user && (
            <Link href="/profile" className="block w-12 h-12 rounded-full bg-white/10 overflow-hidden border-2 border-white/10 hover:border-white/40 transition-colors shadow-lg">
              <img 
                src={user.avatarUrl || `https://api.dicebear.com/9.x/bottts/svg?seed=${user.avatarSeed || user.name || "Player"}`} 
                alt="Avatar" 
                className="w-full h-full object-cover" 
              />
            </Link>
          )}
        </div>
      </div>

      {/* Main Content (Cards) */}
      <FadeIn className="flex-1 flex items-center justify-center -mt-16">
        <div className="flex flex-wrap items-center justify-center gap-6 w-full max-w-5xl">
          <HubActionCard 
            icon={PlusCircle}
            title="Criar uma sala"
            description="Crie uma sala personalizada"
            colorClass="text-[#FF5545] border-[#FF5545]/30 bg-[#FF5545]/10"
            onClick={handleCreateRoom}
            disabled={isCreatingRoom}
          />
          <HubActionCard 
            icon={Grid3X3}
            title="Entrar via Código"
            description="Entre em uma sala privada através de um codigo"
            colorClass="text-blue-500 border-blue-500/30 bg-blue-500/10"
            onClick={() => setIsJoinModalOpen(true)}
          />
          <HubActionCard 
            icon={Globe}
            title="Salas Públicas"
            description="Procure por salas públicas"
            colorClass="text-teal-400 border-teal-400/30 bg-teal-400/10"
            onClick={() => router.push("/hub/public-rooms")}
          />
        </div>
      </FadeIn>

      {/* Join Room Modal */}
      {isJoinModalOpen && (
        <JoinRoomModal onClose={() => setIsJoinModalOpen(false)} />
      )}
    </div>
  );
}
