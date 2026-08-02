"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppToast } from "@/hooks/use-app-toast";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import React, { useState } from "react";

/**
 * @typedef {Object} SignUpFormProps
 * @property {string} [className]
 */

import { useSignUp } from "../model/use-sign-up";

/**
 * Renderiza o formulário visual de Cadastro com base no Figma.
 *
 * @param {SignUpFormProps} props
 * @returns {React.ReactElement}
 */
export function SignUpForm({ className }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { error } = useAppToast();
  const { handleRegister, isLoading } = useSignUp();

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password !== confirmPassword) {
      error("As senhas não coincidem. Por favor, verifique.");
      return;
    }

    handleRegister({ name, email, password });
  };

  return (
    <div className={cn("flex flex-col gap-6 w-full font-[family-name:var(--font-rubik)]", className)}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Username Field */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="name" className="text-[11px] font-medium text-gray-300 uppercase tracking-wider pl-1">
            Username
          </Label>
          <div className="relative">
            <div className="absolute left-3 top-0 h-full flex items-center justify-center pointer-events-none text-gray-400">
              <User className="size-4" />
            </div>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="player"
              autoComplete="username"
              required
              disabled={isLoading}
              className="pl-10"
            />
          </div>
        </div>

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

        {/* Password Fields - Side by Side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Password */}
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
                autoComplete="new-password"
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
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="confirmPassword" className="text-[11px] font-medium text-gray-300 uppercase tracking-wider pl-1">
              Confirme a senha
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-0 h-full flex items-center justify-center pointer-events-none text-gray-400">
                <Lock className="size-4" />
              </div>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="••••••••••••••••"
                required
                disabled={isLoading}
                className="pl-10 pr-10 font-[family-name:var(--font-jetbrains-mono)] tracking-widest"
              />
              <button
                type="button"
                className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-white transition-colors flex items-center justify-center rounded-r-lg"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Ocultar confirmação de senha" : "Mostrar confirmação de senha"}
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="size-4" aria-hidden="true" />
                ) : (
                  <Eye className="size-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-4">
          <Button
            type="submit"
            disabled={isLoading}
            variant="accent"
            size="xl"
            fullWidth
          >
            Criar conta
          </Button>
        </div>
      </form>
    </div>
  );
}
