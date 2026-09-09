import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Pen, Diamond } from "lucide-react";
import { cn } from "@/helpers/cn";

export function ProfileBanner({ profile, onEdit }) {
    if (!profile) return null;

    return (
        <div className="relative w-full rounded-2xl overflow-hidden bg-[#241715] border border-white/5 flex flex-col">
            {/* Cover Placeholder / Image */}
            <div className="h-48 w-full bg-[#E56A15] flex items-center justify-center relative">
                <div className="text-center font-bold text-white opacity-80">
                    <span className="text-2xl font-light tracking-widest">{"//WoW"}</span>
                    <br />
                    <span className="text-4xl tracking-tighter">DESIGN SYSTEM</span>
                </div>
            </div>

            {/* Profile Info */}
            <div className="px-6 pb-6 pt-4 flex flex-col relative">
                {/* Avatar */}
                <div className="absolute -top-16 left-6">
                    <div className="relative">
                        <Avatar className="w-32 h-32 rounded-2xl border-4 border-[#241715] shadow-lg overflow-visible">
                            <div className="w-full h-full rounded-xl overflow-hidden bg-white/10">
                                <AvatarImage src={profile.avatarUrl} className="object-cover" />
                                <AvatarFallback className="rounded-xl">{profile.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </div>
                        </Avatar>
                        {/* Title Diamond Icon */}
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#352522] border-4 border-[#241715] rounded-full flex items-center justify-center">
                            <Diamond className="w-5 h-5 text-indigo-400 fill-indigo-400/20" />
                        </div>
                    </div>
                </div>

                {/* Name & Edit Button Row */}
                <div className="flex justify-between items-start ml-[140px] min-h-[3rem] gap-2">
                    <div className="flex-1 min-w-0">
                        <h1 className="text-3xl font-bold text-white flex flex-wrap items-baseline gap-x-2 leading-tight">
                            <span className="break-words max-w-full">{profile.name}</span>
                            <span className="text-lg font-normal text-white/40 shrink-0">{profile.tag}</span>
                        </h1>
                    </div>
                    {onEdit && (
                        <Button
                            onClick={onEdit}
                            variant="ghost"
                            className="bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-full px-4 h-9 font-semibold text-xs shrink-0"
                        >
                            <Pen className="w-3.5 h-3.5 mr-2" />
                            EDITAR PERFIL
                        </Button>
                    )}
                </div>

                {/* Bio */}
                <p className="mt-2 text-white/60 text-sm ml-[140px]">
                    {profile.bio || "Olá, eu sou o " + profile.name + ", o bestier dos best"}
                </p>

                {/* Divider */}
                <div className="w-full h-[1px] bg-white/5 my-6"></div>

                {/* Level Progress */}
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-xs font-semibold tracking-wider text-white/50 mb-0.5 uppercase">Level</p>
                            <p className="text-3xl font-bold text-[#FF8B8B] leading-none">{profile.level || 1}</p>
                        </div>
                        <p className="text-xs text-white/50 font-mono">
                            {profile.currentLevelXp?.toLocaleString() || 0} / {(profile.currentLevelXp + profile.xpToNextLevel)?.toLocaleString() || 100} XP
                        </p>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-[#FF5545] to-[#FFB4AA] rounded-full"
                            style={{ width: `${profile.progressPercentage || 0}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
