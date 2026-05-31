import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import { CloudSync } from "@/components/CloudSync";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Quiet Task",
  description: "頭を静かに整理するタスク管理",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={inter.variable}>
      <body className="font-sans">
        <CloudSync />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
