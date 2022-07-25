// 放置全局指令

import store from '@/store'

const directive = {
  install(Vue) {
    Vue.directive('checkBtn', {
      inserted(el, binding) {
        const points = store.state.user.userInfo.roles.points
        // console.log(points)
        // console.log(binding.value)
        if (!points.includes(binding.value)) {
          el.remove()
        }
      }
    })
  }
}

export default directive
