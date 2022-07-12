import request from '@/utils/request'

// 登录函数
export const login = data => {
  return request.post('/sys/login', data)
}
