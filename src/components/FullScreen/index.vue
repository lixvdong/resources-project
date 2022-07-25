<template>
  <!-- 放置一个图标 -->
  <div class="screenWrapper">
    <svg-icon :icon-class="!isScreenFull?'fullscreen':'exit-fullscreen'" class="fullscreen" @click="toggleScreen" />
  </div>
</template>

<script>
import screenfull from 'screenfull'
export default {
  name: 'ScreenFull',
  data() {
    return {
      isScreenFull: false
    }
  },
  mounted() {
  //   // 监听窗口变化
  //   document.addEventListener('fullscreenchange', e => {
  //     const isFull = document.fullscreenElement
  //     if (!isFull) {
  //       this.isScreenFull = false
  //     }
  //   })
  // 使用插件监听窗口变化
    screenfull.on('change', () => {
      this.isFull = screenfull.isFullscreen
    })
  },
  methods: {
    // 手动点击窗口变化
    // toggleScreen() {
    //   if (!this.isScreenFull) {
    //     document.documentElement.requestFullscreen()
    //   } else {
    //     document.exitFullscreen()
    //   }
    //   this.isScreenFull = !this.isScreenFull
    // }
    // 使用插件，变化窗口
    toggleScreen() {
      screenfull.toggle()
    }
  }
}
</script>

<style lang="scss" scoped>
.screenWrapper {
  display: flex;
  align-items: center;
  margin-right: 20px;
}
.fullscreen {
  width: 20px;
  height: 20px;
  color: #fff;
  cursor: pointer;
}
</style>
