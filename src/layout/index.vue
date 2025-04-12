<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <div class="layout_slider" 
    :class="{fold:layoutSettingStore.fold?true:false}"
    >
      <Logo />
      <!-- 展示菜单 -->
       <!-- 滚动组件 -->
      <el-scrollbar class="scrollbar">
        <!-- 菜单组件 -->
        <el-menu 
        :collapse="layoutSettingStore.fold"
        :default-active="$route.path"
        background-color="#001529" 
        text-color="white"
        active-text-color="cyan"
        >
          <!-- 根据路由动态生成菜单 -->
          <Menu :menuList="userStore.menuRoutes"></Menu>
       
        </el-menu>
      </el-scrollbar>
    </div>
     <!-- 顶部导航 -->
    <div class="layout_tabbar" 
    :class="{fold:layoutSettingStore.fold?true:false}"
    >
      <!-- layout顶部组件tabbar -->
      <Tabbar/>
    </div>
    <!-- 内容展示区域 -->
     <div class="layout_main"
     :class="{fold:layoutSettingStore.fold?true:false}"
     >
      <Main />
     </div>
  </div>
</template>

<script setup lang="ts">
//引入路由
import { useRoute } from 'vue-router'
//引入左侧菜单logo子组件
import Logo from './logo/index.vue'
//引入菜单组件
import Menu from './menu/index.vue'
//右侧内容展示
import Main from './main/index.vue'
//引入顶部组件tabbar
import Tabbar from './tabbar/index.vue'
//获取用户相关小仓库
import useUserStore from '@/store/modules/user'
import useLayoutSettingStore from '../store/modules/setting'
let userStore = useUserStore()
let $route = useRoute()
//获取layout组件配置仓库
let layoutSettingStore = useLayoutSettingStore()

</script>
<script lang="ts">
export default {
  name: 'Layout'
}
</script>

<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;

  .layout_slider {
    width: $base-menu-width;
    height: 100vh;
    background: $base-menu-background;
    color: white;
    transition: all 0.5s;

    .scrollbar{
      width: 100%;
      height: calc(100vh - $base-menu-logo-height);

      .el-menu{
        border-right: none;
      }
    }
    &.fold{
      width: $base-menu-min-width;
    }
  }

  .layout_tabbar{
    position: fixed;
    top: 0;
    left: $base-menu-width;
    width: calc(100% - $base-menu-width);
    height: $base-tabber-height;
    transition: all 0.5s;
    &.fold{
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }

  .layout_main{
    position: absolute;
    left: $base-menu-width;
    top: $base-tabber-height;
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $base-tabber-height);
    padding: 20px;
    overflow: auto;
    transition: all 0.5s;

    &.fold{
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }
}
</style>