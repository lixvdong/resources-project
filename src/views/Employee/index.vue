<template>
  <div class="employees-container">
    <div class="app-container">
      <!-- 自定义组件 -->
      <PageTools>
        <template #left>
          <div class="tips">
            <i class="el-icon-info" />
            <span>本月: 社保在缴 公积金在缴</span>
          </div>
        </template>
        <template #right>
          <el-button type="warning" size="small" @click="$router.push('/import')">excel导入</el-button>
          <el-button type="danger" size="small" @click="exportExecl">excel导出</el-button>
          <el-button type="primary" size="small" @click="visibleDialog = true">新增员工</el-button>
        </template>
      </PageTools>
      <!-- 表格 -->
      <el-card style="margin-top: 10px;">
        <el-table border :data="list">
          <el-table-column label="序号" type="index" :index="indexMethod" />
          <el-table-column label="姓名" prop="username" />
          <el-table-column label="头像" width="110">
            <template #default="scope">
              <!-- <img :src="scope.row.staffPhoto" alt="" width="80"> -->
              <el-image :src="scope.row.staffPhoto" class="avatar">
                <!-- 具名插槽新语法  图片加载出错的时候自动显示 -->
                <template #error>
                  <!-- <i class="el-icon-picture-outline" /> -->
                  <img src="@/assets/common/bigUserHeader.png" width="80">
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="工号" prop="workNumber" />
          <el-table-column label="聘用形式">
            <template #default="{row}">
              {{ row.formOfEmployment === 1 ? '正式':'非正式·' }}
            </template>
          </el-table-column>
          <el-table-column label="部门" prop="departmentName" />
          <el-table-column label="入职时间" width="180">
            <template #default="{row}">
              {{ row.timeOfEntry | timer }}
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="200">
            <template #default="{row}">
              <el-button type="text" size="small" @click="showEmployee(row.id)">查看</el-button>
              <el-button type="text" size="small" @click="assignRole(row.id)">分配角色</el-button>
              <el-button type="text" size="small" @click="delEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <div style="height: 60px; margin-top: 10px">
          <el-pagination :total="total" :current-page="params.page" :page-size="params.size" layout="prev, pager, next" @current-change="pageChange" />
        </div>
      </el-card>
    </div>
    <add-employee :visible="visibleDialog" @close-dialog="closeDialog" />

    <!-- 员工分配角色弹窗 -->
    <el-dialog
      class="assign-role"
      title="分配角色"
      :visible="showRoleDialog"
      @close="closeRole"
      @open="openRole"
    >
      <el-checkbox-group v-model="roleIds">
        <el-checkbox v-for="item in roleList" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
      </el-checkbox-group>
      <!-- 这里准备复选框 -->
      <template #footer>
        <el-button type="primary" size="small" @click="addRole">确定</el-button>
        <el-button size="small" @click="closeRole">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { getEmplListAPI, delEmplAPI, assignRolesEmplAPI, getEmplUserAPI } from '@/api/employee'
import addEmployee from './ImportExecl/add-employee.vue'
import { getExportData } from '@/utils/execl'
import { getRoleListAPI } from '@/api/role'
export default {
  filters: {
    timer(val) {
      return dayjs(val).format('YYYY-MM-DD')
    }
  },
  components: { addEmployee },
  data() {
    return {
      // 员工列表
      list: [],
      // 请求参数
      params: {
        page: 1,
        size: 5
      },
      // 员工总数
      total: 0,
      // 控制弹窗显示隐藏
      visibleDialog: false,
      // 控制员工分配角色弹窗
      showRoleDialog: false,
      // 已选的角色列表
      roleIds: [],
      // 角色id
      roleId: null,
      // 角色列表
      roleList: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取员工列表
    async getList() {
      const res = await getEmplListAPI(this.params)
      this.list = res.rows
      this.total = res.total
    },
    // 表格序号整齐划一
    indexMethod(index) {
      return index + 1 + (this.params.page - 1) * this.params.size
    },
    // 页面改变
    pageChange(page) {
      this.params.page = page
      this.getList()
    },
    // 删除员工
    delEmployee(id) {
      this.$confirm('此操作将永久删除该员工, 是否继续?', '提示', {
        type: 'warning'
      }).then(async() => {
        await delEmplAPI(id)
        this.$message.success('删除成功!')
        this.getList()
      }).catch(() => { })
    },
    // 关闭弹窗
    closeDialog() {
      this.visibleDialog = false
      this.getList()
    },
    // 导出表格
    exportExecl() {
      import('@/vendor/Export2Excel').then(async(excel) => {
        const res = await getEmplListAPI(this.params)
        const headerRelation = {
          '姓名': 'username',
          '手机号': 'mobile',
          '入职日期': 'timeOfEntry',
          '工号': 'workNumber',
          '聘用形式': 'formOfEmployment',
          '部门': 'departmentName'
        }
        const { data } = getExportData(res.rows, headerRelation)
        excel.export_json_to_excel({
          header: Object.keys(headerRelation),
          data,
          filename: 'execl-list',
          autoWidth: true,
          bookType: 'xlsx'
        })
        this.$message.success('导出成功')
      })
    },
    // 查看员工详情
    showEmployee(id) {
      this.$router.push({
        path: '/detail',
        query: {
          id
        }
      })
    },
    // 打开分配角色弹窗
    async assignRole(id) {
      this.showRoleDialog = true
      this.roleId = id
      const res = await getEmplUserAPI(id)
      this.roleIds = res.roleIds
    },
    // 关闭分配角色弹窗
    closeRole() {
      this.showRoleDialog = false
      this.roleIds = []
      this.roleId = null
    },
    // 获取角色列表
    async openRole() {
      const res = await getRoleListAPI({ page: 1, pagesize: 100 })
      this.roleList = res.rows
    },
    // 添加角色
    async addRole() {
      await assignRolesEmplAPI({
        id: this.roleId,
        roleIds: this.roleIds
      })
      this.$message.success('添加角色成功')
      this.closeRole()
    }
  }
}
</script>

<style lang='scss' scoped>
.avatar{
  width: 80px;
  height: 80px;
  background-color: #f3f3f3;
  object-fit: cover;
  border-radius: 50%;
}

</style>
