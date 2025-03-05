// 使import路徑大小寫敏感
// https://www.npmjs.com/package/case-sensitive-paths-webpack-plugin
CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

// const moment = require('moment');
const moment = require('moment-timezone');


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
  env: {
    DEPLOY_TIME: moment().tz("Asia/Taipei").format("YYYY-MM-DD HH:mm:ss"), // 設置部屬時間為環境變數
  },
};

module.exports = {
  ...nextConfig,
  future: {
    webpack5: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    // 使import路徑大小寫敏感
    config.plugins.push(new CaseSensitivePathsPlugin());

    return config;
  },
  
};
