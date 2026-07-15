export type PortfolioEventName =
  | "portfolio_view"
  | "case_view"
  | "case_artifact_select"
  | "case_boundary_view"
  | "proof_open"
  | "resume_open"
  | "resume_pdf_open"
  | "contact_click"
  | "brief_view"
  | "external_profile_open";

export type PortfolioEventProperties = Record<
  string,
  string | number | boolean | undefined
>;

declare global {
  interface Window {
    portfolioTrack?: (
      name: PortfolioEventName,
      properties: PortfolioEventProperties,
    ) => void;
  }
}

export function classifyAcquisition(params: URLSearchParams, referrer: string) {
  const source = params.get("utm_source");
  const medium = params.get("utm_medium");

  if (source === "linkedin" && medium === "profile") return "linkedin_profile";
  if (source === "linkedin") return "linkedin_post";

  if (!referrer) return "direct";

  try {
    const host = new URL(referrer).hostname;
    if (host.endsWith("linkedin.com")) return "linkedin_profile";
    if (host === window.location.hostname) return "direct";
  } catch {
    return "direct";
  }

  return "referral";
}

export function track(
  name: PortfolioEventName,
  properties: PortfolioEventProperties = {},
) {
  if (typeof window === "undefined") return;

  const detail = { name, properties };
  window.dispatchEvent(new CustomEvent("portfolio:track", { detail }));
  window.portfolioTrack?.(name, properties);

  if (process.env.NODE_ENV === "development") {
    console.info("[portfolio]", name, properties);
  }
}
