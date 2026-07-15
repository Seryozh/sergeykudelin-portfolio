import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/journey.html", destination: "/work/futureclinic", permanent: true },
      { source: "/creators-showcase.html", destination: "/work/futureclinic", permanent: true },
      { source: "/outreach-showcase.html", destination: "/work/futureclinic", permanent: true },
      { source: "/resume.html", destination: "/resume", permanent: true },
      { source: "/resume.pdf", destination: "/sergey-kudelin-resume.pdf", permanent: true },
      { source: "/recommendation.pdf", destination: "/futureclinic-recommendation.pdf", permanent: true },
    ];
  },
};

export default nextConfig;
