import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/helpers/cn";

export function PlayerCard({ player, isMe, isHost }) {
  return (
    <div 
      className={cn(
        "relative flex flex-col items-center justify-center p-6 rounded-3xl border transition-colors h-[220px]",
        isMe ? "border-[#FF453A] bg-[#2A1B19]/30" : "border-white/5 bg-[#1a100e] hover:bg-[#2A1B19]/20"
      )}
    >
      {isMe && (
        <div className="absolute top-4 left-4 bg-[#FF453A] text-white text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest">
          Você
        </div>
      )}

      <div className="relative mb-4">
        {/* Glow behind avatar if Me or Host */}
        {(isMe || isHost) && (
          <div className="absolute inset-0 bg-[#FF453A]/40 blur-xl rounded-2xl scale-125" />
        )}
        
        <Avatar className="relative w-20 h-20 rounded-2xl border-2 border-white/10 shadow-lg">
          <AvatarImage src={player.avatarSeed} alt={player.name} className="object-cover" />
          <AvatarFallback className="rounded-2xl text-xl bg-[#2A1B19] text-white">
            {player.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {isHost && (
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#FF453A] text-white text-[9px] font-bold px-3 py-0.5 rounded-full uppercase tracking-widest shadow-md">
            Host
          </div>
        )}
      </div>

      <h3 className="text-white font-bold text-base mt-2 truncate w-full text-center">
        {player.name}
      </h3>

      <div className="flex items-center gap-1.5 mt-1">
        <span className={cn(
          "w-1.5 h-1.5 rounded-full",
          player.ready ? "bg-[#5EEAD4]" : "bg-white/20"
        )} />
        <span className={cn(
          "text-[10px] font-bold uppercase tracking-widest",
          player.ready ? "text-[#5EEAD4]" : "text-gray-500"
        )}>
          {player.ready ? "Ready" : "Not Ready"}
        </span>
      </div>
    </div>
  );
}
