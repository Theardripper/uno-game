import { UserPlus } from "lucide-react";

export function EmptySlotCard() {
  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-3xl border border-dashed border-white/5 bg-transparent h-[220px]">
      <div className="w-16 h-16 rounded-2xl border border-dashed border-white/20 flex items-center justify-center mb-4 text-gray-500">
        <UserPlus className="w-6 h-6" />
      </div>
      
      <p className="text-gray-400 font-medium text-sm">
        Convidar Player
      </p>
      
      <p className="text-gray-600 text-[10px] uppercase font-bold tracking-widest mt-1">
        Vazio
      </p>
    </div>
  );
}
