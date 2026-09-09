"use client";

import { GameSidebar } from "./game-sidebar";
import { RightSidebar } from "./right-sidebar";
import { Header } from "@/components/layout/header";
import { usePathname } from "next/navigation";

export function GameLayout({ children }) {
  const pathname = usePathname();
  const isRoomOrGame = pathname?.startsWith('/room') || pathname?.startsWith('/game');
  const isProfile = pathname?.startsWith('/profile');
  const isHub = pathname?.startsWith('/hub');

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#1a100e] text-white">
      {/* Mobile Header (Hidden on Desktop) */}
      {!isRoomOrGame && (
        <div className="md:hidden absolute top-0 left-0 w-full z-50">
          <Header />
        </div>
      )}

      {!isRoomOrGame && <GameSidebar />}
      
      <main className={`flex-1 flex flex-col min-w-0 overflow-hidden relative ${!isRoomOrGame ? "md:pt-0 pt-16" : ""}`}>
        {/* Background gradient noise effect similar to design */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#FF453A]/5 via-transparent to-transparent opacity-50" />
        <div className={`relative z-10 h-full ${!isRoomOrGame ? "p-6 md:p-8" : "p-0"}`}>
          {children}
        </div>
      </main>

      {!isRoomOrGame && !isProfile && !isHub && <RightSidebar />}
    </div>
  );
}
