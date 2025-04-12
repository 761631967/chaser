//创建用户相关小仓库
import { defineStore } from 'pinia'
//引入接口
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
//引入数据类型
import type { loginFormData, loginResponseData, userInfoResponseData } from "../../api/user/type";
import type { UserState } from './types/type'
//引入操作本地存储方法
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
//引入路由(常量)
import { constantRoute, asyncRoute, anyRoute } from '@/router/routes'
//引入路由
import router from '@/router'
//引入深拷贝
//@ts-ignore
import cloneDeep from 'lodash/cloneDeep'

//用于过滤异步路由
function filterAsyncRoute(asyncRoute: any, routes: any) {
  return asyncRoute.filter((item: any) => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoute(item.children, routes)
      }
      return true
    }
  })
}

//创建用户小仓库
let useUserStore = defineStore('user', {
  //小仓库存储数据的地方
  state: (): UserState => {
    return {
      token: GET_TOKEN(),//用户唯一标识
      menuRoutes: constantRoute,//仓库存储生成的菜单路由
      username: '',
      avatar: '',
      //存储当前用户是否包含某一个按钮
      buttons: []
    }
  },
  //异步、逻辑的地方
  actions: {
    //用户登录的方法
    async userLogin(data: loginFormData) {
      let result: loginResponseData = await reqLogin(data)

      if (result.code == 200) {
        //pinia/vuex存储数据其实是利用JS对象
        this.token = (result.data as string)
        //为了保证刷新后还能保持用户状态，应该本地存储token
        SET_TOKEN(result.data as string)
        return 'request success'
      } else {
        return Promise.reject(new Error(result.data))
      }

    },
    //获取用户信息方法
    async userInfo() {
      //获取用户头像、token
      let res: userInfoResponseData = await reqUserInfo()
      //如果获取用户信息成功，存储用户信息
      if (res.code == 200) {
        this.username = res.data.name
        this.avatar = res.data.avatar
        this.buttons = res.data.buttons
        //计算当前用户需要展示的异步路由
        let userAsyncRoute = filterAsyncRoute(cloneDeep(asyncRoute), res.data.routes);
        //菜单需要的数据
        this.menuRoutes = [...constantRoute, ...userAsyncRoute, anyRoute];
        //目录路由器只有常量路由,计算出的路由得动态添加
        [...userAsyncRoute, anyRoute].forEach((route: any) => {
          router.addRoute(route)
        })
        return 'ok'
      } else {
        return Promise.reject(new Error(res.message))
      }
    },
    //退出清空用户信息
    async userLogout() {
      let res: any = await reqLogout()
      if (res.code == 200) {
        //目前没有mock接口：退出登录接口
        this.token = ''
        this.username = ''
        this.avatar = ''
        REMOVE_TOKEN()
        return 'ok'
      } else {
        return Promise.reject(new Error(res.message))
      }
    }
  },
  getters: {

  }
})
//对外暴露小仓库
export default useUserStore