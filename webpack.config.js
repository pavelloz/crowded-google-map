const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const packageName = process.env.npm_package_name;

module.exports = {
  output: {
    filename: `${packageName}.min.js`,
    library: packageName,
    libraryTarget: 'umd'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader?cacheDirectory'
        }
      }
    ]
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: true
      })
    ]
  },
  mode: 'production'
};
