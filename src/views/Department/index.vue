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
                        <el-dropdown-item @click.native="openDial(data.id,'添加部门')">添加子部门</el-dropdown-item>
                        <el-dropdown-item @click.native="updataDial(data.id,'编辑部门')">编辑部门</el-dropdown-item>
                        <el-dropdown-item @click.native="delDial(data.id)">删除部门</el-dropdown-item>
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
    <!-- 弹出框 -->
    <el-dialog :title="title" :visible="dialogVisible" @close="closeDial">
      <el-form ref="from" label-width="120px" :model="from" :rules="rules">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="from.name" style="width:80%" placeholder="1-50个字符" />
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input v-model="from.code" style="width:80%" placeholder="1-50个字符" />
        </el-form-item>
        <el-form-item label="部门负责人" prop="manager">
          <el-select v-model="from.manager" style="width:80%" placeholder="请选择">
            <el-option v-for="item in managerList" :key="item.id" :label="item.username" :value="item.username" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门介绍" prop="introduce">
          <el-input v-model="from.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" size="small" @click="publish">确定</el-button>
        <el-button size="small" @click="closeDial">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
// 引入接口方法
import { getDepartmentListAPI, getDepartmentUserAPI, addDepartmentAPI, getDepartmentAPI, updataDepartmentAPI, delDepartmentAPI } from '@/api/department'
// 引入树形数据处理函数
import transTree from '@/utils/transTree'
export default {
  data() {
    const validateCode = (rule, value, callback) => {
      if (this.codeArr.includes(value)) {
        callback(new Error('部门编码不能重复'))
      }
      callback()
    }
    return {
      // 弹出框的提示
      title: '',
      // 页面渲染信息
      list: [],
      // 修改树状图的传值
      defaultProps: {
        label: 'name'
      },
      // 新增部门信息
      from: {
        code: '',
        introduce: '',
        manager: '',
        name: '',
        pid: ''
      },
      // 验证条件
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: ['blur', 'change'] }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: ['blur', 'change'] },
          { validator: validateCode, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: ['blur', 'change'] }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 300, message: '部门介绍要求1-300个字符', trigger: ['blur', 'change'] }
        ]
      },
      // 控制弹出框的显示与隐藏
      dialogVisible: false,
      // 负责人列表
      managerList: [],
      // 部门编码数组
      codeArr: []
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
      this.arr = res.depts
      this.codeArr = this.arr.map(item => item.code)
    },
    // 弹出框隐藏
    closeDial() {
      this.dialogVisible = false
      this.$refs.from.resetFields()
      this.resetFrom()
      this.getList()
    },
    // 显示弹出框
    async openDial(id, title) {
      this.title = title
      this.dialogVisible = true
      this.from.pid = id
      const res = await getDepartmentUserAPI()
      this.managerList = res
    },
    // 添加部门 或者 编辑部门
    publish() {
      this.$refs.from.validate(async(valid) => {
        if (!valid) return
        if (this.from.id) {
          await updataDepartmentAPI(this.from)
        } else {
          await addDepartmentAPI(this.from)
        }
        this.$message.success(`${this.from.id ? '编辑' : '添加'}部门成功`)
        this.getList()
        this.dialogVisible = false
        this.$refs.from.resetFields()
      })
    },
    // 编辑部门数据回填
    async updataDial(id, title) {
      this.title = title
      this.dialogVisible = true
      const res = await getDepartmentAPI(id)
      this.from = res
      this.codeArr = this.codeArr.filter(item => item !== this.from.code)
    },
    //  清空表单
    resetFrom() {
      this.from = {
        code: '',
        introduce: '',
        manager: '',
        name: '',
        pid: ''
      }
    },
    // 删除部门
    delDial(id) {
      this.$confirm('此操作将永久删除该部门, 是否继续?', '提示', {
        type: 'warning'
      }).then(async() => {
        await delDepartmentAPI(id)
        this.$message.success('删除成功')
        this.getList()
      }).catch(() => {
      })
    }
  }
}
</script>
