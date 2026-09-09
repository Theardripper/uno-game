"use client";

import { CreateRoomButton } from "@/features/room/ui/create-room-button";
import { JoinRoomForm } from "@/features/room/ui/join-room-form";
import { PlusSquare, Key, Globe } from "lucide-react";
import { useRouter } from "next/navigation";

export function ActionCards() {
  const router = useRouter();
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 flex-shrink-0">
      
      {/* Create Room Card */}
      <div className="bg-[#1a100e] border border-white/5 rounded-3xl p-6 flex flex-col justify-between hover:bg-[#2A1B19]/50 transition-colors h-auto min-h-[160px]">
        <div>
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
            <PlusSquare className="w-5 h-5 text-[#FFB4AA]" />
          </div>
          <h3 className="text-white font-bold text-lg mb-1">Criar sala</h3>
        </div>
        <div className="mt-4">
          <CreateRoomButton />
        </div>
      </div>

      {/* Join Room Card */}
      <div className="bg-[#1a100e] border border-white/5 rounded-3xl p-6 flex flex-col justify-between hover:bg-[#2A1B19]/50 transition-colors h-auto min-h-[160px]">
        <div>
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
            <Key className="w-5 h-5 text-[#8892FF]" />
          </div>
          <h3 className="text-white font-bold text-lg mb-1">Entrar via código</h3>
        </div>
        <div className="mt-4">
          <JoinRoomForm />
        </div>
      </div>

      {/* Public Rooms Card (Placeholder for future) */}
      <div className="bg-[#1a100e] border border-white/5 rounded-3xl p-6 flex flex-col justify-between hover:bg-[#2A1B19]/50 transition-colors h-auto min-h-[160px]">
        <div>
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
            <Globe className="w-5 h-5 text-[#5EEAD4]" />
          </div>
          <h3 className="text-white font-bold text-lg mb-1">Salas públicas</h3>
        </div>
        <div className="mt-4">
          <button 
            onClick={() => router.push("/hub/public-rooms")}
            className="w-full py-3.5 rounded-xl bg-[#2A1B19] hover:bg-[#322825] text-gray-300 font-bold uppercase tracking-wider text-sm transition-colors border border-white/5"
          >
            Browse
          </button>
        </div>
      </div>

    </div>
  );
}
