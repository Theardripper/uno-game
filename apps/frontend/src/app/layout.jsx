import { AppProviders } from "@/providers/app-providers";
import { Baloo_2, JetBrains_Mono, Rubik } from "next/font/google";

import "@styles/globals.css";

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
});

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "UNO",
  description: "UNO Game",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br" className={`${baloo.variable} ${rubik.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
          <AppProviders>
            <main className="flex-1 mx-auto w-full flex flex-col">
              {children}
            </main>
          </AppProviders>
      </body>
    </html>
  );
}
