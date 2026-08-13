"use client";

import { useUserQuery } from "@/features/profile/model/use-profile";
import { EditProfileForm } from "@/features/profile/ui/edit-profile-form";
import { FadeIn } from "@/components/motion/fade-in";
import { Button } from "@/components/ui/button";

export function ProfileWidget() {
  const { data, isLoading, isError, refetch } = useUserQuery();

  if (isLoading) {
    return (
      <FadeIn className="w-full max-w-md mx-auto mt-12 p-6 bg-card rounded-xl shadow-sm border animate-pulse">
        <div className="h-8 bg-muted rounded w-1/3 mb-6"></div>
        <div className="space-y-4">
          <div className="h-4 bg-muted rounded w-1/4"></div>
          <div className="h-10 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-1/4"></div>
          <div className="h-10 bg-muted rounded w-full"></div>
          <div className="h-10 bg-muted rounded w-full mt-6"></div>
        </div>
      </FadeIn>
    );
  }

  if (isError) {
    return (
      <FadeIn className="w-full max-w-md mx-auto mt-12 p-6 bg-card rounded-xl shadow-sm border text-center">
        <h2 className="text-xl font-bold text-destructive mb-4">Erro ao carregar perfil</h2>
        <p className="text-muted-foreground mb-6">Não foi possível carregar as informações do seu perfil no momento.</p>
        <Button onClick={() => refetch()} variant="secondary">Tentar Novamente</Button>
      </FadeIn>
    );
  }

  const user = data?.data?.player;

  return (
    <FadeIn className="w-full max-w-md mx-auto mt-12 p-6 bg-card rounded-xl shadow-sm border">
      <h1 className="text-2xl font-bold mb-6 text-card-foreground">Meu Perfil</h1>
      
      {/* Exibição do Avatar Atual */}
      <div className="flex justify-center mb-6">
        {user?.avatarUrl ? (
          <img 
            src={user.avatarUrl} 
            alt="Avatar do Usuário" 
            className="w-32 h-32 rounded-full border-4 border-primary bg-muted shadow-sm"
          />
        ) : (
          <div className="w-32 h-32 rounded-full border-4 border-primary bg-muted shadow-sm flex items-center justify-center text-muted-foreground text-sm font-medium">
            Sem Avatar
          </div>
        )}
      </div>

      {/* Exibição de Nível e XP */}
      {user && (
        <div className="mb-8 p-5 bg-slate-50 border rounded-2xl shadow-sm text-center">
          <div className="font-bold text-lg text-slate-800 mb-1">
            Nível {user.level || 1}
          </div>
          
          <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden mb-2">
            <div 
                className="bg-primary h-full rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${user.progressPercentage || 0}%` }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-slate-500 font-medium px-1 mb-2">
            <span>{user.currentLevelXp || 0} / {user.levelSize || 0} XP</span>
            <span>Faltam {user.xpToNextLevel || 0} XP</span>
          </div>

          <div className="text-sm font-bold text-slate-600 bg-white inline-block px-3 py-1 rounded-full border shadow-sm">
            Total: {user.xp || 0} XP
          </div>

          {/* Stats */}
          {user.stats && (
            <div className="mt-6 grid grid-cols-3 gap-2 border-t pt-4">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-black text-slate-700">{user.stats.gamesPlayed}</span>
                <span className="text-xs uppercase text-slate-500 tracking-wider">Partidas</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-black text-green-600">{user.stats.wins}</span>
                <span className="text-xs uppercase text-slate-500 tracking-wider">Vitórias</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-black text-red-500">{user.stats.losses}</span>
                <span className="text-xs uppercase text-slate-500 tracking-wider">Derrotas</span>
              </div>
            </div>
          )}
        </div>
      )}

      <EditProfileForm defaultValues={user} />
    </FadeIn>
  );
}
