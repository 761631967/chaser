import { createApp } from 'vue'
import App from './App.vue'
//Svg插件需要配置代码
// @ts-ignore
import 'virtual:svg-icons-register'
//引入element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//暗黑模式
import 'element-plus/theme-chalk/dark/css-vars.css'
//配置element-plus国际化
//@ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn'
import SvgIcon from './components/SvgIcon/index.vue'
import './styles/index.scss'
//引入路由  
import router from './router'
//引入仓库
import pinia from './store'
//引入自定义插件对象：注册整个项目全局组件
import globalComponent from '@/components'
//引入路由鉴权
import './permission'
//引入自定义指令
import { isHasButton } from './directive/has'
//获取应用实例对象
const app = createApp(App)

//安装element-plus插件
app.use(ElementPlus, {
  locale: zhCn
})
//安装自定义插件
app.use(globalComponent)

isHasButton(app)
//注册模板路由
app.use(router)
//安装仓库
app.use(pinia)
//挂载应用
app.mount('#app')
