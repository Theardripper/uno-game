import { AppProviders } from "@/providers/app-providers";
import { Geist } from "next/font/google";
import { Toaster } from "@/components/ui/toast";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

import "@styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "UNO",
  description: "UNO Game",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br" className={`${geistSans.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <Toaster>
          <AppProviders>
            <Header />
            <main className="flex-1 container mx-auto px-4 md:px-8 py-8 w-full flex flex-col">
              {children}
            </main>
            <Footer />
          </AppProviders>
        </Toaster>
      </body>
    </html>
  );
}
