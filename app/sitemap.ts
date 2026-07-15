import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-07-15T00:00:00.000Z");
  const routes = ["", "/work/futureclinic", "/work/fyxed", "/resume"];

  return routes.map((path) => ({
    url: `https://sergeykudelin.com${path}`,
    lastModified,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.8,
  }));
}
