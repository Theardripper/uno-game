"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { socketClient } from "@/socket/socket-client";
import { useAuthStore } from "@/store/auth/auth.store";
import { useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.actions.logout);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    Cookies.remove("accessToken", { path: "/" });
    queryClient.clear();
    socketClient.disconnect();
    router.push("/sign-in");
  };

  // Esconder o header na página do jogo (deve estar DEPOIS de todos os hooks)
  if (pathname?.startsWith("/game")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4 md:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary text-primary-foreground font-black p-1.5 px-3 rounded text-xl tracking-tighter">
              UNO
            </div>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {!mounted ? null : isAuthenticated ? (
            <>
              <Link href="/lobby" className="transition-colors hover:text-foreground/80">Lobby</Link>
              <Link href="/profile" className="transition-colors hover:text-foreground/80">Perfil</Link>
              <Button onClick={handleLogout} variant="outline" className="ml-4">Sair</Button>
            </>
          ) : (
            <>
              <Link href="/sandbox" className="transition-colors hover:text-foreground/80">Sandbox</Link>
              <div className="flex items-center gap-2 ml-4">
                <Button variant="outline" onClick={() => router.push("/sign-in")}>Entrar</Button>
                <Button onClick={() => router.push("/sign-up")}>Jogar</Button>
              </div>
            </>
          )}
        </nav>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              }
            />
            <SheetContent side="right">
              <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
              <div className="flex flex-col gap-6 mt-8">
                {!mounted ? null : isAuthenticated ? (
                  <>
                    <Link href="/lobby" className="text-lg font-medium transition-colors hover:text-primary">Lobby</Link>
                    <Link href="/profile" className="text-lg font-medium transition-colors hover:text-primary">Perfil</Link>
                    <Button onClick={handleLogout} variant="outline" className="w-full mt-4">Sair</Button>
                  </>
                ) : (
                  <>
                    <Link href="/sandbox" className="text-lg font-medium transition-colors hover:text-primary">Sandbox</Link>
                    <div className="flex flex-col gap-3 mt-4">
                      <Button variant="outline" className="w-full" onClick={() => router.push("/sign-in")}>Entrar</Button>
                      <Button className="w-full" onClick={() => router.push("/sign-up")}>Jogar</Button>
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
