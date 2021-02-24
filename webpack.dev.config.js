const path = require('path')

var HtmlWebpackPlugin = require('html-webpack-plugin');

var HTMLWebpackPluginConfig = new HtmlWebpackPlugin({ template: 'index.html' });

module.exports = {
    entry: [path.resolve('./src/index.jsx')],
    output: {
      filename: 'bundle.js',
      path: __dirname,
      
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel',
          query: {
            presets: ['react', 'es2015']
          }
        }
      ]
    },
    plugins: [
      HTMLWebpackPluginConfig,
      new webpack.ProvidePlugin({
        React: 'react'
      }),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
      })
    ],
  stats: 'errors-only'
  }