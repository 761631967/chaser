<template>
  <div class="logo">
    <img :src="setting.logo" alt="" />
    <p>{{setting.title}}</p>
  </div>
</template>

<script setup lang="ts">
//引入设置标题与logo配置文件
import setting from '@/setting'
</script>

<script lang="ts">
export default {
  name: 'Logo'
}
</script>

<style scoped lang="scss">
.logo{
  width: 100%;
  height:$base-menu-logo-height;
  color:skyblue;
  display: flex;
  align-items: center;
  padding:10px;

  img{
    width:40px;
    height:40px;
  }

  p{
    font-size:$base-logo-title-fontSize;
    white-space: nowrap;
    margin-left: 10px;
  }
}

</style>