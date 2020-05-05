const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isProd = process.env.prod;

module.exports = {
  entry: "./src/App.tsx",
  mode: isProd ? "production" : "development",
  module: {
    rules: [
      {
        test: /\.m?[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: true,
            },
          },
          "css-loader",
        ],
      },
    ],
  },
  output: {
    filename: "app.js",
    path: path.resolve(__dirname, "dist"),
  },
  optimization: {
    usedExports: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, "dist", "index.html"),
      template: "./src/index.html",
    }),
    new MiniCssExtractPlugin(),
  ],
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9000,
    open: true
  },
};
