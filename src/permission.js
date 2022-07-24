// 权限控制
// 引入router
import router from '@/router'
import { getToken } from './utils/auth'
import asyncRouter from '@/router/asynvRouter'

// 引入进度条
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from './store'

const WHITE_LIST = ['/login', '/404']
router.beforeEach(async(to, from, next) => {
  const token = getToken()
  nProgress.start()
  if (token) {
    if (to.path === '/login') {
      next('/')
    } else {
      next()
      if (!store.state.user.userInfo.userId) {
        const res = await store.dispatch('user/getUserInfo')
        const menus = res.roles.menus
        const filterRoutes = asyncRouter.filter(item => menus.includes(item.children[0].name))
        router.addRoutes(filterRoutes)
        store.commit('menu/setMenuList', filterRoutes)
        console.log(menus, filterRoutes)
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
