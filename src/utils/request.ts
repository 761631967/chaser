//进行axios二次封装：使用请求和响应拦截器
import axios from 'axios'
import ElMessage from 'element-plus'
//引入用户相关仓库
import useUserStore from '../store/modules/user';
//第一步：利用axios创建一个axios实例
let request = axios.create({
  //基础路径
  baseURL: import.meta.env.VITE_APP_BASE_API,//基础路径上会携带/api
  timeout: 5000,//请求超时时间
})
//第二步，request添加请求和响应拦截器
request.interceptors.request.use((config) => {
  //获取仓库内部token,登录成功后携带给服务器
  let userStore = useUserStore()
  if (userStore.token) {
    //config配置对象, headers属性请求头,经常给服务器端携带公共参数
    config.headers.token = userStore.token
  }
  // config配置对象, headers属性请求头,经常给服务器端携带公共参数
  //返回配置对象
  return config
});
//第三步响应拦截器
request.interceptors.response.use((response) => {
  return response.data
}, (error) => {
  let message = ''
  let status = error.response.status
  switch (status) {
    case 400:
      message = '请求参数错误'
      break
    case 401:
      message = 'TOKEN过期'
      break
    case 403:
      message = '拒绝访问'
      break
    case 404:
      message = '请求地址错误'
      break;
    case 500:
      message = '服务器内部错误'
      break;
    default:
      message = '网络错误'
      break
  }
  //提示错误信息
  //@ts-ignore
  ElMessage({
    type: 'error',
    message
  })
  return Promise.reject(error)
})

//对外暴露
export default request