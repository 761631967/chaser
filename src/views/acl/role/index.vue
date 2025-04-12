<template>
  <el-card style="height: 80px;">
    <el-form :inline="true" class="form">
      <el-form-item label="职位搜索:">
        <el-input placeholder="请输入搜索职业关键字" v-model="keyword"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default" @click="search" :disabled="keyword?false:true" >搜索</el-button>
        <el-button type="primary" size="default" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>

  <el-card style="margin: 10px 0;">
    <el-button type="primary" size="default" @click="addRole" icon="Plus">添加职位</el-button>
    <!-- el-table展示用户信息 -->
     <el-table style="margin: 10px 0;" border :data="allRole">
        <el-table-column label="#" align="center" type="index"></el-table-column>
        <el-table-column label="id" align="center" prop="id"></el-table-column>
        <el-table-column label="职位名称" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="更新时间" align="center" prop="updateTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="300px" align="center">
          <template #="{row,$index}">
            <el-button type="primary" size="small" @click="setPermission(row)" icon="User">分配权限</el-button>
            <el-button type="primary" size="small" @click="updateRole(row)" icon="Edit">编辑</el-button>
            <el-popconfirm :title="`确定要删除${row.roleName}吗?`" width="260px" @confirm="deleteRole(row.id)">
              <template #reference>
                <el-button type="primary" size="small" icon="Delete">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
     </el-table>
     <!-- 分页器 -->
     <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[3, 5, 7, 9]"
      :size="size"
      :background="true"
      layout=" prev, pager, next, jumper,-> ,sizes,total"
      :total="total"
      @current-change="getHasRole"
      @size-change="sizeChange"
    />
  </el-card>

  <!-- 对话框 -->
   <el-dialog v-model="dialogFormVisible" :title="RoleParams.id?'更新职位':'添加职位'">
      <el-form :model="RoleParams" :rules="rules" ref="form">
        <el-form-item label="职位名称" prop="roleName">
          <el-input placeholder="请输入职位名称" v-model="RoleParams.roleName"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogFormVisible = false" type="primary" size="default">取消</el-button>
        <el-button @click="save" type="primary" size="default" >
          确定
        </el-button>
    </template>
   </el-dialog> 

   <!-- 抽屉组件：分配职位的菜单权限与按钮权限 -->
   <el-drawer v-model="drawer" >
    <template #header>
      <h4>分配权限</h4>
    </template>
    <template #default>
      <el-tree
        ref="tree"
        style="max-width: 600px"
        :data="menuArr"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="selectArr"
        :props="defaultProps"
      />
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer=false">取消</el-button>
        <el-button type="primary" @click="handler">确定</el-button>
      </div>
    </template>
  </el-drawer>

</template>

<script setup lang="ts">
import {ref,onMounted,reactive,nextTick} from 'vue'
import {reqAllRoleList,reqAddOrUpdateRole,reqAllPermissionList,reqSetPermission,reqRemoveRole} from '../../../api/acl/role'
import { ElMessage } from 'element-plus'
import type {RoleResponseData,Records,RoleData,PermissionResponseData,PermissionList} from '../../../api/acl/role/type'
//定义数据收集用户输入进来的关键字
let keyword=ref<string>('')
//默认页码
let pageNo=ref<number>(1)
//一页展示几条数据
let pageSize=ref<number>(5)
//职位总个数
let total=ref<number>(0)
//存储全部已有职位
let allRole=ref<Records>([])
//控制对话框
let dialogFormVisible=ref<boolean>(false)
//收集新增岗位数据
let RoleParams=reactive<RoleData>({
  roleName:''
})
//点击分配权限按钮时收集当前id
let roleId=ref()
//获取tree组件实例
let tree=ref<any>()
//获取form组件
let form =ref<any>()
//定义响应式数据控制抽屉显隐
let drawer=ref<boolean>(false)
//定义数组存储用户权限
let menuArr=ref<PermissionList>([])
//准备一个数组：用于存储勾选节点的id（4级）
let selectArr=ref<any>([])
//树形控件数据
const defaultProps = {
  children: 'children',
  label: 'name',
}

