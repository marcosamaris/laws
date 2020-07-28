const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './jsx/AppContainer.jsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'js'),
    publicPath: './js/'
  },
  mode: 'production',
  module: {
    rules: [{
      test: /\.jsx$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015', 'react'],
        plugins: ['syntax-dynamic-import']
      }
    }, {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    }, {
      test: /\.(png|jpg)$/,
      loader: 'url-loader'
    }]
  },
  plugins: [
    new webpack.ProvidePlugin({
      React: 'react'
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    })
  ]
};
