const init = require('@jt/jms-common-jty/vue.config.child')
const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir)
}
const port = {{ port }}; // dev port
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'
const config = init({
  publicPath: IS_DEVELOPMENT ? `//localhost:${port}` // 开发环境
    : `/${process.env.VUE_APP_SYS_NAME}/`, // 生产环境
  devServer: {
    port
  },
  // 自定义webpack配置
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  // 包依赖分析插件
  ANALYZER: require('webpack-bundle-analyzer')
})
module.exports = config.option
