<template>
    <el-table
      :data="permissionArr"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
    >
      <el-table-column prop="name" label="名称" align="center"/>
      <el-table-column prop="code" label="权限值" align="center" />
      <el-table-column prop="updateTime" label="修改时间" align="center" />
      <el-table-column label="操作" align="center">
        <template #="{row,$index}">
          <el-button type="primary" @click="addPermission(row)" size="small" :disabled="row.level===4?true:false">{{row.level==3?'添加功能':'添加菜单'}}</el-button>
          <el-button type="primary" @click="updatePermission(row)" size="small" :disabled="row.level===1?true:false">编辑</el-button>
          <el-popconfirm :title="`确定要删除${row.name}吗?`" width="260px" @confirm="deletePermission(row.id)">
              <template #reference>
                <el-button type="primary" size="small" :disabled="row.level===1?true:false">删除</el-button>
              </template>
            </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 对话框 -->
    <el-dialog
    v-model="dialogVisible"
    :title="permissionData.id?'更新菜单':'添加菜单'"
    width="500"
    :before-close="handleClose"
  >
    <el-form style="width: 90%;">
      <el-form-item label="名称" label-width='80px'>
        <el-input  placeholder="请输入菜单名称"  v-model="permissionData.name" />
      </el-form-item>
      <el-form-item label="权限值" label-width='80px'>
        <el-input  placeholder="请输入权限数值"  v-model="permissionData.code" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {ref,onMounted,reactive,nextTick} from 'vue'
import { ElMessage } from 'element-plus'
import {reqAllPermission,reqAddOrUpdatePermission,reqRemovePermission} from '@/api/acl/menu'
import type {PermissionResponseData,PermissionList,Permission,PermissionParams} from '@/api/acl/menu/type'

let permissionArr=ref<PermissionList>([])
//对话框显隐
let dialogVisible=ref(false)
//携带参数数组
let permissionData =reactive<PermissionParams>({
  code:'',
  level:null,
  name:'', 
  pid:null
})

//获取数据
const getHasPermission = async()=>{
  let res = await reqAllPermission()
  if(res.code=200){
    permissionArr.value=res.data
  }
}

//添加菜单按钮
const addPermission=(row:Permission)=>{
  //清空dialog对话框
  Object.assign(permissionData,{
    code:'',
    level:null,
    name:'', 
    pid:null
  })
  dialogVisible.value=true
  //收集新增菜单level,pid
  permissionData.level=row.level+1
  permissionData.pid=(row.id as number)
}

//编辑菜单按钮
const updatePermission= async (row:Permission)=>{
  dialogVisible.value=true
  Object.assign(permissionData,row)
}

//保存方法
const save=async()=>{
  let res = await reqAddOrUpdatePermission(permissionData)
  if(res.code==200){
    dialogVisible.value=false
    ElMessage({
      type: 'success',
      message: permissionData.id?'更新成功':'添加成功'
    })
    getHasPermission()
  }else{
    ElMessage({
      type: 'error',
      message: "操作失败"
    })
  }
}

//删除菜单
const deletePermission= async (id:number)=>{
  let res= await reqRemovePermission(id)
  if(res.code==200){
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    getHasPermission()
  }else{
    ElMessage({
      type: 'error',
      message: "删除失败"
    })
  }
}

onMounted(()=>{
  getHasPermission()
})
</script>

<style scoped>

</style>