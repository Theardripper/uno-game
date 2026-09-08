"use client";

import { cn } from "@/helpers/cn";
import { socketClient } from "@/socket/socket-client";
import { useAuthStore } from "@/store/auth/auth.store";
import { useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { Clock, HelpCircle, Home, LayoutGrid, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV_ITEMS = [
  { icon: Home, label: "Home", href: "/lobby" },
  { icon: LayoutGrid, label: "Hub", href: "/hub" },
  { icon: Clock, label: "Histórico", href: "/historico" },
];

const BOTTOM_NAV_ITEMS = [
  { icon: Settings, label: "Configurações", href: "/configuracoes" },
  { icon: HelpCircle, label: "Ajuda", href: "/ajuda" },
];

export function GameSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.actions.logout);
  const queryClient = useQueryClient();

  const handleLogout = () => {
    logout();
    Cookies.remove("accessToken", { path: "/" });
    queryClient.clear();
    socketClient.disconnect();
    router.push("/sign-in");
  };

  return (
    <aside className="w-64 flex-shrink-0 hidden md:flex flex-col h-full bg-[#2A1B19]/50 border-r border-white/5">
      {/* Logo */}
      <div className="p-8 flex items-center justify-center">
        <Link href="/lobby">
          <div className="bg-primary text-primary-foreground font-black p-2 px-4 rounded-xl text-2xl tracking-tighter rotate-[-5deg] shadow-lg shadow-primary/20">
            UNO
          </div>
        </Link>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-medium text-sm",
                isActive
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Nav */}
      <div className="p-4 space-y-2">
        {BOTTOM_NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all font-medium text-sm"
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all font-medium text-sm"
        >
          <LogOut className="w-5 h-5" />
          Sair
        </button>
      </div>
    </aside>
  );
}
