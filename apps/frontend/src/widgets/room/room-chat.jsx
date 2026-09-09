import { Send } from "lucide-react";

export function RoomChat() {
  return (
    <div className="flex flex-col h-full mt-4">
      <h2 className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
        Chat
      </h2>
      
      <div className="flex-1 bg-[#1a100e] border border-white/5 rounded-3xl p-4 flex flex-col relative overflow-hidden min-h-[250px]">
        {/* Development overlay banner */}
        <div className="absolute inset-0 z-10 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
          <div className="bg-[#FF453A] text-white px-4 py-2 rounded-lg font-bold text-sm tracking-wider uppercase shadow-xl transform -rotate-2">
            Ainda em desenvolvimento
          </div>
        </div>

        {/* Fake Chat Content */}
        <div className="flex-1 overflow-hidden opacity-60">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px bg-white/5 flex-1" />
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              Sala Criada
            </span>
            <div className="h-px bg-white/5 flex-1" />
          </div>

          <div className="flex items-start gap-2 mb-4">
            <span className="text-[#5EEAD4] text-xs">➔</span>
            <p className="text-gray-400 text-xs font-medium">
              Isaac entrou na sala
            </p>
          </div>

          <div className="mb-4">
            <p className="text-gray-500 text-[10px] font-bold mb-1 ml-1 text-right">
              Isaac (Host)
            </p>
            <div className="bg-[#2A1B19] rounded-2xl rounded-tr-sm p-3 border border-white/5 ml-auto w-fit">
              <p className="text-gray-300 text-xs">
                aaaaaaaaaaaaaaaaaaaaaaa
              </p>
            </div>
          </div>
        </div>

        {/* Fake Chat Input */}
        <div className="mt-4 relative opacity-60">
          <input 
            type="text" 
            placeholder="Escreva uma mensagem"
            disabled
            className="w-full bg-[#2A1B19]/50 border border-white/10 rounded-2xl h-12 px-4 text-sm text-white focus:outline-none"
          />
          <button 
            disabled
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-[#FF453A]/20 flex items-center justify-center text-[#FF453A]"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
