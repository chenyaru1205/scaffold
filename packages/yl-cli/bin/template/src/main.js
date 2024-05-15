// import 'babel-polyfill'  //  上下文只允许一个（与跟系统冲突）
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@store'
import plugins from '@public/plugins/index'
import common from '@/common'
import fetch from '@public/http/request'
import ylBusiness from '@jt/yl-business'
import components from '@/common/components'
import '@jt/yl-business/src/common/vue-virtual-scroll-list'
import VueClipboard from 'vue-clipboard2'
components.registerGlobalComponents()
// 注册插件
plugins.install(Vue)
//  注册系统级公共配置
common.install(Vue)

// let instance = null;
VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)

export async function bootstrap({ store, emitFnc }) {
  // console.log('aaaa3vue app bootstraped mount');
  // 注册主应用下发的组件
  // Vue.use(components);
  // 挂载根系统store
  // Vue.prototype.$store = store
  // Object.keys(emitFnc).forEach(i => {
  //   Vue.prototype[i] = emitFnc[i]
  // })
}

export async function mount(props) {
  const systemName = location.pathname.split('/')[2]
  // console.log(systemName + ' aaaa3main mount', props);
  if (!window.vueStorage) {
    window.vueStorage = {}
  }
  if (window.vueStorage[systemName]) {
    // console.log(systemName + '已实例化');
    return
  }
  // 注册elementui
  props.components.INIT_ELEMENT(Vue, require('element-ui'))
  // 复制到粘贴板插件

  // 每个系统单独构建，不共享运行时https://micro-frontends.org/
  Vue.use(ylBusiness, {
    fetch,
    store: store.state.base
  })
  let time = 0
  let timeout = setTimeout(() => {
    if (document.getElementById(systemName)) {
      clearTimeout(timeout)
      timeout = null
      window.vueStorage[systemName] = new Vue({
        router,
        store,
        i18n: $ylI18n.vueI18n,
        render: h => h(App, { props }),
        data() {
          return {
            // 挂载系统名称变量到子系统的vue根实例
            VUE_APP_SYS_NAME: systemName
          }
        }
      }).$mount(`#${systemName}`)
    }
    time += 50
    if (time > 100 * 50) {
      alert('系统载入异常，重新刷新')
      clearTimeout(timeout)
      timeout = null
      window.location.reload()
    }
  }, 50)
}

export async function unmount(e) {
  // console.trace();
  // console.log('aaaa3basic-data-app unmount', e);
  // instance.$destroy();
  // instance = null;
}
// 发版
