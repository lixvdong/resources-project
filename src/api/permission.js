// 权限点接口

import request from '@/utils/request'

// 获取权限点列表
export const getPermissionListAPI = () => {
  return request.get('/sys/permission')
}

// 新增权限点
export const addPermissionAPI = data => {
  return request.post('/sys/permission', data)
}

// 获取权限点详情
export const getPermissionAPI = id => {
  return request.get(`/sys/permission/${id}`)
}

// 修改权限点详情
export const updataPermissionAPI = data => {
  return request.put(`/sys/permission/${data.id}`, data)
}

// 删除权限点
export const delPermissionAPI = id => {
  return request.delete(`/sys/permission/${id}`)
}
