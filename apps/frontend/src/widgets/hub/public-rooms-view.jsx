"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { roomService } from "@/services/room.service";
import { useAppToast } from "@/hooks/use-app-toast";

export function PublicRoomsView() {
    const router = useRouter();
    const [rooms, setRooms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const { error: toastError } = useAppToast();

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await roomService.getPublicRooms();
                setRooms(response.data?.rooms || []);
            } catch (error) {
                toastError("Erro ao carregar salas públicas", "Erro");
            } finally {
                setIsLoading(false);
            }
        };

        fetchRooms();
    }, [toastError]);

    const filteredRooms = rooms.filter(room => 
        room.hostName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        room.hostTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleJoin = async (code) => {
        try {
            await roomService.joinRoom(code);
            router.push(`/room/${code}`);
        } catch (error) {
            toastError(error.response?.data?.message || "Não foi possível entrar nesta sala", "Erro");
        }
    };

    return (
        <div className="h-full bg-transparent flex flex-col p-6 overflow-y-auto max-w-5xl mx-auto w-full hide-scrollbar">
            <button 
                onClick={() => router.push("/hub")}
                className="self-start flex items-center gap-2 text-white/50 hover:text-white mb-6 text-xs font-bold uppercase tracking-widest transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Voltar ao Hub
            </button>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-white tracking-tight uppercase mb-1">
                        Salas Públicas
                    </h1>
                    <p className="text-white/50 text-sm">
                        Encontre salas ativas para jogar
                    </p>
                </div>
                
                <div className="bg-[#1C1210] border border-white/5 rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                    <span className="text-teal-400 font-mono text-sm font-bold">{filteredRooms.length} salas disponíveis</span>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                    <Input 
                        placeholder="Pesquisar pelo nome do Host ou código..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-[#241715] border-white/5 text-white pl-12 h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-teal-400/50 w-full"
                    />
                </div>
            </div>

            {/* Room Grid */}
            {isLoading ? (
                <div className="flex-1 flex items-center justify-center text-white/50">
                    <span className="animate-pulse">Buscando salas...</span>
                </div>
            ) : filteredRooms.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-white/50">
                    <p>Nenhuma sala encontrada.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredRooms.map(room => (
                        <div key={room.id} className="bg-[#1C1210] border border-white/5 rounded-2xl p-6 flex flex-col justify-between hover:bg-[#2A1B19]/50 transition-colors">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-white/10 overflow-hidden shrink-0 border border-white/10">
                                    <img src={room.hostAvatar} alt={room.hostName} className="w-full h-full object-cover" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-white font-bold text-lg truncate">Partida de {room.hostName}</h3>
                                    <p className="text-white/40 text-sm truncate">{room.hostTag}</p>
                                </div>
                            </div>
                            
                            <Button 
                                variant="outline" 
                                className="w-full bg-[#2A1B19] border-white/10 hover:bg-[#3A2522] hover:text-white text-white/80 h-12 rounded-xl group"
                                onClick={() => handleJoin(room.code)}
                            >
                                Entrar na Sala <ArrowRight className="w-4 h-4 ml-2 opacity-50 group-hover:opacity-100 transition-opacity group-hover:translate-x-1 duration-200" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
