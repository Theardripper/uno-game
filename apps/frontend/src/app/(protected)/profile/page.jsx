"use client";

import { useUserQuery } from "@/features/profile/model/use-profile";
import { EditProfileForm } from "@/features/profile/ui/edit-profile-form";
import { FadeIn } from "@/components/motion/fade-in";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
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
      <div className="flex justify-center mb-8">
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

      <EditProfileForm defaultValues={user} />
    </FadeIn>
  );
}
