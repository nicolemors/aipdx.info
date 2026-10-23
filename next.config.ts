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
    localPatterns: [
      { pathname: "/images/**" },
      { pathname: "/api/stories/**" },
      { pathname: "/api/notion/blocks/**" },
    ],
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
    // Notion's own uploaded files (Feature Image, Gallery, Logo, body
    // images — the prod-files-secure.s3... URLs) are pre-signed and expire
    // after ~1 hour. Once the optimizer successfully fetches one, cache the
    // optimized result for a year so it's never re-fetched from that
    // expiring URL again — otherwise a page that goes a while between
    // visits gets a stale expired URL baked into its cached HTML, and the
    // very next optimization attempt 403s, showing a broken image until a
    // revalidation happens to land on a request that fetches a fresh URL.
    minimumCacheTTL: 31536000,
  },
};

export default nextConfig;
