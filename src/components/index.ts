//导入所有图标并进行全局注册。
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
//引入项目中全部的全局组件
import SvgIcon from './SvgIcon/index.vue'
import Pagination from './Pagination/index.vue'
import Category from './Category/index.vue'
//全局对象
const allGlobalComponent = { SvgIcon, Pagination, Category }

//对外暴露插件对象
export default {
  //务必叫做install方法
  install(app: any) {
    //注册项目全部的全局组件
    Object.keys(allGlobalComponent).forEach(key => {
      //注册为全局组件
      app.component(key, allGlobalComponent[key])
    })
    //将ele-plus提供图标注册为全局组件
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  }
}