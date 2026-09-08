import React from "react";
import { Star, LayoutGrid, Flame, Medal } from "lucide-react";

function StatCard({ icon: Icon, title, value, iconColor, iconBg }) {
    return (
        <div className="bg-[#1C1210] rounded-2xl p-5 border border-white/5 flex flex-col gap-8 flex-1 min-w-[140px]">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBg}`}>
                <Icon className={`w-6 h-6 ${iconColor}`} />
            </div>
            <div>
                <p className="text-[10px] font-bold text-white/40 tracking-widest uppercase mb-1">{title}</p>
                <p className="text-lg font-bold text-white/90">{value}</p>
            </div>
        </div>
    );
}

export function ProfileStats() {
    return (
        <div className="flex flex-wrap gap-4">
            <StatCard
                icon={Star}
                title="Última conquista"
                value="UNO Master"
                iconColor="text-teal-400 fill-teal-400"
                iconBg="bg-teal-400/10"
            />
            <StatCard
                icon={LayoutGrid}
                title="Carta favorita"
                value="Reverso"
                iconColor="text-indigo-400 fill-indigo-400/20"
                iconBg="bg-indigo-400/10"
            />
            <StatCard
                icon={Flame}
                title="Win streak"
                value="7 Wins"
                iconColor="text-orange-400 fill-orange-400"
                iconBg="bg-orange-400/10"
            />
            <StatCard
                icon={Medal}
                title="Seu título"
                value={<span className="bg-gradient-to-r from-[#FFB4AA] to-[#A399FF] bg-clip-text text-transparent">Prism Legend</span>}
                iconColor="text-pink-200 fill-pink-200"
                iconBg="bg-white/10"
            />
        </div>
    );
}
