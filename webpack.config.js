const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './index.js',
  mode: 'production',
  target: 'node',
  externals: [nodeExternals()],
  output: {
    path: path.join(__dirname),
    publicPath: '/',
    filename: 'build.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/, /mbTiles/],
        use: {
          loader: 'babel-loader',
        },
      },
      // {
      //   test: /\.scss$/,
      //   use: ['style-loader', 'css-loader', 'sass-loader'],
      // },
    ],
  },
};
