<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form class="login_form" :model="loginForm" :rules="rules" ref="loginFormRef">
          <h1>Hello</h1>
          <h2>欢迎来到幻兽帕鲁</h2>
          <!-- 登录账户 -->
          <el-form-item prop="username">
            <el-input :prefix-icon="User" v-model="loginForm.username"></el-input>
          </el-form-item>
          <!-- 登录密码 -->
          <el-form-item prop="password">
            <el-input type="password" :prefix-icon="Lock" v-model="loginForm.password" show-password></el-input>
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" class="login_btn" type="primary" size="default" @click="login">登录</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import {User,Lock} from "@element-plus/icons-vue";
import { reactive, ref} from "vue";
import { useRouter,useRoute } from "vue-router"; 
import { ElNotification } from "element-plus";
//引入获取时间函数
import { getTime } from "@/utils/time";
//引入用户相关仓库
import useUserStore from "@/store/modules/user";
let useStore= useUserStore()
//获取el-form组件
let loginFormRef=ref()
//定义变量控制按钮加载效果
let loading=ref(false)
//获取路由
let $router=useRouter()
let $route=useRoute()
//收集账号和密码
let loginForm=reactive({
  username:"admin",
  password:"111111"
})
//登录按钮回调
const login=async()=>{
  //保证全部表单校验通过再发请求
  await loginFormRef.value.validate()

  loading.value=true
  try{
    await useStore.userLogin(loginForm)
    let redirect:any=$route.query.redirect
    $router.push({path:redirect||'/'})
    //登录成功提示信息
    ElNotification({
      type:'success',
      message:"登录成功",
      title:`HI,${getTime()}好`
    })
    loading.value=false
  }catch(error){
    loading.value=false
    //登录失败提示信息
    ElNotification({
      type:'error',
      message:(error as Error).message
    })
  }
}

//定义表单检验需要的配置对象
const rules=reactive({
  username:[
    {required:true,min:5,max:10,message:"账户长度5到10位",trigger:"change"},
  ],
  password:[
  {required:true,min:6,max:15,message:"密码长度6到15位",trigger:"blur"},
  ]
})
</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;


  .login_form{
    position: relative;
    width: 80%;
    top: 30vh;
    background: url("@/assets/images/login_form.png") no-repeat;
    background-size: cover;
    padding: 40px;

    h1{
      color: white;
      font-size: 40px;
    }

    h2{
      font-size: 20px;
      color: white;
      margin: 20px 0;
    }
    .login_btn{
      width: 100%;
    }
  }
}
</style>