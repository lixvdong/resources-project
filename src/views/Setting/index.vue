<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <!-- 新增角色按钮 -->
        <el-row style="height:60px">
          <el-button
            icon="el-icon-plus"
            size="small"
            type="primary"
            @click="roleDialogVisible = true"
          >新增角色</el-button>
        </el-row>
        <!-- 表格 -->
        <el-table :data="list">
          <el-table-column type="index" :index="indexMethod" label="序号" width="120" />
          <el-table-column prop="name" label="角色名称" width="240" />
          <el-table-column prop="description" label="描述" />
          <el-table-column label="操作" width="240" fixed="right">
            <template #default="{row}">
              <el-button size="small" @click.native="assignPermission(row.id)">分配权限</el-button>
              <el-button size="small" @click.native="updataRole(row.id)">编辑</el-button>
              <el-button size="small" type="danger" @click.native="delRole(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <!-- 分页组件 -->
          <el-pagination
            layout="prev,pager,next"
            :total="total"
            :current-page="queryData.page"
            :page-size="queryData.pagesize"
            @current-change="pageChange"
          />
        </el-row>
      </el-card>
    </div>
    <!-- 弹窗 -->
    <el-dialog title="新增角色" :visible="roleDialogVisible" @close="closeRoleDialog">
      <!-- 表单内容 -->
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="100px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-button size="small" @click.native="closeRoleDialog">取消</el-button>
        <el-button size="small" type="primary" @click.native="publish">确定</el-button>
      </el-row>
    </el-dialog>
    <!-- 分配权限弹窗 -->
    <!-- 分配权限的弹层 -->
    <el-dialog
      title="分配权限(一级为路由页面查看权限-二级为按钮操作权限)"
      :visible="showAssignDialog"
      @close="closeAssignDialog"
      @open="openAssingDialog"
    >
      <!-- 权限点数据展示 -->
      <el-tree
        ref="tree"
        :data="permissionList"
        :props="{ label: 'name' }"
        :default-expand-all="true"
        :show-checkbox="true"
        :check-strictly="true"
        node-key="id"
      />
      <template #footer>
        <div style="text-align: right;">
          <el-button @click="closeAssignDialog">取消</el-button>
          <el-button type="primary" @click="addPermission">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleListAPI, delRoleAPI, addRoleAPI, getRoleAPI, updataRoleAPI } from '@/api/role'
import { getPermissionListAPI } from '@/api/permission'
import transTree from '@/utils/transTree'
import { distRoleAPI } from '@/api/role'
export default {
  data() {
    return {
      // 页面渲染列表
      list: [],
      // 角色总数量
      total: 0,
      // 获取页面渲染列表的参数
      queryData: {
        page: 1,
        pagesize: 5
      },
      // 控制弹窗显示隐藏
      roleDialogVisible: false,
      // 添加角色信息
      roleForm: {
        name: '',
        description: ''
      },
      // 验证信息
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
        description: [{ required: true, message: '角色描述不能为空', trigger: 'blur' }]
      },
      // 控制分配权限弹窗隐藏或显示
      showAssignDialog: false,
      // 权限点列表
      permissionList: [],
      // 添加权限数据
      permiss: {
        id: '',
        permIds: []
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    //   获取角色列表
    async getList() {
      const { rows, total } = await getRoleListAPI(this.queryData)
      this.list = rows
      this.total = total
    },
    // 页码改变
    pageChange(page) {
      this.queryData.page = page
      this.getList()
    },
    // 删除角色
    delRole(id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        type: 'warning'
      }).then(async() => {
        await delRoleAPI(id)
        this.$message.success('删除成功')
        this.getList()
      }).catch(() => {})
    },
    // 关闭弹窗·
    closeRoleDialog() {
      this.roleDialogVisible = false
      this.roleForm = {
        name: '',
        description: ''
      }
    },
    // 添加角色信息 || 编辑角色
    publish() {
      this.$refs.roleForm.validate(async(valid) => {
        if (!valid) return
        if (this.roleForm.id) {
          await updataRoleAPI(this.roleForm)
        } else {
          await addRoleAPI(this.roleForm)
        }
        this.$message.success(`${this.roleForm.id ? '编辑' : '添加'}角色成功`)
        this.getList()
        this.roleDialogVisible = false
        this.$refs.roleForm.resetFields()
        this.roleForm = {
          name: '',
          description: ''
        }
      })
    },
    // 获取编辑角色信息
    async updataRole(id) {
      this.roleDialogVisible = true
      const res = await getRoleAPI(id)
      this.roleForm = res
    },
    // 自定义序号
    indexMethod(index) {
      return index + 1 + (this.queryData.page - 1) * this.queryData.pagesize
    },
    // 打开分配权限弹窗
    async assignPermission(id) {
      this.showAssignDialog = true
      this.permiss.id = id
      const res = await getRoleAPI(id)
      this.$refs.tree.setCheckedKeys(res.permIds)
    },
    // 关闭分配权限点弹窗
    closeAssignDialog() {
      this.showAssignDialog = false
      this.permiss = {
        id: '',
        permIds: []
      }
    },
    // 展示权限列表
    async openAssingDialog() {
      const res = await getPermissionListAPI()
      this.permissionList = transTree(res)
    },
    // 添加权限
    async addPermission() {
      this.permiss.permIds = this.$refs.tree.getCheckedKeys()
      await distRoleAPI(this.permiss)
      this.$message.success('权限分配成功')
      this.closeAssignDialog()
    }
  }
}
</script>
