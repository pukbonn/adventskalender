module.exports = {
  // ...
  module: {
    rules: [
      // ...
      {
        // make all imported images to have max width 1000px
        test: /\.(png|jpe?g|webp|tiff?)$/i,
        use: [
          {
            loader: "webpack-image-resize-loader",
            options: {
              width: 1000,
            },
          },
        ],
      },
    ],
  },
};

