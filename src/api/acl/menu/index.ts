//菜单管理接口
import request from '@/utils/request'
import type { PermissionResponseData, PermissionParams } from './type'
//枚举地址
enum API {
  //获取全部菜单
  ALLPERMISSION_URL = '/admin/acl/permission',
  //新增菜单
  ADDPERMISSION_URL = '/admin/acl/permission/save',
  //更新已有菜单
  UPDATEPERMISSION_URL = '/admin/acl/permission/update',
  //删除菜单
  DELETEPERMISSION_URL = '/admin/acl/permission/remove/'
}
export const reqAllPermission = () => request.get<any, PermissionResponseData>(API.ALLPERMISSION_URL)
export const reqAddOrUpdatePermission = (data: PermissionParams) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEPERMISSION_URL, data)
  } else {
    return request.post<any, any>(API.ADDPERMISSION_URL, data)
  }
}
export const reqRemovePermission = (id: number) => request.delete<any, any>(API.DELETEPERMISSION_URL + id)