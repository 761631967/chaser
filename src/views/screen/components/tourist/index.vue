<template>
  <div class="tourist-box">
    <div class="top">
      <p class="title">实时游客统计</p>
      <p class="bg"></p>
      <p class="right">可预约总量<span>9999</span>人</p>
    </div>
    <div class="number">
      <span v-for="(item,index) in people" :key="index">{{ item }}</span>
    </div>

    <!-- 盒子Echarts -->
     <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import {ref,onMounted} from 'vue'
import * as echarts from 'echarts'
import 'echarts-liquidfill'
let people=ref('216908人')
//获取节点
let charts=ref()

onMounted(()=>{
  //获取echarts实例
  let mycharts=echarts.init(charts.value)
  //设置实例配置项
  mycharts.setOption({
    title:{
      //标题组件
      text:'游客来源',
    },
    //X,Y轴组件
    // xAxis:{},
    // yAxis:{},
    series:{
      type: 'liquidFill',//系列：用什么图形展示
      data: [0.6,0.4,0.2],//展示的数据
      radius:'95%',//圆的半径
      outline: {//外层边框颜色设置
        show: true,
        borderDistance: 8,
        itemStyle: {
            color: 'skyblue',
            borderColor: '#294D99',
            borderWidth: 8,
            shadowBlur: 20,
            shadowColor: 'rgba(0, 0, 0, 0.25)'
        }
      },
    },
    //布局组件
    grid:{
      left:0,
      right:0,
      bottom:0,
      top:0
    }
  })
})
</script>

<style scoped lang=scss>
.tourist-box{
  background: url("../../images/dataScreen-main-lb.png") no-repeat;
  background-size: 100% 100%;
  margin-top: 10px;

  .top{
    margin-left: 20px;
    .title{
      font-size: 20px;
      color:white;
    }

    .bg{
      width: 68px;
      height: 7px;
      background: url("../../images/dataScreen-title.png") no-repeat;
      background-size: 100% 100%;
      margin-top: 20px;
    }

    .right{
      float:right;
      color:white;
      font-size: 20px;
      margin-top: 5px;

      span{
        color:rgb(228, 144, 10)
      }
    }
  }

  .number{
    padding: 10px;
    margin-top: 30px;
    display: flex;

    span{
      flex:1;
      height: 40px;
      text-align: center;
      line-height: 40px;
      background: url("../../images/total.png") no-repeat;
      background-size: 100% 100%;
      color:#29fcff;
      font-size: 20px;
    }
  }

  .charts{
    width: 100%;
    height: 235px;
  }
}
</style>