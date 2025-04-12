//数据类型定义
export interface ResponseData {
  code: number,
  message: string,
  ok: boolean,
}

//菜单数据类型
export interface Permission {
  id?: number,
  createTime: string,
  updateTime: string,
  pid: string,
  name: string,
  code: null,
  toCode: null,
  type: number,
  status: null,
  level: number,
  children?: PermissionList
  select: boolean,
}

export type PermissionList = Permission[]

//菜单接口返回数据类型
export interface PermissionResponseData extends ResponseData {
  data: PermissionList
}

//添加与修改携带参数类型
export interface PermissionParams {
  id?: number,
  code: string,//权限数值
  level: number,//几级菜单
  name: string,//菜单名称
  pid: number,//菜单id，一级菜单为0
}