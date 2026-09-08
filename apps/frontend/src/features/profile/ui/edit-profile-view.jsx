import React, { useState, useEffect } from "react";
import { User, Image as ImageIcon, CheckCircle2, ShieldAlert } from "lucide-react";
import { ProfileBanner } from "./profile-banner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const COVERS = [
    { id: 1, color: "bg-[#E56A15]", text: "//WoW DESIGN SYSTEM" },
    { id: 2, color: "bg-[#3B82F6]", text: "//AQUA DESIGN SYSTEM" },
    { id: 3, color: "bg-[#10B981]", text: "//NATURE DESIGN SYSTEM" },
    { id: 4, color: "bg-[#8B5CF6]", text: "//MYSTIC DESIGN SYSTEM" },
];

export function EditProfileView({ profile, onCancel, onSave }) {
    const [name, setName] = useState(profile?.name || "");
    const [bio, setBio] = useState(profile?.bio || "");
    const [avatarSeed, setAvatarSeed] = useState(profile?.avatarSeed || "Felix");
    const [coverId, setCoverId] = useState(profile?.coverId || 1);
    
    // Some pre-defined seeds for selection
    const AVATAR_SEEDS = [profile?.avatarSeed || "Felix", "Aneka", "Jude", "Leah", "Oliver"];

    const isDirty = name !== profile?.name || bio !== (profile?.bio || "") || avatarSeed !== profile?.avatarSeed || coverId !== profile?.coverId;

    const handleSave = () => {
        onSave({ 
            name, 
            bio, 
            avatar_seed: avatarSeed, 
            cover_id: coverId 
        });
    };

    // Derived mock profile for live preview
    const previewProfile = {
        ...profile,
        name,
        bio,
        avatarSeed,
        avatarUrl: `https://api.dicebear.com/9.x/avataaars/svg?seed=${avatarSeed}`,
        coverId
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 h-full">
            {/* Forms Column */}
            <div className="flex flex-col gap-6 pb-24">
                
                {/* Identification Section */}
                <div className="bg-[#1C1210] border border-white/5 p-6 rounded-2xl flex flex-col gap-6">
                    <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                            <User className="w-5 h-5 text-white/50" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Identificação</h2>
                            <p className="text-xs text-white/40">Atualize suas informações públicas</p>
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Username</label>
                            <div className="relative">
                                <User className="w-4 h-4 text-white/30 absolute left-4 top-1/2 -translate-y-1/2" />
                                <Input 
                                    className="bg-[#241715] border-white/5 text-white pl-10 rounded-xl focus-visible:ring-1 focus-visible:ring-[#FF5545]/50 h-12"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between">
                                <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Biografia</label>
                                <span className="text-[10px] font-mono text-white/30">{bio.length}/120</span>
                            </div>
                            <div className="relative">
                                <User className="w-4 h-4 text-white/30 absolute left-4 top-4" />
                                <textarea 
                                    className="w-full bg-[#241715] border border-white/5 text-white pl-10 pr-4 py-3 rounded-xl focus-visible:ring-1 focus-visible:ring-[#FF5545]/50 outline-none resize-none min-h-[100px] text-sm"
                                    value={bio}
                                    maxLength={120}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="Escreva algo sobre você..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Avatar Section */}
                <div className="bg-[#1C1210] border border-white/5 p-6 rounded-2xl flex flex-col gap-6">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                                <User className="w-5 h-5 text-white/50" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Avatar</h2>
                                <p className="text-xs text-white/40">Escolha o seu avatar</p>
                            </div>
                        </div>
                        <Button variant="outline" className="h-8 text-xs bg-transparent border-white/10 text-white/70 hover:bg-white/5 hover:text-white rounded-full px-4 font-mono uppercase tracking-wider">
                            Upload
                        </Button>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
                        {AVATAR_SEEDS.map((seed) => {
                            const isSelected = avatarSeed === seed;
                            return (
                                <button 
                                    key={seed} 
                                    onClick={() => setAvatarSeed(seed)}
                                    className={`relative shrink-0 w-24 h-24 rounded-2xl overflow-hidden transition-all duration-200 border-2 ${isSelected ? 'border-[#FF5545] shadow-[0_0_15px_rgba(255,85,69,0.2)]' : 'border-transparent hover:border-white/20'}`}
                                >
                                    <div className="w-full h-full bg-white/10">
                                        <img src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}`} alt="Avatar" className="w-full h-full object-cover" />
                                    </div>
                                    {isSelected && (
                                        <div className="absolute top-1 right-1 bg-[#FF5545] text-white rounded-full p-0.5">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Cover Section */}
                <div className="bg-[#1C1210] border border-white/5 p-6 rounded-2xl flex flex-col gap-6">
                    <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-white/50" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Capa</h2>
                            <p className="text-xs text-white/40">Escolha a sua capa de perfil</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {COVERS.map((cover) => {
                            const isSelected = coverId === cover.id;
                            return (
                                <button 
                                    key={cover.id}
                                    onClick={() => setCoverId(cover.id)}
                                    className={`relative w-full h-28 rounded-2xl flex items-center justify-center transition-all duration-200 border-2 ${cover.color} ${isSelected ? 'border-[#FF5545] shadow-[0_0_15px_rgba(255,85,69,0.2)]' : 'border-transparent hover:opacity-80'}`}
                                >
                                    <span className="text-white/80 font-bold text-sm tracking-tighter w-24 leading-tight text-center">{cover.text}</span>
                                    {isSelected && (
                                        <div className="absolute top-2 right-2 bg-[#FF5545] text-white rounded-full p-0.5">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

            </div>

            {/* Live Preview Column */}
            <div className="relative">
                <div className="sticky top-8 flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-white/40">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-[10px] font-mono uppercase tracking-widest">Live Preview</span>
                    </div>
                    <div className="pointer-events-none origin-top transition-transform">
                        <ProfileBanner profile={previewProfile} />
                    </div>
                </div>
            </div>

            {/* Unsaved Changes Bar */}
            {isDirty && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-4xl bg-[#1C1210] border border-white/5 p-4 px-6 rounded-2xl flex items-center justify-between shadow-2xl z-50 animate-in slide-in-from-bottom-10 fade-in">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500">
                            <ShieldAlert className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-white font-bold flex items-center gap-2">
                                Alterações não salvas <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            </p>
                            <p className="text-xs text-white/50">Você modificou e não salvou!</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="ghost" onClick={onCancel} className="text-white/70 hover:text-white hover:bg-white/5 rounded-full px-6 font-mono text-[10px] uppercase tracking-widest">
                            Cancelar
                        </Button>
                        <Button onClick={handleSave} className="bg-[#FF5545] hover:bg-[#FF5545]/90 text-white rounded-full px-6 font-mono text-[10px] uppercase tracking-widest h-10">
                            Salvar as Edições
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
