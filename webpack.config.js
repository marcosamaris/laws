const { merge } = require('webpack-merge');
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports ={
    entry: './src/index.jsx',
    output:{
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build'),
    },
    mode: 'development',
    plugins:[
        new webpack.ProvidePlugin({
            React: 'react'
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
    ],
    module: {
        rules:[{
            test: /\.jsx?$/,
            exclude: '/node_modules/',
            loader: 'babel-loader',
            options: {
                plugins: ['@babel/plugin-syntax-dynamic-import', "@babel/plugin-transform-destructuring"],
                presets: ['@babel/preset-env', '@babel/preset-react']}
        },
        {
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader'
                ]
        },{
            test: /\.(png|jpg|svg|gif)$/,
            loader: 'url-loader'
        }
        ]
    },
    resolve: {
        alias: {
            '~.': path.resolve(__dirname)
        },
        fallback: {"stream": require.resolve("stream-browserify"),"timers": require.resolve("timers-browserify")}
    },
    optimization: {
        splitChunks: {
          cacheGroups: {
            default: false,
            vendors: false,
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'async',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true
            }
          }
        },
        usedExports: true,
      },
    
}