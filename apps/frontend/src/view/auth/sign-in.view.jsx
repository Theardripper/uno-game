// @ts-check
"use client";

import { FadeIn } from "@/components/motion/fade-in";
import { Badge } from "@/components/ui/badge";
import { SignInForm } from "@/features/auth/sign-in";
import Image from "next/image";
import Link from "next/link";
import React from "react";

/**
 * Renderiza a visualização completa da página de Login.
 * Compõe o background visual e o formulário (Split-screen).
 *
 * @returns {React.ReactElement}
 */
export function SignInView() {
  return (
    <div className="relative flex-1 flex overflow-hidden w-full shadow-2xl font-(family-name:--font-rubik) bg-auth-background">
      {/* Lado Esquerdo - Decorativo */}
      <div className="hidden lg:flex lg:w-[60%] relative flex-col justify-end p-8 md:p-12 border-r border-white/5">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/background-initials-pages.jpg"
            alt="UNO Cards Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Decorative Glass Card */}
         <div className="relative z-10 p-8 rounded-3xl bg-auth-glass backdrop-blur-md w-full max-w-150 shadow-2xl">
                  <Badge className="mb-4">
                    SEASON 01
                  </Badge>
                  <h1 className="text-4xl md:text-5xl text-white leading-[1.1] mb-6 font-(family-name:--font-baloo) font-bold">
                    Domine a Arena com<br />sua Habilidade
                  </h1>
                  <p className="text-sm text-gray-300 mb-8 max-w-[90%] leading-relaxed font-(family-name:--font-rubik)">
                    Jogue UNO online com amigos ou contra o computador. Participe de torneios, suba no ranking e mostre que você é o verdadeiro mestre do UNO!
                  </p>

                  {/* Carousel Dots */}
                  <div className="flex gap-2 items-center">
                    <div className="w-6 h-1.5 rounded-full bg-auth-accent" />
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                  </div>
                </div>
      </div>

      {/* Lado Direito - Formulário */}
       <div className="w-full lg:w-[40%] flex flex-col justify-center items-center relative z-10 bg-auth-background">
        <FadeIn yOffset={30} duration={0.6} className="w-full max-w-140">

          {/* Card com borda para o form (conforme Image  m 2) */}
          <div className="w-full rounded-2xl border border-white/10 p-6 shadow-xl bg-auth-background">
            <div className="text-center mb-10">
              <h2 className="text-3xl text-white mb-2 font-(family-name:--font-baloo) font-bold tracking-wide">
                Bem-vindo de Volta!!!
              </h2>
              <p className="text-sm text-gray-300 font-normal font-(family-name:--font-rubik)">
                logue com suas credenciais
              </p>
            </div>

            <SignInForm />
          </div>

          <div className="mt-8 text-center text-sm font-(family-name:--font-rubik)">
            <span className="text-gray-400">Novo por aqui? </span>
            <Link
              href="/sign-up"
              className="font-bold text-auth-link hover:underline transition-colors"
            >
              Crie uma conta
            </Link>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
