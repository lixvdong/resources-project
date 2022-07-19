<template>
  <el-dialog title="新增员工" :visible="visible" @close="closeDialog" @open="openDialog">
    <!-- 表单 -->
    <template>
      <el-form ref="addForm" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="姓名" prop="username">
          <el-input v-model="formData.username" style="width:50%" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="formData.mobile" style="width:50%" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="入职时间" prop="timeOfEntry">
          <el-date-picker v-model="formData.timeOfEntry" style="width:50%" placeholder="请选择入职时间" />
        </el-form-item>
        <el-form-item label="聘用形式" prop="formOfEmployment">
          <el-select v-model="formData.formOfEmployment" style="width:50%" placeholder="请选择">
            <el-option v-for="item in fromOfList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="工号" prop="workNumber">
          <el-input v-model="formData.workNumber" style="width:50%" placeholder="请输入工号" />
        </el-form-item>
        <el-form-item label="部门" prop="departmentName">
          <el-cascader
            v-model="formData.departmentName"
            :options="depateList"
            :props="{ checkStrictly: true, value:'name',label:'name' }"
            clearable
          />
        </el-form-item>
        <el-form-item label="转正时间" prop="correctionTime">
          <el-date-picker v-model="formData.correctionTime" style="width:50%" placeholder="请选择转正时间" />
        </el-form-item>
      </el-form>
    </template>
    <!-- footer插槽 -->
    <template #footer>
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="publish">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { addEmplAPI } from '@/api/employee'
import { getDepartmentListAPI } from '@/api/department'
import transTree from '@/utils/transTree'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 表格数据
      formData: {
        username: '', // 用户名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      },
      // 验证信息
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 4, message: '用户姓名为1-4位', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: ['blur', 'change'] },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: ['blur', 'change'] }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: ['blur', 'change'] }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: ['blur', 'change'] }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: ['blur', 'change'] }
        ],
        timeOfEntry: [
          { required: true, message: '请选择入职时间', trigger: ['blur', 'change'] }
        ]
      },
      // 聘用形式
      fromOfList: [
        { id: 1, name: '正式' },
        { id: 2, name: '非正式' }
      ],
      // 部门
      depateList: []
    }
  },
  methods: {
    // 关闭弹窗
    closeDialog() {
      this.$emit('close-dialog')
      this.resetFrom()
    },
    // 打开弹窗
    async openDialog() {
      const res = await getDepartmentListAPI()
      this.depateList = transTree(res.depts)
    },
    // 清空表单数据
    resetFrom() {
      this.formData = {
        username: '', // 用户名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      }
      this.$refs.addForm.resetFields()
    },
    // 提交数据添加员工
    publish() {
      this.$refs.addForm.validate(async(valid) => {
        if (!valid) return
        this.formData.departmentName = this.formData.departmentName[this.formData.departmentName.length - 1]
        await addEmplAPI(this.formData)
        this.$message.success('添加成功')
        this.resetFrom()
        this.$emit('close-dialog')
      })
    }
  }
}
</script>
