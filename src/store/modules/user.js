import { loginAPI, getUserInfoAPI, getUserAvatarAPI } from '@/api/user'
import { resetRouter } from '@/router'
import { getToken, removeToken, setToken } from '@/utils/auth'
export default {
  namespaced: true,
  state: {
    token: getToken() || '',
    userInfo: {}
  },
  mutations: {
    setToken(state, val) {
      state.token = val
      setToken(val)
    },
    setUserInfo(state, val) {
      state.userInfo = val
    },
    empty(state) {
      state.token = ''
      state.userInfo = {}
      removeToken()
      resetRouter()
    }
  },
  actions: {
    async getToken(store, data) {
      const res = await loginAPI(data)
      store.commit('setToken', res)
    },
    async getUserInfo(store) {
      const res = await getUserInfoAPI()
      const res_ = await getUserAvatarAPI(res.userId)
      store.commit('setUserInfo', { ...res, ...res_ })
      return res
    }
  }
}
