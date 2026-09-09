import { Bell } from "lucide-react";

export function HomeHeader() {
  return (
    <header className="flex justify-between items-center mb-8 pt-4 md:pt-0">
      <div className="text-gray-400 font-mono text-xs tracking-[0.2em] uppercase flex items-center gap-2">
        <span>SYSTEM</span>
        <span className="text-gray-600">//</span>
        <span>BEAST_OF_REINCARNATION_S1</span>
      </div>
      
      <button className="w-10 h-10 rounded-xl bg-[#2A1B19]/80 border border-white/5 flex items-center justify-center hover:bg-[#322825] transition-colors relative">
        <Bell className="w-5 h-5 text-gray-300" />
        <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-[#FF453A] rounded-full" />
      </button>
    </header>
  );
}
