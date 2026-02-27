import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { env } from "@/lib/env";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = env.BETTER_AUTH_URL;

export const metadata: Metadata = {
  title: "Nexus Learn - Online Learning Platform",
  description: "An online learning management system",
  metadataBase: new URL(SITE_URL),

  openGraph: {
    title: "Nexus Learn - Online Learning Management System",
    description:
      "Transform your learning experience with Nexus Learn. Access courses, track progress, and achieve your educational goals.",
    url: SITE_URL,
    siteName: "Nexus Learn - Online Learning Platform",
    images: [
      {
        url: "https://learn-plus-bucket.s3.ap-south-1.amazonaws.com/card.png",
        width: 1200,
        height: 630,
        alt: "Nexus Learn - Online Learning Platform",
        type: "image/png",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Nexus Learn - Online Learning Platform",
    description:
      "Transform your learning experience with Nexus Learn. Access courses, track progress, and achieve your educational goals.",
    images: [
      {
        url: "https://learn-plus-bucket.s3.ap-south-1.amazonaws.com/card.png",
        width: 1200,
        height: 600,
        alt: "Nexus Learn - Online Learning Platform",
      },
    ],
    creator: "@om_2003_",
    site: "@om_2003_",
  },

  keywords: [
    "online learning",
    "education",
    "courses",
    "LMS",
    "learning management system",
  ],
  authors: [{ name: "Omprakash Mahto" }],
  category: "Education",

  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
