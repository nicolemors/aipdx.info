import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/ai-portland-team",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/contact-ai-portland",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/calendar",
        destination: "/events",
        permanent: true,
      },
    ];
  },
  images: {
    // Sponsor/partner logos are "external" Notion files — links to whatever
    // domain that org happens to host its own logo on (kiln.com,
    // prosperportland.us, ...). That list can't be known ahead of time, and
    // enumerating hostnames means every new sponsor/partner on an unseen
    // domain 500s the page until a developer adds it and redeploys — which
    // defeats the point of managing this content in Notion with no code
    // changes. Notion's own uploaded files (S3-backed), Luma's og:image
    // fallback, YouTube thumbnails, and Google avatars all also come through
    // this same wildcard.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
