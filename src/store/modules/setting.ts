//小仓库，关于layout相关组件配置
import { defineStore } from 'pinia'

let useLayoutSettingStore = defineStore('SettingStore', {
  state: () => {
    return {
      fold: false,//用户控制菜单折叠还是收起
      refresh: false,//刷新页面
    }
  }
})

export default useLayoutSettingStore