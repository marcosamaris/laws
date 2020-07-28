const webpack = require('webpack')



module.exports = {
    mode: 'development',
    entry: './src/openProject.js',
    node: {
        fs: 'empty'
      },
    output: {
        filename: 'principal.js',
        path: __dirname + '/public'
    },
    plugins: [
        new webpack.ProvidePlugin({
          $: 'jquery',
          jQuery: 'jquery'
        })
      ]
}