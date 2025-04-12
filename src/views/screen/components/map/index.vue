<template>
  <div class="box" ref="map">
      地图
  </div>
</template>

<script setup lang="ts">
import {ref,onMounted} from 'vue'
import * as echarts from 'echarts'
//引入中国地图JSON
import chinaJson from './china.json'
import { labelInner } from 'echarts/types/src/label/labelStyle.js'

//获取节点
let map=ref()
//注册中国地图
echarts.registerMap('china', chinaJson as any)
onMounted(()=>{
  let myMap=echarts.init(map.value)
  
  myMap.setOption({
    geo:{
      map:'china',
      roam:true,//开启鼠标缩放
      //地图上的文字开启
      label:{
        show:true,
        color:'white',
        fontSize:14
      },
      //地图上的区域颜色
      itemStyle:{
        areaColor:'#29FCFF'
      },
      //鼠标放上去的样式
      emphasis:{
        areaColor:'#4A89DC'
      },
    },
    grid:{
      left:0,
      right:0,
      bottom:0,
      top:0
    },
    series: [
            {
                type: 'lines',//航线的系列
                data: [
                    {
                        coords: [
                            [116.405285, 39.904989],  // 起点
                            [119.306239, 26.075302]   // 终点
                        ],
                        // 统一的样式设置
                        lineStyle: {
                            color: 'orange',
                            width: 5
                        }
                    },
                    {
                        coords: [
                            [116.405285, 39.904989],  // 起点
                            [114.298572, 30.584355]   // 终点
                        ],
                        // 统一的样式设置
                        lineStyle: {
                            color: 'yellow',
                            width: 5
                        }
                    },
                    {
                        coords: [
                            [113.429919, 23.334643],  // 起点
                            [85.294711, 41.371801]   // 终点
                        ],
                        // 统一的样式设置
                        lineStyle: {
                            color: 'teal',
                            width: 5
                        }
                    },
                    {
                        coords: [
                            [103.504383, 37.736057],  // 起点
                            [126.604706, 46.251964]   // 终点
                        ],
                        // 统一的样式设置
                        lineStyle: {
                            color: 'white',
                            width: 5
                        }
                    }
                ],
                //开启动画特效
                effect: {
                    show: true,
                    symbol: 'arrow',
                    color: 'black',
                    symbolSize: 10
                }
            }
        ]
  })
})
</script>

<style scoped lang="scss">
.box{
    width: 100%;
    height: 100%;
}
</style>