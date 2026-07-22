import { AppProviders } from "@/providers/app-providers";
import { Geist } from "next/font/google";

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
      <body className="min-h-full flex flex-col antialiased">
        <AppProviders> {children} </AppProviders>
      </body>
    </html>
  );
}
