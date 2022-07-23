<template>
  <div class="permission-container">
    <div class="app-container">
      <!-- 表格 -->
      <el-card>
        <div style="text-align: right; margin-bottom: 20px">
          <el-button type="primary" size="small" @click="addPermission({type:1,pid:0})">添加权限</el-button>
        </div>
        <el-table border :data="list" row-key="id">
          <el-table-column label="名称" prop="name" />
          <el-table-column label="标识" prop="code" />
          <el-table-column label="描述" prop="description" />
          <el-table-column label="操作">
            <template #default="{row}">
              <el-button type="text" @click="addPermission({type:2,pid:row.id})">添加</el-button>
              <el-button type="text" @click="updataPermission(row.id)">编辑</el-button>
              <el-button type="text" @click="delPermisission(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <!-- 添加和编辑弹窗 -->
    <el-dialog :visible="showDialog" :title="formData.id?'编辑权限点':'添加权限点'" @close="closeDialog">
      <el-form ref="from" label-width="100px" :model="formData">
        <el-form-item label="权限名称">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="权限标识">
          <el-input v-model="formData.code" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" />
        </el-form-item>
        <el-form-item label="权限启用">
          <el-switch v-model="formData.enVisible" active-text="启用" active-value="1" inactive-text="不启用" inactive-value="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="text-align: right;">
          <el-button @click="showDialog = false">取消</el-button>
          <el-button type="primary" @click="publish">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getPermissionListAPI, addPermissionAPI, delPermissionAPI, getPermissionAPI, updataPermissionAPI } from '@/api/permission'
import transTree from '@/utils/transTree'
export default {
  data() {
    return {
      // 列表信息
      list: [],
      // 控制弹窗显示隐藏
      showDialog: false,
      // 绑定数据
      formData: {
        enVisible: '0', // 开启
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        type: '', // 类型
        pid: '' // 添加到哪个节点下
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取权限点列表
    async getList() {
      const res = await getPermissionListAPI()
      this.list = transTree(res)
    },
    // 关闭弹窗
    closeDialog() {
      this.showDialog = false
      this.formData = {
        enVisible: '0', // 开启
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        type: '', // 类型
        pid: '' // 添加到哪个节点下
      }
      this.$refs.from.resetFields()
    },
    // 添加权限点
    addPermission({ type, pid }) {
      this.showDialog = true
      this.formData.pid = pid
      this.formData.type = type
    },
    // 提交表单
    publish() {
      this.$refs.from.validate(async(valid) => {
        if (!valid) return
        if (this.formData.id) {
          await updataPermissionAPI(this.formData)
        } else {
          await addPermissionAPI(this.formData)
        }
        this.$message.success(`${this.formData.id ? '编辑' : '添加'}成功`)
        this.closeDialog()
        this.getList()
      })
    },
    // 删除权限点
    delPermisission(id) {
      this.$confirm('此操作将永久删除该权限点, 是否继续?', '提示', {
        type: 'warning'
      }).then(async() => {
        await delPermissionAPI(id)
        this.$message.success('删除成功')
        this.getList()
      }).catch(() => { })
    },
    async updataPermission(id) {
      const res = await getPermissionAPI(id)
      this.formData = res
      this.showDialog = true
    }
  }
}
</script>
