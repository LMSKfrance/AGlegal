import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbopackUseSystemTlsCerts: true,
  },
  serverExternalPackages: ["@libsql/client"],
};

export default nextConfig;
