//路由鉴权，项目当中的路由能不能被访问的权限的设置
import router from './router'
import setting from './setting'
import nprogress from 'nprogress'
//引入进度条样式
import 'nprogress/nprogress.css'
nprogress.configure({ showSpinner: false });
//引入大仓库
import pinia from './store'
//获取用户仓库token判断用户是否登录
import useUserStore from './store/modules/user'
let userStore = useUserStore(pinia)

// 加一个标志位防止重复加载异步路由
let isAsyncRouteAdded = false
//问题一:任意路由切换实现加载进度条业务
//问题二:路由鉴权，用户未登录，可以访问login，其余路由不能访问;登录成功后不可访问login,其余路由可以访问

//全局前置守卫
router.beforeEach(async (to: any, from: any, next: any) => {
  document.title = `${setting.title}-${to.meta.title}`
  //访问路由之前守卫
  nprogress.start()
  //获取token
  let token = userStore.token

  //获取用户名字
  let username = userStore.username

  if (token) {
    //登录成功，不能访问login，指向首页
    if (to.path == '/login') {
      next({ path: '/' })
    } else {
      //如果有用户信息
      if (username) {
        next()
      } else {
        //如果没有用户信息，守卫这里发送请求获得用户信息后放行
        try {
          await userStore.userInfo()
          //万一刷新时候是异步路由，有可能获取到用户信息，但是路由没有加载完毕，出现刷新空白效果
          // 设置标志位，防止重复添加
          isAsyncRouteAdded = true
          // next({ ...to }) // 🚨重新跳转当前路由,但是容易死循环
          // 避免空白页面，重新跳转一次，replace 避免死循环
          next({ ...to, replace: true })
        } catch (err) {
          //token过期，获取不到用户信息
          //或者用户手动修改本地存储
          await userStore.userLogout();
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    if (to.path == '/login') {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})

//全局后置守卫
router.afterEach((to: any, from: any) => {
  nprogress.done()
})