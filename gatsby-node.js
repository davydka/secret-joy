exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: /\.fbx$/,
          use: [`url-loader`],
        },
        {
          test: /\.gltf$/,
          use: [`url-loader`],
        },
        {
          test: /\.glb$/,
          use: [`url-loader`],
        },
        {
          test: /\.mdd$/,
          use: [`url-loader`],
        },
        {
          test: /\.obj$/,
          use: [`url-loader`],
        },
      ],
    },
  });
};
