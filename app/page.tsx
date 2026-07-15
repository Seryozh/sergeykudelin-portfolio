import type { Metadata } from "next";
import {
  DecisionTracePortfolio,
  type SiteContent,
} from "./components/DecisionTracePortfolio";
import siteContent from "@/content/site.json";

export const metadata: Metadata = {
  title: { absolute: "Sergey Kudelin — Decision Trace" },
  description:
    "A living design-system prototype for a portfolio about product judgment, evidence, and the decisions behind shipped work.",
};

export default function Home() {
  const publicContent = {
    system: siteContent.system,
    hero: siteContent.hero,
    cases: siteContent.cases,
    flows: siteContent.flows,
  } as SiteContent;

  return <DecisionTracePortfolio content={publicContent} />;
}
