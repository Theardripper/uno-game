import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/helpers/cn";
// Using the mock created in the previous task
import { onlineFriends } from "@/shared/mocks/home.mock";

export function InviteFriends() {
  return (
    <div className="flex flex-col mb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em]">
          Amigos Online
        </h2>
        <span className="text-[#5EEAD4] text-[10px] font-bold uppercase tracking-[0.2em]">
          {onlineFriends.length} Online
        </span>
      </div>
      
      <div className="bg-[#1a100e] border border-white/5 rounded-3xl p-4 space-y-3">
        {onlineFriends.map((friend) => (
          <div key={friend.id} className="flex items-center justify-between p-2 rounded-2xl hover:bg-[#2A1B19]/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="w-10 h-10 rounded-xl">
                  <AvatarImage src={friend.avatarUrl} alt={friend.name} className="object-cover" />
                  <AvatarFallback className="rounded-xl bg-[#2A1B19] text-white text-xs">
                    {friend.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div 
                  className={cn(
                    "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#1a100e]",
                    friend.status === "Online" ? "bg-[#5EEAD4]" : "bg-white/20"
                  )} 
                />
              </div>
              
              <div>
                <h4 className="text-white font-bold text-sm leading-tight">
                  {friend.name}
                </h4>
                <p className={cn(
                  "text-[10px] font-bold uppercase tracking-wide",
                  friend.status === "Online" ? "text-[#5EEAD4]" : "text-[#5EEAD4]/60"
                )}>
                  {friend.status}
                </p>
              </div>
            </div>

            <button className="px-4 py-1.5 rounded-full border border-white/10 text-white/70 hover:text-white hover:bg-white/10 text-[10px] font-bold uppercase tracking-widest transition-colors">
              Invite
            </button>
          </div>
        ))}

        {onlineFriends.length === 0 && (
          <div className="text-center py-4 text-gray-500 text-xs font-medium">
            Nenhum amigo online.
          </div>
        )}
      </div>
    </div>
  );
}
