"use client";

import React, { useState } from "react";
import { useUserQuery, useProfileStatsQuery, useProfileHistoryQuery, useUpdateProfileMutation } from "@/features/profile/model/use-profile";
import { ProfileBanner } from "@/features/profile/ui/profile-banner";
import { ProfileStats } from "@/features/profile/ui/profile-stats";
import { ProfileTrophies } from "@/features/profile/ui/profile-trophies";
import { ProfileMatchSummary } from "@/features/profile/ui/profile-match-summary";
import { ProfileMatchHistory } from "@/features/profile/ui/profile-match-history";
import { EditProfileView } from "@/features/profile/ui/edit-profile-view";
import { FadeIn } from "@/components/motion/fade-in";
import { ArrowLeft } from "lucide-react";

export function ProfileWidget() {
    const { data: userData, isLoading: isUserLoading } = useUserQuery();
    const { data: statsData, isLoading: isStatsLoading } = useProfileStatsQuery();
    const { data: historyData, isLoading: isHistoryLoading } = useProfileHistoryQuery();
    const updateProfileMutation = useUpdateProfileMutation();

    const [isEditing, setIsEditing] = useState(false);

    if (isUserLoading || isStatsLoading || isHistoryLoading) {
        return (
            <div className="p-8 h-full flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-t-white/80 border-white/20 rounded-full animate-spin"></div>
            </div>
        );
    }

    const user = userData?.data?.player;
    const stats = statsData?.data?.stats;
    const history = historyData?.data?.history;

    const handleSave = (updatedData) => {
        updateProfileMutation.mutate(updatedData, {
            onSuccess: () => {
                setIsEditing(false);
            }
        });
    };

    return (
        <div className="h-full bg-transparent flex flex-col p-6 overflow-y-auto w-full hide-scrollbar">
            {/* Header */}
            <div className="mb-8 flex items-center gap-4">
                {isEditing && (
                    <button 
                        onClick={() => setIsEditing(false)}
                        className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                )}
                <h1 className="text-4xl font-bold text-white tracking-tight uppercase">Seu Perfil</h1>
            </div>

            <FadeIn>
                {isEditing ? (
                    <EditProfileView 
                        profile={user} 
                        onCancel={() => setIsEditing(false)} 
                        onSave={handleSave} 
                    />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
                        {/* Main Column */}
                        <div className="flex flex-col gap-8">
                            <ProfileBanner profile={user} onEdit={() => setIsEditing(true)} />
                            <ProfileMatchSummary stats={stats} />
                        </div>

                        {/* Sidebar Column */}
                        <div className="flex flex-col gap-8">
                            <ProfileStats />
                            <ProfileTrophies />
                            <ProfileMatchHistory history={history} />
                        </div>
                    </div>
                )}
            </FadeIn>
        </div>
    );
}
