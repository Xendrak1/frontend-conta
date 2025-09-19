import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // ❌ Ignora los errores de ESLint en build
    ignoreDuringBuilds: true,
  },
  /* config options here */
};

export default nextConfig;
