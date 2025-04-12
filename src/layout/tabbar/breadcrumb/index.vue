<template>
   <!-- 顶部左侧静态 -->
   <el-icon @click="changeIcon">
      <component :is="LayoutSettingStore.fold?'Fold':'Expand'"></component>
   </el-icon>
   <!-- 左侧面包屑 -->
   <el-breadcrumb :separator-icon="ArrowRight">
      <!-- 动态展示路由名字与标题 -->
      <el-breadcrumb-item v-for="(item,index) in $route.matched" :key="index" 
      :to="item.path" 
      v-show="item.meta.title"
      >
         <el-icon style="vertical-align: middle;">
            <component :is="item.meta.icon"></component>
         </el-icon>
         <span style="margin-left: 2px;">{{item.meta.title}}</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import useLayoutSettingStore from '../../../store/modules/setting';
import {ref} from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
//获取layout配置相关的仓库
let LayoutSettingStore =useLayoutSettingStore()
//获取路由对象
let $route = useRoute()
//点击图标方法
const changeIcon = () => {
   LayoutSettingStore.fold=!LayoutSettingStore.fold
}
</script>

<script lang="ts">
export default {
  name: 'Breadcrumb'
}
</script>

<style scoped>

</style>