"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { useState } from "react";

/**
 * @typedef {Object} SignInFormProps
 * @property {string} [className]
 */

import { useSignIn } from "../model/use-sign-in";

/**
 * Renderiza o formulário visual de Login com base no Figma.
 *
 * @param {SignInFormProps} props
 * @returns {React.JSX.Element}
 */
export function SignInForm({ className }) {
  const [showPassword, setShowPassword] = useState(false);
  const { handleLogin, isLoading } = useSignIn();

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    handleLogin({ email, password });
  };

  return (
    <div className={cn("flex flex-col gap-6 w-full font-(family-name:--font-rubik)", className)}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Email Field */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="text-[11px] font-medium text-gray-300 uppercase tracking-wider pl-1">
            E-mail
          </Label>
          <div className="relative">
            <div className="absolute left-3 top-0 h-full flex items-center justify-center pointer-events-none text-gray-400">
              <User className="size-4" />
            </div>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="player@example.com"
              autoComplete="email"
              required
              disabled={isLoading}
              className="pl-10"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="password" className="text-[11px] font-medium text-gray-300 uppercase tracking-wider pl-1">
            Senha
          </Label>
          <div className="relative">
            <div className="absolute left-3 top-0 h-full flex items-center justify-center pointer-events-none text-gray-400">
              <Lock className="size-4" />
            </div>
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••••••••••"
              required
              disabled={isLoading}
              className="pl-10 pr-10 font-[family-name:var(--font-jetbrains-mono)] tracking-widest"
            />
            <button
              type="button"
              className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-white transition-colors flex items-center justify-center rounded-r-lg"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="size-4" aria-hidden="true" />
              ) : (
                <Eye className="size-4" aria-hidden="true" />
              )}
            </button>
          </div>
          <div className="flex justify-end mt-1">
            <a
              href="#"
              className="text-[10px] text-gray-400 hover:text-white transition-colors uppercase tracking-widest"
              tabIndex={-1}
            >
              Esqueceu a senha?
            </a>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-col gap-3 mt-4">
          <Button
            type="submit"
            disabled={isLoading}
            variant="accent"
            size="xl"
            fullWidth
          >
            Entrar na arena
          </Button>

          <Button
            type="button"
            variant="glass"
            size="xl"
            fullWidth
            disabled={isLoading}
          >
            Continuar como Guest
          </Button>
        </div>
      </form>
    </div>
  );
}
