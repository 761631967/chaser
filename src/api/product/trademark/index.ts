//品牌管理模块接口
import request from "../../../utils/request";
//引入ts类型
import type { TrademarkResponseData, Trademark } from "./type";
//品牌管理模块接口地址
enum API {
  //获取已有品牌接口
  TRADEMARK_URL = '/admin/product/baseTrademark/',
  //添加品牌
  ADDTRADEMARK_URL = '/admin/product/baseTrademark/save',
  //修改品牌
  UPDATETRADEMARK_URL = '/admin/product/baseTrademark/update',
  //删除品牌
  DELETETRADEMARK_URL = '/admin/product/baseTrademark/remove/'
}
//获取已有品牌的接口方法
//page:当前页页码;limit:每页显示条数
export const reqHasTrademark = (page: number, limit: number) => request.get<any, TrademarkResponseData>(API.TRADEMARK_URL + `${page}/${limit}`)

//添加与修改已有品牌方法
export const reqAddOrUpdateTrademark = (data: Trademark) => {
  if (data.id) {
    //有id就是修改
    return request.put<any, any>(API.UPDATETRADEMARK_URL, data)
  } else {
    //没有就是新增
    return request.post<any, any>(API.ADDTRADEMARK_URL, data)
  }
}

//删除品牌方法
export const reqDeleteTrademark = (id: number) => request.delete<any, any>(API.DELETETRADEMARK_URL + id)