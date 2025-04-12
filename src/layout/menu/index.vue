<template>
    <template v-for="(item,index) in menuList" :key="item.path">
      <!-- 没有子路由 -->
      <template v-if="!item.children"> 
        <el-menu-item  :index="item.path" v-if="!item.meta.hidden" @click="goRoute">
          <el-icon>
            <component :is="item.meta.icon"></component>
          </el-icon>
        <template #title>
          <span>{{item.meta.title}}</span>
        </template>
      </el-menu-item>
      </template>
      <!-- 路由只有一个child -->
      <template v-if="item.children && item.children.length === 1">
        <el-menu-item v-if="!item.children[0].meta.hidden" :index="item.children[0].path" @click="goRoute">
        <el-icon>
          <component :is="item.children[0].meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.children[0].meta.title }}</span>
        </template>
      </el-menu-item>
     </template>
      <!-- 有子路由且有多个子路由 -->
     <template v-if="item.children && item.children.length > 1">
      <el-sub-menu :index="item.path" v-if="!item.meta.hidden" >
        <template #title>
          <el-icon>
            <component :is="item.meta.icon"></component>  
          </el-icon>
          <span>{{item.meta.title}}</span>
        </template>
        <Menu :menuList="item.children"></Menu>
      </el-sub-menu>
     </template>
    </template>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router'
//获取路由器对象
let $router = useRouter()
//获取父组件传过来的路由数组
defineProps(['menuList'])
//点击菜单进行跳转
const goRoute = (vc:any) => {
  $router.push(vc.index)
}
</script>

<script lang="ts">
export default {
  name: 'Menu',
}
</script>

<style scoped></style>