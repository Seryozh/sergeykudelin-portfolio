import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://sergeykudelin.com"),
  title: {
    default: "Sergey Kudelin - Growth Engineer",
    template: "%s | Sergey Kudelin",
  },
  description:
    "Growth engineer working across product, GTM, and AI. Case studies from FutureClinic and Fyxed.",
  applicationName: "Sergey Kudelin",
  authors: [{ name: "Sergey Kudelin", url: "https://sergeykudelin.com" }],
  creator: "Sergey Kudelin",
  openGraph: {
    type: "website",
    siteName: "Sergey Kudelin",
    title: "Sergey Kudelin - Growth Engineer",
    description:
      "Product-minded growth work at FutureClinic and Fyxed, with the actual systems behind it.",
    url: "https://sergeykudelin.com",
  },
  twitter: {
    card: "summary",
    title: "Sergey Kudelin - Growth Engineer",
    description:
      "Product-minded growth work at FutureClinic and Fyxed, with the actual systems behind it.",
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
