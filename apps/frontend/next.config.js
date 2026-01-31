// apps/frontend/next.config.js
const withNextIntl = require('next-intl/plugin')('./i18n.ts');

/** @type {import('next').NextConfig} */
const baseConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: 's3.amazonaws.com' },
    ],
  },
};

const nextConfig = withNextIntl(baseConfig);

// Fix: withNextIntl sets _next_intl_trailing_slash to undefined, so we override it
nextConfig.env = nextConfig.env || {};
nextConfig.env._next_intl_trailing_slash = 'false';

module.exports = nextConfig;
