<template>
  <!-- svg测试 -->
  <svg style="width: 30px;height: 30px;">
      <use :xlink:href="prefix+name" ></use>
    </svg>
</template>

<script setup lang="ts">
defineProps({
  prefix:{
    //xlink:href属性值前缀
    type:String, 
    default:'#icon-'
  },
  //提供使用的图标名字
    name:String
})
</script>

<style scoped>

</style>