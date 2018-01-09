const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const dev = process.env.NODE_ENV === 'development';
const packageName = process.env.npm_package_name;

module.exports = {
  output: {
    filename: `${packageName}.${dev ? '' : 'min.'}js`,
    library: packageName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
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
  plugins: dev ? [] : [new UglifyJsPlugin()],
  mode: dev ? 'development' : 'production'
};
