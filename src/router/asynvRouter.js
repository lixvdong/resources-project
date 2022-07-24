// 动态路由控制
import Layout from '@/layout'
const asyncRouter = [
  // 组织架构
  {
    path: '/department',
    component: Layout,
    children: [{
      path: '',
      name: 'departments',
      component: () => import('@/views/Department/index'),
      meta: { title: '组织架构', icon: 'tree' }
    }]
  },
  // 权限点
  {
    path: '/permission',
    component: Layout,
    children: [{
      path: '',
      name: 'permissions',
      component: () => import('@/views/Permission/index'),
      meta: { title: '权限点管理', icon: 'lock' }
    }]
  },
  // 员工管理
  {
    path: '/employee',
    component: Layout,
    children: [{
      path: '',
      name: 'employees',
      component: () => import('@/views/Employee/index'),
      meta: { title: '员工管理', icon: 'people' }
    }]
  },
  // 角色管理
  {
    path: '/setting',
    component: Layout,
    children: [{
      path: '',
      name: 'settings',
      component: () => import('@/views/Setting/index'),
      meta: { title: '角色管理', icon: 'setting' }
    }]
  },
  // 工资管理
  {
    path: '/salary',
    component: Layout,
    children: [{
      path: '',
      name: 'salarys',
      component: () => import('@/views/Salary/index'),
      meta: { title: '工资管理', icon: 'money' }
    }]
  }
]

export default asyncRouter
