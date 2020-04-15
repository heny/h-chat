const path = require('path')
const { override, addWebpackAlias } = require('customize-cra');
function resolve(dir) {
  return path.resolve(__dirname, dir)
}

// 生产环境去除console
const dropConsole = () => {
  return config => {
    if (config.optimization.minimizer) {
      config.optimization.minimizer.forEach(minimizer => {
        if (minimizer.constructor.name === 'TerserPlugin') {
          minimizer.options.terserOptions.compress.drop_console = true
        }
      })
    }
    return config
  }
}

module.exports = {
  webpack: override(
    dropConsole(),
    addWebpackAlias({
      '@': resolve('src'),
      'store': resolve('src/store'),
      'components': resolve('src/components'),
      'api': resolve('src/api'),
      'utils': resolve('src/utils')
    })
  )
}
