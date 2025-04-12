import pinia from '@/store'
//按钮权限实现
import useUserStore from '@/store/modules/user'

//获取用户相关仓库
// let userStore = useUserStore(pinia)//pinia持久化失败

export const isHasButton = (app: any) => {
  const userStore = useUserStore(pinia)  //pinia持久化成功(这里必须在函数内部调用)
  //全局自定义指令：实现按钮权限
  app.directive('has', {
    //代表使用这个自定义指令的DOM组件挂载完毕时执行一次
    mounted(el: any, option: any) {
      //自定义指令右侧的数值:如果在用户信息buttons数组当中没有
      //从DOM树上干掉
      if (!userStore.buttons.includes(option.value)) {
        // el.parentNode.removeChild(el)
        el.remove()
      }

    }
  })
}