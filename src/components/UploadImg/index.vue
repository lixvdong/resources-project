<template>
  <div>
    <el-upload
      class="avatar-uploader"
      action="#"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      :http-request="upload"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon" />
      <el-progress v-if="showProgress" type="circle" :percentage="percent" class="progress" />
    </el-upload>
  </div>
</template>

<script>
// 引入必要的COS模块
const COS = require('cos-js-sdk-v5')
// 实例化对象
const cos = new COS({
  SecretId: 'AKIDqXx6yZtxkGVTBbkcDWYJn0way5vUmoZ2', // 身份识别ID
  SecretKey: 'D9oBH7gxxg8IBn9E2ZqpXgdLo1xf7NO9' // 身份秘钥
})
export default {
  name: 'UploadImg',
  props: {
    imgesUrl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      imageUrl: '',
      percent: 0,
      showProgress: false
    }
  },
  watch: {
    imgesUrl(val) {
      this.imageUrl = val
    }
  },
  methods: {
    upload(res) {
      if (res.file) {
        // 执行上传操作
        this.showProgress = true
        cos.putObject({
          Bucket: 'lixvdong-1313015817', /* 存储桶 */
          Region: 'ap-beijing', /* 存储桶所在地域，必须字段 */
          Key: res.file.name, /* 文件名 */
          StorageClass: 'STANDARD', // 上传模式, 标准模式
          Body: res.file, // 上传文件对象
          onProgress: (progressData) => {
            // 在这个区域做进度条
            // console.log(JSON.stringify(progressData))
            this.percent = progressData.percent * 100
          }
        }, (err, data) => {
          console.log(err || data)
          // 上传成功之后
          if (data.statusCode === 200) {
            this.imageUrl = `https:${data.Location}`
            this.$emit('imgUrl', this.imageUrl)
            this.showProgress = false
          }
        })
      }
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isPNG) {
        this.$message.error('上传头像图片只能是 PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isPNG && isLt2M
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
  object-fit: cover;
}
.progress {
  position: absolute;
  display: flex;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  background: #fff;
}
</style>
