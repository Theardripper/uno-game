import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateRoomButton } from "@/features/room/CreateRoomButton";
import { JoinRoomForm } from "@/features/room/JoinRoomForm";

export const metadata = {
  title: "Lobby | UNO Jala",
};

export default function LobbyPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <Card className="w-full max-w-md border-primary/20 shadow-xl shadow-primary/10">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-3xl font-bold tracking-tight text-primary">Jogar UNO</CardTitle>
          <CardDescription className="text-base mt-2">
            Crie uma sala para jogar com amigos ou entre em uma existente.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <CreateRoomButton />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted-foreground/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Ou</span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium mb-2 text-center text-muted-foreground">Entrar com Código</h3>
            <JoinRoomForm />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
