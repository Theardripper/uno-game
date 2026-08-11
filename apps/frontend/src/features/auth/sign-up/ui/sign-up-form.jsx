"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/helpers/cn";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { signUpSchema } from "../model/sign-up.schema";

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
  const { handleRegister, isLoading } = useSignUp();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = (data) => {
    // Only pass what the backend needs
    const { confirmPassword, ...payload } = data;
    handleRegister(payload);
  };

  return (
    <div className={cn("flex flex-col gap-6 w-full font-(family-name:--font-rubik)", className)}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
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
              type="text"
              placeholder="player"
              autoComplete="username"
              disabled={isLoading}
              aria-invalid={!!errors.name}
              className={cn("pl-10", errors.name && "border-red-500")}
              {...register("name")}
            />
          </div>
          {errors.name && (
            <p className="text-red-500 text-xs pl-1">{errors.name.message}</p>
          )}
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
              type="email"
              placeholder="player@example.com"
              autoComplete="email"
              disabled={isLoading}
              aria-invalid={!!errors.email}
              className={cn("pl-10", errors.email && "border-red-500")}
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs pl-1">{errors.email.message}</p>
          )}
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
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="••••••••••••••••"
                disabled={isLoading}
                aria-invalid={!!errors.password}
                className={cn(
                  "pl-10 pr-10 font-(family-name:--font-jetbrains-mono) tracking-widest",
                  errors.password && "border-red-500"
                )}
                {...register("password")}
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
            {errors.password && (
              <p className="text-red-500 text-xs pl-1">{errors.password.message}</p>
            )}
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
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="••••••••••••••••"
                disabled={isLoading}
                aria-invalid={!!errors.confirmPassword}
                className={cn(
                  "pl-10 pr-10 font-(family-name:--font-jetbrains-mono) tracking-widest",
                  errors.confirmPassword && "border-red-500"
                )}
                {...register("confirmPassword")}
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
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs pl-1">{errors.confirmPassword.message}</p>
            )}
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
