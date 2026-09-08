"use client";

import { useAuthStore } from "@/store/auth/auth.store";
import { onlineFriends } from "@/shared/mocks/home.mock";
import { UserPlus } from "lucide-react";
import Image from "next/image";

export function RightSidebar() {
  const user = useAuthStore((state) => state.user);

  // Fallback data if user is not loaded properly
  const username = user?.username || user?.email?.split('@')[0] || "Player";
  const userLevel = 24; // Mocked
  const currentXP = 840; // Mocked
  const maxXP = 1200; // Mocked
  const progressPercent = (currentXP / maxXP) * 100;

  return (
    <aside className="w-[300px] flex-shrink-0 hidden xl:flex flex-col h-full bg-[#1F1311] border-l border-white/5 p-6 space-y-8 overflow-y-auto custom-scrollbar">
      {/* Profile Card */}
      <div className="bg-[#2A1B19] rounded-2xl p-4 border border-white/5">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-800">
              <Image 
                src={`https://api.dicebear.com/9.x/bottts/svg?seed=${username}`}
                alt="Avatar"
                width={56}
                height={56}
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-[#FF453A] text-white text-xs font-bold px-2 py-0.5 rounded-md border-2 border-[#2A1B19]">
              {userLevel}
            </div>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg leading-none">{username}</h3>
            <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider mt-1 block">Iniciante</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-2 font-mono">
            <span className="text-gray-400">PROGRESSO</span>
            <span className="text-gray-400">{currentXP} / {maxXP}</span>
          </div>
          <div className="h-1.5 w-full bg-black/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#FF453A] to-[#FF8A84] rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Friends List */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-gray-400 text-xs font-bold uppercase tracking-widest">
            Friends Online ({onlineFriends.length})
          </h4>
          <UserPlus className="w-4 h-4 text-gray-500 cursor-pointer hover:text-white transition-colors" />
        </div>

        <div className="space-y-3">
          {onlineFriends.map((friend) => (
            <div key={friend.id} className="flex items-center gap-3 bg-[#2A1B19]/50 p-3 rounded-xl border border-white/5 hover:bg-[#2A1B19] transition-colors cursor-pointer group">
              <div className="relative">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-800">
                  <Image 
                    src={friend.avatarUrl}
                    alt={friend.name}
                    width={40}
                    height={40}
                  />
                </div>
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#2A1B19] ${friend.statusColor}`} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">{friend.name}</p>
                <p className={`text-[10px] uppercase font-bold tracking-wider ${friend.status === 'Offline' ? 'text-gray-500' : 'text-emerald-500'}`}>
                  {friend.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Friend Button */}
      <div className="pt-4 border-t border-white/5">
        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-3">Pedidos de amizade</p>
        <button className="w-full flex items-center justify-center gap-2 bg-[#2A1B19] hover:bg-[#322825] text-gray-300 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors border border-white/5">
          <UserPlus className="w-4 h-4" />
          Adicionar um novo amigo
        </button>
      </div>
    </aside>
  );
}
