// 员工信息接口
import request from '@/utils/request'

// 获取员工列表
export const getEmplListAPI = params => {
  return request.get('/sys/user', { params })
}

// 新增员工
export const addEmplAPI = data => {
  return request.post('/sys/user', data)
}

// 获取员工基本信息
export const getEmplUserAPI = id => {
  return request.get(`/sys/user/${id}`)
}

// 获取员工个人信息
export const getEmplAPI = id => {
  return request.get(`/employees/${id}/personalInfo`)
}

// 获取员工岗位信息
export const getEmplJobsAPI = id => {
  return request.get(`/employees/${id}/jobs`)
}

// 修改员工基本信息/sys/user/{id}
export const updataEmplUserAPI = id => {
  return request.put(`sys/user/${id}`)
}

// 批量导入员工/
export const batchAddEmplAPI = data => {
  return request.post('sys/user/batch', data)
}

// 分配员工角色
export const assignRolesEmplAPI = data => {
  return request.put('/sys/user/assignRoles', data)
}

// 删除员工
export const delEmplAPI = id => {
  return request.delete(`/sys/user/${id}`)
}
