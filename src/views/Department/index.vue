<template>
  <div class="department-container">
    <div class="app-container">
      <el-card>
        <!-- 用一个行列布局 -->
        <el-row type="flex" justify="space-between" align="middle" style="height: 40px">
          <el-col :span="20">
            <span>江苏传智播客教育科技股份有限公司</span>
          </el-col>
          <el-col :span="4">
            <el-row type="flex" justify="end">
              <!-- 两个内容 -->
              <el-col>负责人</el-col>
              <el-col>操作</el-col>
            </el-row>
          </el-col>
        </el-row>
        <!-- 放置一个树状图组件 -->
        <el-tree :data="list" default-expand-all :props="defaultProps">
          <template #default="{ data }">
            <el-row
              type="flex"
              justify="space-between"
              align="middle"
              style="height: 40px; width: 100%;"
            >
              <el-col :span="20">
                <span>{{ data.name }}</span>
              </el-col>
              <el-col :span="4">
                <el-row type="flex" justify="end">
                  <!-- 两个内容 -->
                  <el-col>{{ data.manager }}</el-col>
                  <el-col>
                    <!-- 下拉菜单 element -->
                    <el-dropdown>
                      <span> 操作<i class="el-icon-arrow-down" /> </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>添加子部门</el-dropdown-item>
                        <el-dropdown-item>编辑部门</el-dropdown-item>
                        <el-dropdown-item>删除部门</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-tree>
      </el-card>
    </div>
  </div>
</template>

<script>
// 引入接口方法
import { getDepartmentListAPI } from '@/api/department'
// 引入树形数据处理函数
import transTree from '@/utils/transTree'
export default {
  data() {
    return {
      // 页面渲染信息
      list: [],
      // 修改树状图的传值
      defaultProps: {
        label: 'name'
      },
      // 新增部门信息
      addDepartment: {
        code: '',
        introduce: '',
        manager: '',
        name: '',
        pid: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取组织列表方法
    async getList() {
      const res = await getDepartmentListAPI()
      this.list = transTree(res.depts)
    }
  }
}
</script>
