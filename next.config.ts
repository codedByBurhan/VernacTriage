import type { NextConfig } from "next";

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://*.vercel-scripts.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https://img.shields.io https://vercel.live https://vercel.com;
  font-src 'self' data: https://fonts.gstatic.com;
  connect-src 'self' https://generativelanguage.googleapis.com https://vercel.live https://*.vercel-insights.com https://*.vercel-scripts.com https://*.pusher.com wss://ws-*.pusher.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'self' https://vercel.live https://*.vercel.app;
`.replace(/\s{2,}/g, " ").trim();

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader,
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
