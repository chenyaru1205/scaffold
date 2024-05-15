import testManage from './testManage' // 权限
import ylRedirect from '@jt/yl-business/src/common/redirect/index.vue'
// 基础数据平台路由spsPmsIndex
const routes = [
  ...testManage,
  {
    path: '/',
    name: process.env.VUE_APP_SYS_NAME,
    component: () => import(/* webpackChunkName: "basicInformation" */ '@views/Index.vue'),
    meta: { title: '首页', keepAlive: true, affix: true }
  },
  {
    path: '/redirect/:path*',
    name: 'redirect',
    component: ylRedirect,
    meta: { title: '', keepAlive: false, affix: true } // 刷新空白页
  }
]

// 基础路由路径
const baseUrl = `/app/${process.env.VUE_APP_SYS_NAME}`

export default routes.map(item => ({
  path: baseUrl + item.path,
  name: item.name,
  component: item.component,
  meta: item.meta
}))
