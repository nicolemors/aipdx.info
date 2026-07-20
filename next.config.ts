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
    // Notion serves uploaded files (event photos, sponsor logos, story covers)
    // from S3-backed hosts with time-limited signed URLs. If a workspace's
    // files come from a different S3 region, add that hostname here too.
    remotePatterns: [
      { protocol: "https", hostname: "prod-files-secure.s3.us-west-2.amazonaws.com" },
      { protocol: "https", hostname: "s3.us-west-2.amazonaws.com" },
      { protocol: "https", hostname: "secure.notion-static.com" },
      { protocol: "https", hostname: "www.notion.so" },
      // Fallback event cover photos scraped from Luma's og:image when an
      // event has no Notion "Image" set — see lib/luma.ts.
      { protocol: "https", hostname: "images.lumacdn.com" },
      // Video thumbnails and channel avatar scraped from YouTube — see lib/youtube.ts.
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "yt3.googleusercontent.com" },
      // Google account avatar for a story's "Person" author, via Notion's people property.
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};

export default nextConfig;
