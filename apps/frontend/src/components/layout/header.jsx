"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
          <Link href="/lobby" className="transition-colors hover:text-foreground/80">Lobby</Link>
          <Link href="/sandbox" className="transition-colors hover:text-foreground/80">Sandbox</Link>
          <div className="flex items-center gap-2 ml-4">
            <Button variant="outline">Entrar</Button>
            <Button>Jogar</Button>
          </div>
        </nav>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="md:hidden" />
              }
            >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
              <div className="flex flex-col gap-6 mt-8">
                <Link href="/lobby" className="text-lg font-medium transition-colors hover:text-primary">Lobby</Link>
                <Link href="/sandbox" className="text-lg font-medium transition-colors hover:text-primary">Sandbox</Link>
                <div className="flex flex-col gap-3 mt-4">
                  <Button variant="outline" className="w-full">Entrar</Button>
                  <Button className="w-full">Jogar</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
