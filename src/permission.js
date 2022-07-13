// 权限控制
// 引入router
import router from '@/router'
import { getToken } from './utils/auth'

// 引入进度条
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from './store'

const WHITE_LIST = ['/login', '/404']
router.beforeEach((to, from, next) => {
  const token = getToken()
  nProgress.start()
  if (token) {
    if (to.path === '/login') {
      next('/')
    } else {
      next()
      if (!store.state.user.userInfo.userId) {
        store.dispatch('user/getUserInfo')
      }
    }
  } else {
    if (WHITE_LIST.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
  nProgress.done()
})
