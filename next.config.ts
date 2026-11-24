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
    // Every image is already sized ahead of time — /public photos are
    // pre-resized in the repo, and remote images (Notion, Luma, logos,
    // YouTube) are resized once into Vercel Blob (see src/lib/imageStore.ts).
    // Serving them as-is keeps the Vercel image optimizer, and its usage
    // quota, out of the path entirely.
    unoptimized: true,
  },
};

export default nextConfig;
