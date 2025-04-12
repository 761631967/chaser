<template>
  <!-- 路由组件出口位置 -->
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <div>
          <component :is="Component" v-if="flag"/>
        </div>
      </transition>
    </router-view>
</template>

<script setup lang="ts">
import { watch,ref,nextTick } from 'vue';
import useLayoutSettingStore from '../../store/modules/setting';
let layoutSettingStore = useLayoutSettingStore();
//控制当前组件是否销毁重建
let flag=ref(true)
//监听仓库数据是否发生变化
watch(()=>layoutSettingStore.refresh,()=>{
  flag.value=false
  nextTick(()=>{
    flag.value=true
  })
})
</script>

<script lang="ts">
export default {
  name: 'Main'
}
</script>

<style scoped>
.fade-enter-from{
  opacity: 0;
  transform: scale(0);
}
.fade-enter-active{
  transition: all 0.7s ease;
}
.fade-enter-to{
  opacity: 1;
  transform: scale(1);
}
</style>