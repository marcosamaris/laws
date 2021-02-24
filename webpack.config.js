var devConfig = require('./webpack.dev.config')

var config;

switch (process.env.npm_lifecycle_event) {
    case 'start':
        config = devConfig;
        break;
    default:
        config = devConfig;
        break;
}

module.exports = config