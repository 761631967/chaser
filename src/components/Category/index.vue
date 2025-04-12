<template>
  <el-card>
      <el-form :inline="true">
        <el-form-item label="一级分类" >
          <el-select :disabled="scene==0?false:true" style="width: 200px;" v-model="categoryStore.c1Id" @change="handler1">
            <el-option v-for="(item,index) in categoryStore.c1Arr" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类" >
          <el-select :disabled="scene==0?false:true" style="width: 200px;" v-model="categoryStore.c2Id" @change="handler2">
            <el-option v-for="(item,index) in categoryStore.c2Arr" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类" >
          <el-select :disabled="scene==0?false:true" style="width: 200px;" v-model="categoryStore.c3Id">
            <el-option v-for="(item,index) in categoryStore.c3Arr" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
//引入分类相关仓库
import useCategoryStore from '@/store/modules/category'; 

let categoryStore = useCategoryStore();

//props接收
defineProps(['scene'])

//获取一级分类方法
const getC1=()=>{
  categoryStore.getC1();
}

//一级菜单选中值后触发
const handler1=()=>{
  //需要将二级、三级显示数据清空
  //这里也把c2Arr清空了，因为请求反应慢，如果c2Arr有值，会显示之前的值
  categoryStore.c2Id=''
  categoryStore.c2Arr=''
  categoryStore.c3Id=''
  categoryStore.c3Arr=[]
  categoryStore.getC2()
}

//二级菜单选中值后触发
//c3Arr同理
const handler2=()=>{
  categoryStore.c3Id=''
  categoryStore.c3Arr=''
  categoryStore.getC3()
}

onMounted(()=>{
    getC1();
})
</script>

<style scoped>

</style>