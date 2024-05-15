import Vue from 'vue';
import store from '@store';
import Router from 'vue-router';
import routesMap from './modules';
const { INTERRUPT } = $ylConfig.http
import NProgress from 'nprogress'; // progress js
const { lang } = $ylI18n
// import 'nprogress/nprogress.css'; // progress css
// 不显示右边的 loading
NProgress.configure({ showSpinner: false })
const vm = new Vue()
Vue.use(Router);
const router = new Router({
  mode: 'history',
  routes: routesMap
});
// router before hook
router.beforeEach(async (to, from, next) => {
  //  如果路由不存在则通知gateway处理
  // if (to.matched.length === 0) {
  //   next(false)
  // }
  NProgress.start()
  const { httpInstanceList } = store.state.base
  if (httpInstanceList.length) {
    for (const cancel of httpInstanceList) {
      cancel(INTERRUPT + `|${from.name}` + `|${from.path}`)
    }
    store.state.base.httpInstanceList = []
  }
  const { routeAuthList } = store.state.base
  // token存在
  if (store.getters.token && routeAuthList) {
    // 获取路由权限列表
    const pos = routeAuthList.indexOf(to.name) > -1
    //  有systemName代表不是白名单的
    const systemName = to.path.split('/')[2]
    // console.log('testtesttest', to.name, pos, systemName, process.env.VUE_APP_SYS_NAME, routeAuthList)
    //  没权限且是本系统的
    if (to.name !== 'redirect' && !pos && systemName === process.env.VUE_APP_SYS_NAME) {
      vm.$message.warning(lang('没有访问该页面权限'))
      next({
        redirect: true,
        name: process.env.VUE_APP_SYS_NAME
      })
    } else {
      next()
    }
  } else {
    next()
  }
  // next()
});
// router after hook
router.afterEach((to, from) => {
  window.scrollTo(0, 0);
  NProgress.done();
  const systemName = to.path.split('/')[2]
  if (systemName === process.env.VUE_APP_SYS_NAME) {
    //  通知gateway修改最好激活路由
    window.RXGW.subject.next({
      target: ['gateway'],
      type: 'tagBar',
      data: to
    });
    if (store.getters.token && window.$Bury) {
      const VUE_APP_SYS_NAME = process.env.VUE_APP_SYS_NAME
      try {
        // 获取参数
        const params = window.$Bury.util.handleBuryParams({ to, from, store, systemName: VUE_APP_SYS_NAME })
        // 调用页面埋点
        window.$Bury.buryPage(params)
      } catch (error) {
        console.error(`埋点系统-${VUE_APP_SYS_NAME}:error`, error)
      }
    }
  }
});

window.routerList[process.env.VUE_APP_SYS_NAME] = router
export default window.routerList[process.env.VUE_APP_SYS_NAME]

