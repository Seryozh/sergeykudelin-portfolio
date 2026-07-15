import type { Metadata } from "next";
import "./globals.css";
import "./studio.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://sergeykudelin.com"),
  title: {
    default: "Sergey Kudelin - Growth Engineer",
    template: "%s | Sergey Kudelin",
  },
  description:
    "Growth Engineer in Miami. Case files on FutureClinic Creators and current product and GTM work at Fyxed.",
  applicationName: "Sergey Kudelin",
  authors: [{ name: "Sergey Kudelin", url: "https://sergeykudelin.com" }],
  creator: "Sergey Kudelin",
  openGraph: {
    type: "website",
    siteName: "Sergey Kudelin",
    title: "Sergey Kudelin - Growth Engineer",
    description:
      "Case files on FutureClinic Creators and current product and GTM work at Fyxed.",
    url: "https://sergeykudelin.com",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Sergey Kudelin portfolio case file",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sergey Kudelin - Growth Engineer",
    description:
      "Case files on FutureClinic Creators and current product and GTM work at Fyxed.",
    images: ["/og.png"],
  },
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
