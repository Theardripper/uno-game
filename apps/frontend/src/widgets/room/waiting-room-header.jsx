import { Badge } from "@/components/ui/badge";
import { Users, Copy, Lock, Globe2 } from "lucide-react";

export function WaitingRoomHeader({ hostName, playerCount, maxPlayers, roomCode, isHost, isPrivate, onTogglePrivacy, onCopyCode }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 w-full mb-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight font-(family-name:--font-baloo)">
          Partida Uno Game
        </h1>
        <p className="text-sm md:text-base text-gray-400 font-mono tracking-wide mt-1">
          Criado por {hostName || "Host"} • Sala de Espera
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {isHost && (
          <button
            onClick={onTogglePrivacy}
            className="flex items-center gap-2 px-4 py-2 rounded-full font-mono font-medium text-sm transition-colors border border-white/10 text-white bg-[#1a100e] hover:bg-white/5"
            title="Alternar entre Sala Privada e Pública"
          >
            {isPrivate ? (
              <><Lock className="w-4 h-4 text-red-400" /> Privada</>
            ) : (
              <><Globe2 className="w-4 h-4 text-teal-400" /> Pública</>
            )}
          </button>
        )}

        <Badge className="bg-[#1a100e] hover:bg-[#1a100e] text-white border border-white/10 px-4 py-2 gap-2 rounded-full font-mono font-medium text-sm">
          <Users className="w-4 h-4 text-gray-400" />
          {playerCount}/{maxPlayers} Jogadores
        </Badge>
        
        <Badge className="bg-[#1a100e] hover:bg-[#1a100e] text-white border border-white/10 px-4 py-2 gap-2 rounded-full font-mono font-medium text-sm flex items-center">
          <span className="text-gray-400 mr-1 text-[10px] tracking-widest uppercase">CÓDIGO:</span> 
          {roomCode}
          <button 
            onClick={onCopyCode} 
            className="ml-2 text-gray-400 hover:text-white transition-colors"
            title="Copiar código da sala"
          >
            <Copy className="w-4 h-4" />
          </button>
        </Badge>
      </div>
    </div>
  );
}
