<template>
  <div class="top">
    <div class="left">
      <span class="lbtn" @click="goHome">首页</span>
    </div>
    <div class="center">
      <div class="title">智慧旅游可视化大数据平台</div>
    </div>
    <div class="right">
      <span class="rbtn">统计报告</span>
      <span class="time">当前时间{{ time }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref ,onMounted,onBeforeUnmount} from 'vue';
//引入时间
import moment from 'moment'
let $router=useRouter()
let time=ref(moment().format('YYYY-MM-DD HH:mm:ss'))
let timer = ref(0)
const goHome=()=>{
  $router.push('/home')
}

//组件挂载完毕要实时更新时间
onMounted(()=>{
  timer.value=setInterval(()=>{
    time.value=moment().format('YYYY-MM-DD HH:mm:ss')
  },1000)
})

onBeforeUnmount(()=>{
  clearInterval(timer.value)
})
</script>

<style scoped lang="scss">
.top{
  width: 100%;
  height: 40px;
  display: flex;

  .left{
    flex:1;
    background: url('../../images/dataScreen-header-left-bg.png') no-repeat;
    background-size: cover;

    .lbtn{
      width: 120px;
      height: 40px;
      float: right;
      background: url('../../images/dataScreen-header-btn-bg-l.png') no-repeat;
      background-size: 100% 100%;
      text-align: center;
      line-height: 40px;
      color: #29fcff;
      font-size: 20px;
    }

    .lbtn:hover{
      cursor: pointer;
    }
  }

  .center{
    flex:2;

    .title{
      width: 100%;
      height: 74px;
      background: url('../../images/dataScreen-header-center-bg.png') no-repeat;
      background-size: 100% 100%;
      text-align: center;
      line-height: 74px;
      color: #29fcff;
      font-size: 35px;
    }
  }

  .right{
    flex:1;
    background: url('../../images/dataScreen-header-left-bg.png') no-repeat;
    background-size: cover;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .rbtn{
      width: 120px;
      height: 40px;
      background: url('../../images/dataScreen-header-btn-bg-r.png') no-repeat;
      background-size: 100% 100%;
      float: left;
      text-align: center;
      line-height: 40px;
      color: #29fcff;
      font-size: 20px;
    }

    .time{
      color:#29fcff;
      margin-right: 10px;
      font-size: 20px;
    }
  }
}
</style>