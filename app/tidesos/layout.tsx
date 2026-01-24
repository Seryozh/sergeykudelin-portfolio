import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TidesOS v2.4 | NightOps Agent",
  description: "Night Operations voice assistant powered by TidesOS",
};

export default function TidesOSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
