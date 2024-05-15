/*
* 模块级公共配置
*/
import Api from './api'
import { getDictByCode } from './utils/dict'

export default {
  install(Vue, options) {
    // 将第三方插件注册到Vue原型中，组件内可直接使用 this.xxx来调用组件
    Object.assign(Vue.prototype, {
      $selectApi: Api.API.select,
      $selectUrl: Api.API_URL.select,
      $publicApi: Api.API.public,
      $publicUrl: Api.API_URL.public,
      $getDict: getDictByCode
    })
  }
}
