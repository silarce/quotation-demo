// 使import路徑大小寫敏感
// https://www.npmjs.com/package/case-sensitive-paths-webpack-plugin
CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');


// =====================================================
const path = require('path');
// =====================================================
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
    // domains: ["sanjeou-erp-be.caprover.credot-web.com"],
  },
}

module.exports = {
  ...nextConfig,
  future: {
    webpack5: true
  },
  webpack: (config) => {
    // 使import路徑大小寫敏感
    config.plugins.push(new CaseSensitivePathsPlugin())
    return config
  },
}
