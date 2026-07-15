"use client";

import { useEffect, useRef } from "react";
import { classifyAcquisition, track } from "./analytics";

type TrackPageViewProps = {
  pageType: "portfolio" | "case" | "brief" | "resume";
  caseId?: string;
};

export function TrackPageView({ pageType, caseId }: TrackPageViewProps) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    const params = new URLSearchParams(window.location.search);
    const base = {
      path: window.location.pathname,
      acquisition_source: classifyAcquisition(params, document.referrer),
      utm_content: params.get("utm_content") ?? undefined,
    };

    if (pageType === "case" && caseId) {
      track("case_view", {
        case_id: caseId,
        entry_surface: base.acquisition_source,
      });
      return;
    }

    if (pageType === "brief") {
      track("brief_view", { entry_surface: base.acquisition_source });
      return;
    }

    if (pageType === "resume") {
      track("resume_open", { entry_surface: base.acquisition_source });
      return;
    }

    track("portfolio_view", base);
  }, [caseId, pageType]);

  return null;
}
