// 封装一个插件
import PageTools from './PageTools'
import UploadImg from './UploadImg'
const glogin = {
  install(Vue) {
    Vue.component(PageTools.name, PageTools)
    Vue.component(UploadImg.name, UploadImg)
  }
}

// 导出插件
export default glogin
