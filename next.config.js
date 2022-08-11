// 使import路徑大小寫敏感
// https://www.npmjs.com/package/case-sensitive-paths-webpack-plugin
CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
	loader: 'akamai',
	path: '/',
  },
}

module.exports = {
  ...nextConfig,
  webpack: (config) => {
    config.plugins.push(new CaseSensitivePathsPlugin())
    return config
  },
}
