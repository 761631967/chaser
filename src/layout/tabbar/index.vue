<template>
  <div class="tabbar">
    <div class="tabbar_left">
      <Breadcrumb />
    </div>
    <div class="tabbar-right">
      <Setting/>
    </div>
  </div>
</template>

<script setup lang="ts">
import Breadcrumb from './breadcrumb/index.vue'
import Setting from './setting/index.vue'
</script>

<script lang="ts">
export default {
  name: 'Tabbar'
}
</script>

<style scoped lang="scss">
.tabbar{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  background-image: linear-gradient(to right, 
  #a6e3ff,  /* 更淡的冰蓝色 */
  #b399ff,  /* 浓郁的薰衣草紫 */
  #ff9cd8   /* 鲜艳的樱花粉 */
);

  .tabbar_left{
    display: flex;
    align-items: center;
    margin-left: 20px;
    gap: 10px;
  }

  .tabbar-right{
    display: flex;
    align-items: center;
    gap: 10px;
    margin-right: 20px;
  }
}

</style>