import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DoorLoop | Candidate AI Agent",
  description: "AI-powered voice assistant for DoorLoop candidate evaluation",
};

export default function DoorLoopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
