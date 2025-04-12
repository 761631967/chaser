<template>
 <el-button  size="small" icon="Refresh" circle @click="updateRefresh"></el-button>
      <el-button  size="small" icon="FullScreen" circle @click="fullScreen"></el-button>
      <el-popover
        placement="bottom"
        title="主题设置"
        :width="200"
        trigger="hover"
      >
      <el-form>
        <el-form-item label="主题颜色">
          <el-color-picker @change="setColor" v-model="color" size="small" show-alpha :predefine="predefineColors" />
        </el-form-item>
        <el-form-item label="佟大为模式">
          <el-switch
            @change="change"
            v-model="dark"
            size="small"
            inline-prompt
            active-icon="MoonNight"
            inactive-icon="Sunny"
          />
        </el-form-item>
      </el-form>
      <template #reference>
        <el-button  size="small" icon="Setting" circle></el-button>
      </template>
      </el-popover>

      <img :src="userStore.avatar" style="width: 24px;height: 24px;border-radius: 50%;">
      <!-- 下拉菜单 -->
      <el-dropdown>
    <span class="el-dropdown-link">
      {{userStore.username}}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router';
//获取刷新仓库
import useLayoutSettingStore from '../../../store/modules/setting';
//获取用户相关仓库
import useUserStore from '../../../store/modules/user'; 
let userStore=useUserStore()
let $router=useRouter()

let LayoutSettingStore=useLayoutSettingStore()

//开关
let dark = ref<boolean>(false)
//刷新按钮方法
const updateRefresh=()=>{
  LayoutSettingStore.refresh=!LayoutSettingStore.refresh
}
//全屏放大
const fullScreen=()=>{
  //DOM对象属性，可以用来判断当前是不是全屏模式，全屏模式返回true，非全屏模式返回false 
  let full=document.fullscreenElement
  //切换为全屏
  if(!full){
    //文档根节点方法
    document.documentElement.requestFullscreen()
  }else{
    //退出全屏
    document.exitFullscreen()
  }
}
//退出登录
const logout=async()=>{
  //第一件事情：需要向服务器发请求[退出登录接口],没有接口就不写了
  //第二件事情：清除本地存储
  await userStore.userLogout()
  //第三件事情：跳转到登录页
  $router.push({path:'/login'})
}

//颜色选择器
const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])

//佟大为模式,但是这里我的tabber没有切换，我设置了颜色
const change=()=>{
  //获取html根节点
  let html=document.documentElement
  //判断当前是否是佟大为模式
  dark.value?html.className='dark':html.className=''
}

//主题颜色设置
const setColor=()=>{
  const el = document.documentElement
  // 获取 css 变量
getComputedStyle(el).getPropertyValue(`--el-color-primary`)

// 设置 css 变量
el.style.setProperty('--el-color-primary', color.value)
}
</script>

<script lang="ts">
export default {
  name: 'Setting'
}
</script>

<style scoped lang="scss">
.el-button + .el-button {
      margin-left: 0px;
    }

</style>