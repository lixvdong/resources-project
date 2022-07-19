<template>
  <div class="app-container">
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
    </el-table>
  </div>
</template>

<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import { getImportJsData } from '@/utils/execl'
import { batchAddEmplAPI } from '@/api/employee'
export default {
  name: 'UploadExcel',
  components: { UploadExcelComponent },
  data() {
    return {
      tableData: [],
      tableHeader: []
    }
  },
  methods: {
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) return true

      this.$message.warning('请不要上传大于1M的文件')
      return false
    },
    async handleSuccess({ results, header }) {
      this.tableData = results
      this.tableHeader = header
      const headerRelation = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '工号': 'workNumber',
        '聘用形式': 'formOfEmployment',
        '部门': 'departmentName'
      }
      const result = getImportJsData(results, headerRelation)
      await batchAddEmplAPI(result)
      this.$router.back()
      this.$message.success('导入成功')
    }
  }
}
</script>
