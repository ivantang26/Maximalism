import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return [{ source: "/exhibitions/more", destination: "/more", permanent: true }];
  },
};

export default nextConfig;
