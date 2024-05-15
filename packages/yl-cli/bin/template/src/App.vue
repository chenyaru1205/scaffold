<template>
  <div id="basicData">
    <keep-alive :include="cachedViews">
      <router-view :key="$route.name" />
    </keep-alive>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import debounce from 'lodash/debounce'
export default {
  name: 'App',
  components: {
  },
  data() {
    return {
      isCollapse: false,
      calcHeight: 170,
      restHeight: 0,
      clientHeight: 1080,
      platformId: ''
    }
  },
  computed: {
    ...mapGetters({
      user: 'user'
    }),
    ...mapGetters({
      tableHeight: 'tableHeight',
      cachedViews: 'tags/cachedViews'
    }),
    isNoBg() {
      const routeName = this.$route.name
      return routeName === 'addWaybill' || routeName === 'problemParcelDispose' || routeName === 'problemParcelDisposeDetail'
    },
    // 获取当前标题
    title() {
      const title = 'JMS-' + this.$route.meta.title + ' (dev)'
      return title
    }
  },
  watch: {
    $route(to, from) {
      this.$nextTick(() => {
        this.calcTableHeight()
        console.log('$route addCachedView', this.$route.name, this.$root.VUE_APP_SYS_NAME)
        this.addCachedView(this.$route)
        // 系统名称
        const systemName = this.$root.VUE_APP_SYS_NAME
        // 路由名称
        const routerName = this.$route.name
        // 截取路由path路径
        const arr = this.$route.path.split('/').filter(item => item)
        // 路由path的长度
        const len = arr.length
        // 判断是否当前子系统页面切页面路由存在
        if (len > 1 && arr.includes('app') && this.$root.VUE_APP_SYS_NAME === arr[1] && routerName) {
          window.RXGW.subject.next({
            target: ['gateway'],
            type: 'router-update',
            data: { systemName, routerName }
          })
        }
      })
    }
  },
  created() {
    window.RXGW.subject
      .filter(subjectData => subjectData.target.includes(process.env.VUE_APP_SYS_NAME) && subjectData.type === 'router')
      .subscribe({
        next: subjectData => {
          const to = subjectData.data.to
          if (!to.name) {
            this.$router.push({ path: to.path, query: to.query })
          } else {
            this.$router.push({ name: to.name, params: to.params })
          }
        },
        error: err => console.error('window.RXGW.subject Observer got an error: ' + err),
        complete: () => console.log('window.RXGW.subject Observer got a complete notification')
      })
    //  统一的store同步订阅
    window.RXGW.subject
      .filter(subjectData => subjectData && subjectData.actions &&
        (subjectData.target.includes(process.env.VUE_APP_SYS_NAME) || subjectData.target.includes('allChild') || subjectData.target.includes('all')) &&
        subjectData.type === 'store')
      .subscribe({ // 更新当前系统下的选中tags
        next: subjectData => {
          if (this[subjectData.actions]) {
            this[subjectData.actions](subjectData.data)
          } else {
            console.warn(`store ${subjectData.actions} is undefined: `, subjectData)
          }
        },
        error: err => console.error('store Observer got an error: ' + err),
        complete: () => console.log('store Observer got a complete notification')
      })
    window.RXGW.subject
      .filter(subjectData => subjectData.target.includes('all') && subjectData.type === 'delAllViews')
      .subscribe({
        next: subjectData => {
          this.$store.dispatch('tags/delAllViews')
        },
        error: err => console.error('aaaa1gateway tagBar Observer got an error: ' + err),
        complete: () => console.log('aaaa1gateway tagBar Observer got a complete notification')
      })
  },
  mounted() {
    this.$nextTick(() => {
      this.calcTableHeight()
      // 绑定窗口resize事件
      const fn = debounce(this.calcTableHeight, 200) // 表格高度计算防抖
      window.addEventListener('resize', fn, false)
      // 触发destroyed钩子，移除resize的监听事件
      this.$once('hook:destroyed', () => {
        window.removeEventListener('resize', debounce(this.calcTableHeight, 200), false)
      })
    })
    // 监听高度重算事件
    this.$bus.$on('doLayout', () => {
      this.$nextTick(() => this.calcTableHeight())
    })
  },
  beforeRouteLeave (to, from, next) {
    this.$bus.$off('doLayout')
    next()
  },
  destroyed() {
    // 清除定时任务/绑定事件/eventBus事件
    // window.removeEventListener('resize', debounce(this.calcTableHeight, 200), false)
    this.$bus.$off('doLayout')
    console.info('aaaa3========= destroyed Vue 实例销毁后调用222', this)
  },
  methods: {
    ...mapActions({
      delCachedView: 'tags/delCachedView',
      setCollapse: 'setCollapse',
      setTableHeight: 'setTableHeight',
      addCachedView: 'tags/addCachedView',
      delOthersCachedViews: 'tags/delOthersCachedViews',
      delCurCachedViews: 'tags/delCurCachedViews',
      setLang: 'setLang',
      set_themeInfo: 'set_themeInfo',
      LOGIN_INIT: 'LOGIN_INIT'
    }),
    changeCollapse(value) {
      this.isCollapse = value
    },
    handleCollapse() {
      this.isCollapse = !this.isCollapse
      this.$bus.$emit('toggleCollapse', this.isCollapse)
    },
    // 计算元素的高度用于表格自适应
    getRestHeight() {
      const arr = ['Title', 'Search', 'Pagination', 'Menu', 'Tip', 'SearchExtend']
      let height = 0
      arr.forEach(function(id) {
        const els = document.querySelectorAll('#jms' + id)
        els.forEach((item) => {
          // console.log(item.id + ':', item.clientHeight);
          if (item.offsetParent !== null) {
            height += item.clientHeight
          }
        })
      })
      return height
    },
    calcTableHeight() {
      this.clientHeight = document.documentElement.clientHeight
      this.restHeight = this.getRestHeight()
      const tableHeight = this.clientHeight - this.restHeight - this.calcHeight
      this.setTableHeight(tableHeight)
    }
  }
}
</script>
<style lang="scss" scope rel="stylesheet/scss">
a.a-tel {
  margin-right: 10px;
  color: #303133;
}
.no-bg {
  background: none;
}
.is-index {
  padding: 0;
  height: 100%;
}
.home-container {
  position: relative;
}
#basicData .el-loading-mask {
  margin-top: 0px!important;
  margin-left: 0px!important;
  background-color: unset;
}
.el-message-box.el-message-box-overflow {
    .el-message-box__content {
      .el-message-box__message {
        height: 100px;
        overflow-y: auto;
        >p{
              overflow: auto;
        }
      }
    }
  }
</style>
