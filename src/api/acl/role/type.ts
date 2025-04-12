export interface ResponseData {
  code: number,
  message: string,
  ok: boolean
}
//职位数据类型
export interface RoleData {
  id?: number,
  createTime?: string,
  updateTime?: string,
  roleName: string,
  remark?: null
}

//全部职位数组类型
export type Records = RoleData[]

//全部职位相应的数据类型
export interface RoleResponseData extends ResponseData {
  data: {
    records: Records,
    total: number
    size: number,
    current: number,
    orders: [],
    optimizeCountSql: boolean,
    hitCount: boolean,
    countId: null,
    maxLimit: null,
    searchCount: boolean,
    pages: number
  }
}

//权限数据类型
export interface PermissionData {
  id: number,
  createTime: string,
  updateTime: string,
  pid: number,
  name: string,
  code: string,
  toCode: string,
  type: number,
  status: null,
  level: number,
  children: PermissionList,
  select: boolean
}

export type PermissionList = PermissionData[]

//权限返回类型
export interface PermissionResponseData extends ResponseData {
  data: PermissionList
}