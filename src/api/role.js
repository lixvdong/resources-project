// 角色相关请求
import request from '@/utils/request'

// 获取角色列表
export const getRoleListAPI = data => {
  return request.get('/sys/role', { params: data })
}

// 新增角色
export const addRoleAPI = data => {
  return request.post('/sys/role', data)
}

// 获取角色详情
export const getRoleAPI = id => {
  return request.get(`/sys/role/${id}`)
}

// 修改角色详情
export const updataRoleAPI = data => {
  return request.put(`/sys/role/${data.id}`, data)
}

// 删除角色
export const delRoleAPI = id => {
  return request.delete(`/sys/role/${id}`)
}

// 分配角色权限
export const distRoleAPI = data => {
  return request.put('/sys/role/assignPrem', data)
}
