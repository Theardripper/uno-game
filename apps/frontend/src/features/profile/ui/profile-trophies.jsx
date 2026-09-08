import React from "react";
import { Trophy, Medal, Lock } from "lucide-react";
import { cn } from "@/helpers/cn";

const trophies = [
    { id: 1, title: "First Victory", icon: Trophy, unlocked: true, color: "text-blue-400", border: "border-blue-400", bg: "bg-blue-400/10" },
    { id: 2, title: "UNO Master", icon: Medal, unlocked: true, color: "text-[#FF8B8B]", border: "border-[#FF8B8B]", bg: "bg-[#FF8B8B]/10" },
    { id: 3, title: "God Tier", icon: Lock, unlocked: false, color: "text-white/20", border: "border-white/5", bg: "bg-black/20" },
    { id: 4, title: "God Tier", icon: Lock, unlocked: false, color: "text-white/20", border: "border-white/5", bg: "bg-black/20" },
    { id: 5, title: "God Tier", icon: Lock, unlocked: false, color: "text-white/20", border: "border-white/5", bg: "bg-black/20" },
];

export function ProfileTrophies() {
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-white">Troféus</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                {trophies.map((t) => {
                    const Icon = t.icon;
                    return (
                        <div key={t.id} className="flex flex-col items-center gap-3 min-w-[72px]">
                            <div className={cn(
                                "w-16 h-16 rounded-full border-2 flex items-center justify-center",
                                t.border,
                                t.bg
                            )}>
                                <Icon className={cn("w-6 h-6", t.color, t.unlocked && "fill-current/20")} />
                            </div>
                            <p className="text-[10px] font-mono text-white/50 text-center uppercase tracking-wider">{t.title}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
