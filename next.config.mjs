/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV !== "production";

const cspHeader = `
  default-src 'self';

  script-src
    'self'
    'unsafe-inline'
    ${isDev ? "'unsafe-eval'" : ""}
    https://www.googletagmanager.com
    https://*.googletagmanager.com
    https://*.google-analytics.com
    https://*.analytics.google.com
    https://www.googleadservices.com
    https://googleads.g.doubleclick.net
    https://www.google.com
    https://maps.googleapis.com;

  script-src-elem
    'self'
    'unsafe-inline'
    ${isDev ? "'unsafe-eval'" : ""}
    https://www.googletagmanager.com
    https://*.googletagmanager.com
    https://*.google-analytics.com
    https://www.googleadservices.com
    https://googleads.g.doubleclick.net
    https://maps.googleapis.com;

  style-src
    'self'
    'unsafe-inline'
    https://fonts.googleapis.com
    https://maps.googleapis.com;

  img-src
    'self'
    blob:
    data:
    https://res.cloudinary.com
    https://*.supabase.co
    https://maps.gstatic.com
    https://maps.googleapis.com
    https://*.googleapis.com
    https://*.gstatic.com
    https://*.google-analytics.com
    https://*.googletagmanager.com
    https://*.g.doubleclick.net
    https://www.google.com
    https://www.googleadservices.com
    https://pagead2.googlesyndication.com;

  font-src
    'self'
    data:
    https://fonts.gstatic.com
    https://maps.gstatic.com;

  connect-src
    'self'
    https://res.cloudinary.com
    https://api.cloudinary.com
    https://*.supabase.co
    https://maps.googleapis.com
    https://maps.gstatic.com
    https://*.googleapis.com
    https://*.gstatic.com
    https://*.google-analytics.com
    https://*.analytics.google.com
    https://*.googletagmanager.com
    https://googleads.g.doubleclick.net
    https://www.googleadservices.com;

  frame-src
    'self'
    https://www.googletagmanager.com
    https://www.google.com
    https://googleads.g.doubleclick.net
    https://www.google.com
    https://www.google.com/maps
    https://maps.google.com;

  object-src 'none';
  base-uri 'self';
  form-action 'self';

  frame-ancestors
    'self'
    https://www.google.com
    https://search.google.com;
`;

const nextConfig = {
  poweredByHeader: false,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "maps.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "maps.googleapis.com",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/sitemap.xml",
        headers: [
          {
            key: "Content-Type",
            value: "application/xml; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=3600",
          },
        ],
      },
      {
        source: "/((?!sitemap\\.xml$).*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader
              .replace(/\n/g, "")
              .replace(/\s{2,}/g, " ")
              .trim(),
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
