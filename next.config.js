// 使import路徑大小寫敏感
// https://www.npmjs.com/package/case-sensitive-paths-webpack-plugin
CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');


// =====================================================
// react-pdf用的
// pdf.worker.js會在編譯後not found
// 因此使用這個方案處理
// (非常不確定)似乎是用CopyPlugin把pdf.worker.js複製一份出來
// 然後放進public裡面
// 使用pdfjs時再做下面的設定 (應該是指到public裡面)
// pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
const path = require('path')
const CopyPlugin = require("copy-webpack-plugin");

const pdfWorkerPath = require.resolve(
  `pdfjs-dist/build/pdf.worker${process.env.NODE_ENV === "development" ? ".min" : ""
}.js`
);
// =====================================================
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = {
  ...nextConfig,
  future: {
    webpack5: true
  },
  webpack: (config) => {
    // 使import路徑大小寫敏感
    config.plugins.push(new CaseSensitivePathsPlugin())

    // react-pdf用的
    // load worker files as a urls with `file-loader`
    config.module.rules.unshift({
      test: /pdf\.worker\.(min\.)?js/,
      use: [
        {
          loader: "file-loader",
          options: {
            name: "[contenthash].[ext]",
            publicPath: "_next/static/worker",
            outputPath: "static/worker"
          }
        }
      ]
    });


    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: pdfWorkerPath,
            to: path.join(__dirname, 'public'),
          },
        ],
      })
    );


    return config
  },
}
