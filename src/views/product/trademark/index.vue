<template>
  <el-card style="box-card">
    <!-- 卡片顶部添加品牌按钮 -->
     <el-button type="primary" size="default" @click="addTrademark" icon="Plus" v-has="`btn.Trademark.add`">添加品牌</el-button>
     <!-- 表格组件 -->
     <el-table :style="{margin: '10px 0'}" border :data="trademarkArr">
        <el-table-column label="序号" width="80px" align="center" type="index"></el-table-column>
        <el-table-column label="品牌名称"  align="center" >
          <template #="{row,$index}">
            <pre>{{ row.tmName }}</pre>
          </template>
        </el-table-column>
        <el-table-column label="品牌LOGO"  align="center">
          <template #="{row,$index}">
            <img :src="row.logoUrl" style="width: 100px; height: 100px">
          </template>
        </el-table-column>
        <el-table-column label="品牌操作"  align="center">
          <template #="{row,$index}">
            <el-button type="success" size="small" icon="Edit" @click="updateTrademark(row)"></el-button>
            <el-popconfirm 
              :title="`确定要删除${row.tmName}吗？`" 
              width="250px" 
              icon="Delete" 
              @confirm="deleteTrademark(row.id)"
            >
              <template #reference>
                <el-button type="danger" size="small" icon="Delete"></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <el-pagination 
      @current-change="getHasTrademark" 
      @size-change="sizeChange"
      v-model:current-page="pageNo"
      v-model:page-size="limit"
      :page-sizes="[3, 5, 7, 9]"
      background
      layout=" prev, pager, next, jumper,->,sizes,total "
      :total="total"
    />
  </el-card>  
  

  <!-- 对话框组件 -->
  <el-dialog v-model="dialogFormVisible" :title="trademarkParams.id?'修改品牌':'添加品牌'">
    <el-form style="width: 80%;" :model="trademarkParams" :rules="rules" ref="formRef">
      <el-form-item label="品牌名称" label-width="100px" prop="tmName">
        <el-input v-model="trademarkParams.tmName" placeholder="请输入品牌名称"  clearable />
      </el-form-item>
      <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
        <el-upload
          class="avatar-uploader"
          action="/api/admin/product/fileUpload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
    <!-- 底部具名插槽 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="confirm">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { type UploadProps,ElMessage } from 'element-plus'
import {ref,onMounted, reactive,nextTick} from 'vue'
import { reqHasTrademark, reqAddOrUpdateTrademark,reqDeleteTrademark } from '@/api/product/trademark'
import type {Records,TrademarkResponseData,Trademark} from '@/api/product/trademark/type'

//当前页
let pageNo = ref<number>(1)
//每页展示条数
let limit =ref<number>(3)
//存储已有品牌总数
let total =ref<number>(0)
//存储已有品牌数据数组
let trademarkArr =ref<Records>([])
//对话框显示隐藏控制
let dialogFormVisible =ref<boolean>(false)
//定义收集新增品牌数组
let trademarkParams =reactive<Trademark>({
  tmName:'',
  logoUrl:''
})
//获取el-form组件实例
let formRef=ref()

//当不指定显示第几页时，默认显示第一页
//当切换每页显示数量时，也跳转到第一页
const getHasTrademark=async(pager = 1)=>{
  pageNo.value = pager
  let res:TrademarkResponseData=await reqHasTrademark(pageNo.value,limit.value)
  if(res.code==200){
    total.value=res.data.total
    trademarkArr.value=res.data.records
  }
}
const sizeChange=()=>{
  getHasTrademark()
}
onMounted(()=>{
  getHasTrademark()
})

//添加按钮
const addTrademark=()=>{
  dialogFormVisible.value=true
  //清空数据
  trademarkParams.logoUrl=''
  trademarkParams.tmName=''
  trademarkParams.id=null
  //清空校验
  nextTick(()=>{
    formRef.value.clearValidate(['tmName','logoUrl'])
  })
}

//编辑按钮
const updateTrademark=(row:Trademark)=>{
   //清空校验
   nextTick(()=>{
    formRef.value.clearValidate(['tmName','logoUrl'])
  })
  dialogFormVisible.value=true
  //展示已有品牌数据
  Object.assign(trademarkParams,row)
}
//对话框确定按钮
const confirm = async ()=>{
  //在发请求之前对整个表单进行校验
  await formRef.value.validate()

  let res:any=await reqAddOrUpdateTrademark(trademarkParams)
  if(res.code==200){
    ElMessage({
      type: 'success',
      message: trademarkParams.id?'修改品牌成功!':'添加品牌成功!',
    })
    getHasTrademark(trademarkParams.id?pageNo.value:1)
  }else{
    ElMessage({
      type: 'error',
      message: trademarkParams.id?'修改品牌失败!':'添加品牌失败!',
    })
  }
  dialogFormVisible.value=false
}

//上传图片之前钩子函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  //要求文件上传格式png|jpg|gif 4M
  if (rawFile.type === 'image/png' || rawFile.type === 'image/jpeg' || rawFile.type === 'image/gif') {
    if(rawFile.size/1024/1024<4){
      return true
    }else{
      ElMessage({
        type: 'error',
        message: '上传文件大小不能超过4M!',
      })
      return false
    }
  }else{
    ElMessage({
      type: 'error',
      message: '上传文件格式只能是png|jpg|gif!',
    })
    return false
  }
}

//图片上传成功的函数
const handleAvatarSuccess: UploadProps['onSuccess'] = (response,uploadFile) => {
  //response:上传成功后返回的响应数据
  trademarkParams.logoUrl=response.data
  //上传成功清除对应校验
  formRef.value.clearValidate('logoUrl')  
}

//品牌组定义校验方法
const validatorTmName=(rule:any,value:any,callBack:any)=>{
  if(value.trim().length>=2){
    callBack()
  }else{
    callBack(new Error('品牌名称长度不能小于2位'))
  }
}

const validatorLogoUrl=(rule:any,value:any,callBack:any)=>{
  if(value){
    callBack()
  }else{
    callBack(new Error('品牌LOGO不能为空'))
  }
}

//表单验证规则
const rules={
  tmName:[
    {required:true,trigger:'blur',validator:validatorTmName}
  ],
  logoUrl:[
    {required:true,validator:validatorLogoUrl}
  ]
}

//删除品牌
const deleteTrademark=async(id:number)=>{
  let res=await reqDeleteTrademark(id)
  if(res.code==200){
    getHasTrademark(trademarkArr.value.length>1?pageNo.value:pageNo.value-1)
    ElMessage({
      type:'success',
      message:'删除品牌成功'
    })
  }else{
    ElMessage({
      type:'error',
      message:'删除品牌失败'
    })
  }
}

</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>