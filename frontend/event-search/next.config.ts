import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Fix so the server will trust images provided by serpapi*/
  images: {
    remotePatterns: [
      {
        protocol: 'https', 
        hostname: 'encrypted-tbn0.gstatic.com', 
        port: '', 
        pathname: '/**', 
        
      },
      {
        protocol: 'https', 
        hostname: 'www.google.com', 
        port: '', 
        pathname: '/**', 
        
      },
    ],
  },
};

export default nextConfig;
