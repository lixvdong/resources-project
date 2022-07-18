// 封装一个插件
import PageTools from './PageTools'
const glogin = {
  install(Vue) {
    Vue.component(PageTools.name, PageTools)
  }
}

// 导出插件
export default glogin
