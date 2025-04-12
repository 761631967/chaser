//用户管理模块接口
import request from '@/utils/request'
import type { UserResponseData, User, AllRoleResponseData, SetRoleData } from './type'
//枚举地址
enum API {
  //获取全部已有用户账户信息
  ALLUSER_URL = '/admin/acl/user/',
  //添加新用户账户
  ADDUSER_URL = '/admin/acl/user/save',
  //更新已有用户信息
  UPDATEUSER_URL = '/admin/acl/user/update',
  //获取全部职位，当前账户拥有职位接口
  ALLROLE_URL = '/admin/acl/user/toAssign/',
  //给已有用户分配角色
  SETROLE_URL = '/admin/acl/user/doAssignRole',
  //删除某一个账号
  DELETEUSER_URL = '/admin/acl/user/remove/',
  //批量删除接口
  DELETEALLUSER_URL = '/admin/acl/user/batchRemove'
}
export const reqUserInfo = (page: number, limit: number, username: string) => request.get<any, UserResponseData>(API.ALLUSER_URL + `${page}/${limit}/?username=${username}`)
export const reqAddOrUpdateUser = (data: User) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEUSER_URL, data)
  } else {
    return request.post<any, any>(API.ADDUSER_URL, data)
  }
}
export const reqAllRole = (userId: number) => request.get<any, AllRoleResponseData>(API.ALLROLE_URL + userId)
export const reqSetUserRole = (data: SetRoleData) => request.post<any, any>(API.SETROLE_URL, data)
export const reqRemoveUser = (userId: number) => request.delete<any, any>(API.DELETEUSER_URL + userId)
export const reqBatchRemoveUser = (idList: number[]) => request.delete<any, any>(API.DELETEALLUSER_URL, { data: idList })