//添加职位
const addRole=()=>{
  dialogFormVisible.value=true
  //每次都清空输入
  Object.assign(RoleParams,{
    roleName:'',
    id:0
  })
  //同时清空校验规则
  nextTick(()=>{
    form.value.clearValidate()
  })
}

//更新职位
const updateRole=(row:RoleData)=>{
  dialogFormVisible.value=true
  //存储已有职位
  Object.assign(RoleParams,row)
  //同时清空校验规则
  nextTick(()=>{
    form.value.clearValidate()
  })
}

//请求数据
const getHasRole=async(pager=1)=>{
  pageNo.value=pager
  let res:RoleResponseData= await reqAllRoleList(pageNo.value,pageSize.value,keyword.value)
  if(res.code==200){
    total.value=res.data.total
    allRole.value=res.data.records
  }
}

//分页器每页展示几条数据
const sizeChange=()=>{
  getHasRole()
}

//搜索关键字
const search=()=>{
  getHasRole()
  keyword.value=''
}

//重置按钮
const reset=()=>{
  //这里是v-if为true重新加载组件了，不如重新获取数据,不推荐
  // settingStore.refresh=!settingStore.refresh
  getHasRole()
}

const validator=(rule:any,value:any,callBack:any)=>{
  if(value.trim().length>=2){
    callBack()
  }else{
    callBack(new Error('职位名称至少2位'))
  }
}

//职业校验规则
const rules={
  roleName:[
    {required:true,trigger:'blur',validator:validator}
  ]
}

//确定方法
const save=async()=>{
  //先校验，再发请求
  await form.value.validate()
  let res:any=await reqAddOrUpdateRole(RoleParams) 
  if(res.code==200){
    ElMessage({
      type:'success',
      message:RoleParams.id?'更新成功':'添加成功'
    })
    dialogFormVisible.value=false
    getHasRole(RoleParams.id?pageNo.value:1)
  }
}

//分配权限
const setPermission=async(row:RoleData)=>{
  drawer.value=true
  //收集当前分类权限职位数据
  roleId.value = row.id 
  //根据职位获取权限
  let res:PermissionResponseData= await reqAllPermissionList((roleId.value as number))
  if(res.code==200){
    menuArr.value=res.data
    selectArr.value=filterSelectArr(menuArr.value,[])
  }
  
}

//过滤出已有的权限
const filterSelectArr=(allData:any,initArr:any)=>{
  allData.forEach((item:any)=>{
    //递归结束条件
    if(item.select && item.level==4){
      initArr.push(item.id)
    }
    // 递归
    if(item.children && item.children.length>0){
      filterSelectArr(item.children,initArr)
    }
  })
  return initArr
}

//抽屉确定方法
const handler=async()=>{  
  //选择节点id
  let arr1=tree.value.getCheckedKeys()
  //半选的id
  let arr2=tree.value.getHalfCheckedKeys()
  //合并
  let arr=arr1.concat(arr2)
  let res= await reqSetPermission(roleId.value,arr)
  if(res.code==200){
    drawer.value=false  
    ElMessage({
      type:'success',
      message:'分配成功'
    })
    //页面刷新
    window.location.reload()  
  }
}

//删除已有职位
const deleteRole=async(id:number)=>{
  let res:any = await reqRemoveRole(id)
  if(res.code==200){
    ElMessage({
      type:'success',
      message:'删除成功'
    })
    getHasRole(allRole.value.length>1?pageNo.value:pageNo.value-1)
  }
}

onMounted(()=>{
  getHasRole()
})
</script>

<style scoped lang=scss>
.form{
  display: flex;
  justify-content: space-between;
  align-items: center;
}

</style>