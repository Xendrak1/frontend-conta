import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // ❌ Ignora los errores de ESLint en build
    ignoreDuringBuilds: true,
  },
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  /* config options here */
};

export default nextConfig;
