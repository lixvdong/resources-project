<template>
  <div class="employees-container">
    <div class="app-container">
      <el-card>
        <!-- 放置表单 -->
        <el-form ref="userForm" label-width="120px" :model="userInfo" :rules="rules" style="margin-left: 120px; margin-top:30px">
          <el-form-item label="姓名:" prop="username">
            <el-input v-model="userInfo.username" style="width:300px" />
          </el-form-item>

          <el-form-item label="手机">
            <el-input v-model="userInfo.mobile" disabled style="width:300px" />
          </el-form-item>

          <el-form-item label="入职时间">
            <el-date-picker
              v-model="userInfo.timeOfEntry"
              type="date"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>

          <el-form-item label="员工头像">
            <UploadImg :imges-url="userInfo.staffPhoto" @imgUrl="imgUrl" />
          </el-form-item>

          <!-- 保存个人信息 -->
          <el-row class="inline-info" type="flex" justify="center">
            <el-col :span="12">
              <el-button type="primary" @click="publish">保存更新</el-button>
              <el-button @click="$router.back()">返回</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getEmplUserAPI, updataEmplUserAPI } from '@/api/employee'
export default {
  data() {
    return {
      userInfo: {},
      rules: {
        userName: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    // 获取员工基本信息
    async getDetail() {
      const id = this.$route.query.id
      const res = await getEmplUserAPI(id)
      this.userInfo = res
    },
    // 修改员工基本信息
    publish() {
      this.$refs.userForm.validate(async(valid) => {
        if (!valid) return
        await updataEmplUserAPI(this.userInfo)
        this.$message.success('修改成功')
        this.getDetail()
      })
    },
    // 获取员工头像
    imgUrl(val) {
      this.userInfo.staffPhoto = val
    }
  }
}
</script>
