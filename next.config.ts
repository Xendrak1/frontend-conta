import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // ❌ Ignora los errores de ESLint en build
    ignoreDuringBuilds: true,
  },
  // Comentamos temporalmente la exportación estática para que funcione con rutas dinámicas
  // output: 'export',
  // trailingSlash: true,
  images: {
    unoptimized: true,
  },
  /* config options here */
};

export default nextConfig;
