import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sergey Kudelin | AI Solutions Engineer",
  description: "Building autonomous systems and agentic frameworks for high-pressure environments.",
  icons: {
    icon: "/favicon-sk.svg",
  },
  openGraph: {
    title: "Sergey Kudelin | AI Solutions Engineer",
    description: "Architecting the future of AI Operations. Building autonomous systems, voice agents, and agentic frameworks.",
    url: "https://sergeykudelin.com",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sergey Kudelin - AI Solutions Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sergey Kudelin | AI Solutions Engineer",
    description: "Building autonomous systems and agentic frameworks.",
    images: ["/og-image.png"],
    creator: "@SergeRoblox",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
