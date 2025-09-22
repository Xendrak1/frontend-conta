import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // ❌ Ignora los errores de ESLint en build
    ignoreDuringBuilds: true,
  },
  // Despliegue en App Service usando runtime standalone (node server.js)
  output: 'standalone',
  // trailingSlash: true,
  images: {
    unoptimized: true,
  },
  /* config options here */
};

export default nextConfig;
