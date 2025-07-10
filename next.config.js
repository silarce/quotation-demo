// 使import路徑大小寫敏感
// https://www.npmjs.com/package/case-sensitive-paths-webpack-plugin
CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');


const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

// =====================================================
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
  images: {
    unoptimized: true,
    // domains: ["sanjeou-erp-be.caprover.credot-web.com"],
  },
  env: {
    DEPLOY_TIME: dayjs().tz("Asia/Taipei").format("YYYY-MM-DD HH:mm:ss"), // 設置部屬時間為環境變數
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
  // productionBrowserSourceMaps:true,
  webpack: (config) => {
    // 使import路徑大小寫敏感
    config.plugins.push(new CaseSensitivePathsPlugin());

    return config;
  },
  // 設置transpilePackages使轉譯正常
  // https://juejin.cn/post/7441094982978207784
  // https://github.com/vercel/next.js/issues/58817
    transpilePackages: [
    // antd & deps
    '@ant-design',
    '@rc-component',
    'antd',
    'rc-cascader',
    'rc-checkbox',
    'rc-collapse',
    'rc-dialog',
    'rc-drawer',
    'rc-dropdown',
    'rc-field-form',
    'rc-image',
    'rc-input',
    'rc-input-number',
    'rc-mentions',
    'rc-menu',
    'rc-motion',
    'rc-notification',
    'rc-pagination',
    'rc-picker',
    'rc-progress',
    'rc-rate',
    'rc-resize-observer',
    'rc-segmented',
    'rc-select',
    'rc-slider',
    'rc-steps',
    'rc-switch',
    'rc-table',
    'rc-tabs',
    'rc-textarea',
    'rc-tooltip',
    'rc-tree',
    'rc-tree-select',
    'rc-upload',
    'rc-util',
  ]

};
