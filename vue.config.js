// vue.config.js
const path = require('path')

module.exports = {
    pluginOptions: {
      electronBuilder: {
        // List native deps here if they don't work
        externals: ['my-native-dep'],
        // If you are using Yarn Workspaces, you may have multiple node_modules folders
        // List them all here so that VCP Electron Builder can find them
        nodeModulesPath: ['../../node_modules', './node_modules'],
        preload:'src/preload.js',
        nodeIntegration:false,
        customFileProtocol: './',
        icon: path.join(__dirname, 'icon.ico'),
        builderOptions:{
          asar:false
        }
      },
      'style-resources-loader': {
        preProcessor: 'scss',
        // load which style file you want to import globally
        patterns: [path.resolve(__dirname, './src/_variables.scss')],
      },
    },
  }