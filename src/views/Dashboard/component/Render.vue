<template>
  <div>
    <!-- 准备一个节点 -->
    <div ref="echart" style="width:400px;height:300px;" />
  </div>
</template>

<script>
// 导入核心包
import * as echarts from 'echarts'
// 获取一个渲染图表的dom节点 -> vue如何获取dom元素？  ref + this.$refs.echart
// 把echart渲染到准备好的dom节点中  -> vue中如何保证一个dom已经可以使用？ 钩子函数？ mounted

export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  watch: {
    title() {
      this.myChart.setOption({
        ...this.option,
        title: {
          text: this.title
        }
      })
    }
  },
  mounted() {
    this.echartInit()
  },
  methods: {
    // 初始化
    echartInit() {
      this.myChart = echarts.init(this.$refs.echart)
      this.option = {
        title: {
          text: this.title
        },
        radar: {
          // shape: 'circle',
          indicator: [
            { name: 'A', max: 6500 },
            { name: 'B', max: 16000 },
            { name: 'C', max: 30000 },
            { name: 'D', max: 38000 },
            { name: 'E', max: 52000 },
            { name: 'F', max: 25000 }
          ]
        },
        series: [
          {
            name: 'Budget vs spending',
            type: 'radar',
            data: [
              {
                value: [4200, 3000, 20000, 35000, 50000, 18000],
                name: 'Allocated Budget'
              },
              {
                value: [5000, 14000, 28000, 26000, 42000, 21000],
                name: 'Actual Spending'
              }
            ]
          }
        ]
      }
      // 把配置项数据渲染到我们已经准备好的图标实例中
      this.option && this.myChart.setOption(this.option)
    }
  }
}
</script>
