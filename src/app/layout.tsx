import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://learnplus-five.vercel.app";

export const metadata: Metadata = {
  title: "Learn Plus",
  description: "An online learning management system",
  metadataBase: new URL(SITE_URL),

  openGraph: {
    title: "Learn Plus - Online Learning Management System",
    description:
      "Transform your learning experience with Learn Plus. Access courses, track progress, and achieve your educational goals.",
    url: SITE_URL,
    siteName: "Learn Plus",
    images: [
      {
        url: "https://learn-plus-bucket.s3.ap-south-1.amazonaws.com/learn-plus-card.png",
        width: 1200,
        height: 630,
        alt: "Learn Plus - Online Learning Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Learn Plus - Online Learning Management System",
    description:
      "Transform your learning experience with Learn Plus. Access courses, track progress, and achieve your educational goals.",
    images: [
      "https://learn-plus-bucket.s3.ap-south-1.amazonaws.com/learn-plus-card.png",
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
  themeColor: "#000000",
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
