import { GameSidebar } from "./game-sidebar";
import { RightSidebar } from "./right-sidebar";
import { Header } from "@/components/layout/header";

export function GameLayout({ children }) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#1a100e] text-white">
      {/* Mobile Header (Hidden on Desktop) */}
      <div className="md:hidden absolute top-0 left-0 w-full z-50">
        <Header />
      </div>

      <GameSidebar />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden md:pt-0 pt-16 relative">
        {/* Background gradient noise effect similar to design */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#FF453A]/5 via-transparent to-transparent opacity-50" />
        <div className="relative z-10 p-6 md:p-8 h-full">
          {children}
        </div>
      </main>

      <RightSidebar />
    </div>
  );
}
