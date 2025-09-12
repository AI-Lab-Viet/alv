import NavBarWrapper from "@/components/nav-bar-wrapper";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/auth-context";
import { ChatSessionProvider } from "@/contexts/chat-session-context";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import type React from "react";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "AI Skill Hub - Trung tâm Kỹ năng AI",
  description:
    "Nền tảng học tập toàn diện giúp bạn phát triển 4 kỹ năng cốt lõi: Đặt câu hỏi hiệu quả, Tư duy phản biện, Sáng tạo và Đạo đức AI.",
  generator: "evergard3n",
};

export const dynamic = "force-dynamic";
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <html
      lang="vi"
      className={`${inter.variable} ${spaceGrotesk.variable} antialiased h-full`}
    >
      <body className="font-sans h-full overflow-hidden">
        {" "}
        <AuthProvider userId={user?.id ?? null}>
          <ChatSessionProvider>
            <NavBarWrapper>{children}</NavBarWrapper>
            <Toaster position="top-right" />
          </ChatSessionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
