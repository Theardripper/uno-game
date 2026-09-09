import { Play, Sparkles } from "lucide-react";

export function BannerSection() {
  return (
    <div className="relative w-full flex-shrink-0 h-[28vh] min-h-[180px] max-h-[320px] rounded-3xl overflow-hidden mb-6 border border-white/10 group">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop')",
        }}
      />
      
      {/* Gradients for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1F1311] via-[#1F1311]/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1F1311]/80 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 p-8 flex flex-col justify-end">
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md w-fit px-3 py-1.5 rounded-full border border-white/10 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[#FFB4AA]" />
          <span className="text-xs font-bold tracking-widest text-[#FFB4AA] uppercase">Season 01</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black text-white mb-2 uppercase tracking-tight">
          Beast of Reincarnation
        </h1>
        
        <p className="text-gray-300 text-sm md:text-base font-medium max-w-md mb-6">
          Monte sua estratégia e garanta sua vitória
        </p>

        <div className="flex flex-wrap gap-4">
          <button className="flex items-center gap-2 bg-gradient-to-r from-[#FF5545] to-[#C0000A] hover:from-[#FF453A] hover:to-[#A00008] text-white px-8 py-3.5 rounded-xl font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(255,85,69,0.3)] hover:shadow-[0_0_30px_rgba(255,85,69,0.5)]">
            <Play className="w-4 h-4 fill-current" />
            Jogar Agora
          </button>
          
          <button className="flex items-center gap-2 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white border border-white/10 px-8 py-3.5 rounded-xl font-bold uppercase tracking-wider transition-all">
            Ver Evento
          </button>
        </div>
      </div>
    </div>
  );
}
