import type { Metadata } from "next";
import { Noto_Sans_Adlam } from "next/font/google";
import localFont from "next/font/local";
import { Toaster } from "sonner";

import { BreakpointIndicator } from "@/components/breakpoint-indicator";
import { QueryProvider } from "@/contexts/query-provider";
import { SessionProvider } from "@/contexts/session-provider";
import { ThemeProvider } from "@/contexts/theme-provider";
import { validateRequest } from "@/lib/lucia";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const inter = Noto_Sans_Adlam({ subsets: ["adlam"] });

export const metadata: Metadata = {
  title: "LearnPlus",
  description: "Learn Plus an online learning management system",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sessionData = await validateRequest();

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <SessionProvider value={sessionData}>
              <div className="relative flex min-h-screen flex-col overflow-hidden">
                {children}
              </div>
            </SessionProvider>
            <BreakpointIndicator />
            <Toaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
