import type { Metadata } from "next";
import { SergeyPortfolio, type SiteContent } from "./components/SergeyPortfolio";
import siteContent from "@/content/site.json";

export const metadata: Metadata = {
  title: { absolute: "Sergey Kudelin | Product vision and build" },
  description: "Product judgment at Fyxed and FutureClinic.",
};

export default function Home() {
  const content: SiteContent = siteContent;
  return <SergeyPortfolio content={content} />;
}
