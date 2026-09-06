import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateRoomButton } from "@/features/room/ui/create-room-button";
import { JoinRoomForm } from "@/features/room/ui/join-room-form";

export function LobbyView() {
  return (
    <div className="flex h-screen w-full items-center justify-center p-4 bg-auth-background">
      <Card className="w-full max-w-md bg-black/40 backdrop-blur-md border border-white/10 ring-0 shadow-2xl">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-3xl font-bold tracking-tight text-white uppercase font-(family-name:--font-baloo)">Jogar UNO</CardTitle>
          <CardDescription className="text-base mt-2 text-gray-300 font-(family-name:--font-rubik)">
            Crie uma sala para jogar com amigos ou entre em uma existente.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <CreateRoomButton />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-auth-background px-2 text-gray-400 font-(family-name:--font-rubik)">Ou</span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium mb-2 text-center text-gray-300 font-(family-name:--font-rubik)">Entrar com Código</h3>
            <JoinRoomForm />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
