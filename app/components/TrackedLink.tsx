"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import {
  track,
  type PortfolioEventName,
  type PortfolioEventProperties,
} from "./analytics";

type TrackedLinkProps = ComponentProps<typeof Link> & {
  eventName: PortfolioEventName;
  eventProperties?: PortfolioEventProperties;
};

export function TrackedLink({
  eventName,
  eventProperties = {},
  onClick,
  ...props
}: TrackedLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    track(eventName, eventProperties);
    onClick?.(event);
  }

  return <Link {...props} onClick={handleClick} />;
}
