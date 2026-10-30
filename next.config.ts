import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker imajı için minimal, kendi kendine yeten çıktı üretir
  output: 'standalone',
};

export default nextConfig;
