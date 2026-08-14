import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Autorise l'accès aux ressources de dev depuis le réseau local (HMR sur mobile/autre machine)
  allowedDevOrigins: ["192.168.1.*"],
};

export default nextConfig;
