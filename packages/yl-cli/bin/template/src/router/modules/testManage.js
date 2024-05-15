/**
 * 权限管理
 */
export default [
  /** *************************************** 权限管理 *************************************************** */
  {
    path: '/test',
    name: 'test',
    component: () => import(/* webpackChunkName: "test" */ '@views/test/Test'),
    meta: { title: 'TEST管理', keepAlive: true }
  }
]
