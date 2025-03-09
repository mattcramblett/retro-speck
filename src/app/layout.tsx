import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { LayoutHeader } from "@/components/brand/layout-header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Retro Speck",
  description: "Team restrospectives",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="theme-custom overflow-hidden h-full">
      <body className={cn(
        "min-h-screen font-sans antialiased overflow-y-scroll h-full flex flex-col flex-1",
          geistSans.variable
      )}>
        <Providers>
          <LayoutHeader />
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  )
}
