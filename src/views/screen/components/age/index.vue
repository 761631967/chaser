<template>
  <div class="box">
    <div class="title">
      <p>年龄比例</p>
      <img src="../../images/dataScreen-title.png" alt="" style="margin-top: 10px;">
    </div>
    <!-- 图表容器 -->
     <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import {ref,onMounted} from 'vue'
import * as echarts from 'echarts'
//获取节点
let charts=ref()
onMounted(()=>{
  //获取echarts实例
  let mycharts=echarts.init(charts.value)
  let option = {
  tooltip: {
    trigger: 'item'
  },
  legend: {
    top: '12%',
    right:'5%',
    orient: 'vertical',//图例方向设置
    textStyle:{
      color:'white', //图例字体颜色
      fontSize:14,
    }
  },
  graphic: {
    type: 'text',
    left: 'center',
    top: 'center',
    style: {
      text: '年龄分布图',
      textAlign: 'center',
      fill: '#fff',
      fontSize: 16,
      fontWeight: 'bold'
    }
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: true,
        position: 'inside',
        color: 'white',
        formatter: '{d}%' ,//这里添加百分比显示
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 1048, name: '10岁以下' },
        { value: 735, name: '10-18岁' },
        { value: 580, name: '18-30岁' },
        { value: 484, name: '30-40岁' },
        { value: 300, name: '40-60岁' },
        { value: 300, name: '60岁以上' }
      ]
    }
  ],
  // 调整图形图表位置
  grid:{
      left:0,
      right:0,
      bottom:0,
      top:0
    }
};
  //设置实例配置项
  mycharts.setOption(option)
})
</script>

<style scoped lang="scss">
.box{
  width: 100%;
  height:100%;
  background:url(../../images/dataScreen-main-lc.png) no-repeat;
  background-size: 100% 100%;

  .title{
    margin-left: 20px;

    p{
      color: white;
      font-size: 20px;
    }
  }

  .charts{
    height:260px;
  }
}
</style>