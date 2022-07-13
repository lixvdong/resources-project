import request from '@/utils/request'

// 登录函数
export const loginAPI = data => {
  return request.post('/sys/login', data)
}

// 获取用户基本信息
export const getUserInfoAPI = () => {
  return request.post('/sys/profile')
}

// 获取用户头像
export const getUserAvatarAPI = id => {
  return request.get(`/sys/user/${id}`)
}
