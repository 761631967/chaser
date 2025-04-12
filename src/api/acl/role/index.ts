//角色管理模块接口
import request from '@/utils/request'
import type { RoleResponseData, RoleData, PermissionResponseData } from './type'

enum API {
  //获取全部职位接口
  ALLROLE_URL = '/admin/acl/role/',
  //新增职位接口地址
  ADDROLE_URL = '/admin/acl/role/save',
  //更新已有职位
  UPDATEROLE_URL = '/admin/acl/role/update',
  //获取全部菜单和按钮
  ALLPERMISSION_URL = '/admin/acl/permission/toAssign/',
  //分配权限请求
  SETPREMISSION_URL = '/admin/acl/permission/doAssign/?',
  //删除已有职位
  REMOVEROLE_URL = '/admin/acl/role/remove/'
}

export const reqAllRoleList = (page: number, limit: number, roleName: string) => request.get<any, RoleResponseData>(API.ALLROLE_URL + `${page}/${limit}/?roleName=${roleName}`)
export const reqAddOrUpdateRole = (data: RoleData) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEROLE_URL, data)
  } else {
    return request.post<any, any>(API.ADDROLE_URL, data)
  }
}
export const reqAllPermissionList = (roleId: number) => request.get<any, PermissionResponseData>(API.ALLPERMISSION_URL + roleId)
export const reqSetPermission = (roleId: number, permissionId: number[]) => request.post<any, any>(API.SETPREMISSION_URL + `roleId=${roleId}&permissionId=${permissionId}`)
export const reqRemoveRole = (roleId: number) => request.delete<any, any>(API.REMOVEROLE_URL + roleId)