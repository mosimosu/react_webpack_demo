const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "development", //有其它模式可以選，非必填
  entry: "./src/index.js", //必須指向 index.js 這個進入點
  output: {
    path: path.resolve(__dirname, "dist"), //要解析的檔案
    filename: "main.js", //輸出的檔名
  },
  // 任何有新的 Loader 官方都會提供一個 module rules ，就把它加在這裡
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, //找到符合這個型態的資料夾名稱
        exclude: /node_modules/, //在這個資料夾裡面
        use: {
          loader: "babel-loader",
          options: { presets: ["@babel/preset-env", "@babel/preset-react"] },
        }, //使用 babel-loader 解析
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: "./index.html",
    }),
    new webpack.HotModuleReplacementPlugin(), //啟用 HMR 外掛
  ],
  // web server 配置，設定完就可以即時看到做的任何修改
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },

    compress: true,
    port: 9000,
    hot: true, //啟用 HMR
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
};
