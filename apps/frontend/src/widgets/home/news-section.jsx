import { news } from "@/shared/mocks/home.mock";
import Image from "next/image";

export function NewsSection() {
  return (
    <div className="flex flex-col h-full min-h-0">
      <h3 className="text-gray-400 text-xs font-bold uppercase tracking-[0.15em] mb-4 flex-shrink-0">
        Notícias & Novidades
      </h3>
      
      <div className="space-y-4 overflow-hidden flex-1 min-h-0">
        {news.map((item) => (
          <div 
            key={item.id} 
            className="flex gap-4 bg-[#2A1B19]/50 hover:bg-[#2A1B19] p-4 rounded-2xl border border-white/5 transition-colors group cursor-pointer"
          >
            <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 relative">
              <Image 
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            
            <div className="flex flex-col justify-center">
              <p className="text-gray-400 font-mono text-[10px] tracking-widest uppercase mb-1">
                UPDATE {item.version}
              </p>
              <h4 className="text-white font-bold text-sm leading-tight mb-1 group-hover:text-[#FFB4AA] transition-colors">
                {item.title}
              </h4>
              <p className="text-gray-500 text-xs line-clamp-2">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
