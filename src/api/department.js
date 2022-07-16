// 组织结构接口
import request from '@/utils/request'

// 获取部门列表
export const getDepartmentListAPI = () => {
  return request.get('/company/department')
}

// 获取部门负责人列表
export const getDepartmentUserAPI = () => {
  return request.get('/sys/user/simple')
}

// 新增部门
export const addDepartmentAPI = data => {
  return request.post('/company/department', data)
}

// 获取部门详情
export const getDepartmentAPI = id => {
  return request.get(`/company/department/${id}`)
}

// 修改部门详情
export const updataDepartmentAPI = data => {
  return request.put(`/company/department/${data.id}`, data)
}

// 删除部门详情
export const delDepartmentAPI = id => {
  return request.delete(`/company/department/${id}`)
}
