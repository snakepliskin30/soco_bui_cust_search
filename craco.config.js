module.exports = {
  webpack: {
    configure: {
      output: {
        filename: "static/js/[name].js",
      },
      optimization: {
        runtimeChunk: false,
        splitChunks: {
          chunks(chunk) {
            return false;
          },
        },
      },
    },
  },
  plugins: [
    {
      plugin: {
        overrideWebpackConfig: ({ webpackConfig }) => {
          const miniCssExtractPluginIndex = webpackConfig.plugins.findIndex(
            (plugin) => plugin.constructor.name === "MiniCssExtractPlugin"
          );

          if (miniCssExtractPluginIndex > -1) {
            webpackConfig.plugins[miniCssExtractPluginIndex].options.filename =
              "static/css/[name].css";
          }

          return webpackConfig;
        },
      },
      options: {},
    },
  ],
};
