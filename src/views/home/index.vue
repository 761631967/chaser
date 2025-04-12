<template>
  <el-card class="box">
    <img :src="userStore.avatar" alt="" class="avatar">
    <div>
      <h3 class="title">{{ getTime() }}好,{{ userStore.username }}</h3>
      <p class="subtitle">芙蓉王源尼古丁真平台</p>
    </div>
  </el-card>

  <div class="picture">
    <img src="@/assets/images/background.jpg" style="width:75%;height:100%;object-fit: contain" />
  </div>
</template>

<script setup lang="ts">
//引入用户相关仓库
import useUserStore from '@/store/modules/user'
import {getTime} from '@/utils/time'
//获取存储用户信息对象
let userStore = useUserStore()
</script>

<style scoped lang="scss">
.box {
  //这里用v-deep强行修改了
  :deep(.el-card__body) {
    display: flex;
    align-items: center;  /* 垂直居中 */
    gap: 20px;           /* 子元素间距 */
  }

  .avatar{
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }

  .title{
    font-size: 40px;
    margin-bottom: 20px;
    font-weight: 700;
  }

  .subtitle{
    font-style: italic;
    color: purple
  }
}

.picture{
  display: flex;
  justify-content: center;
  margin-top: 5px;
}
</style>