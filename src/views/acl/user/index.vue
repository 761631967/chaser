<template>
  <el-card style="height: 80px;">
    <el-form :inline="true" class="form">
      <el-form-item label="用户名:">
        <el-input placeholder="请输入搜索用户名" v-model="keyword"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default" @click="search" :disabled="keyword?false:true" >搜索</el-button>
        <el-button type="primary" size="default" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>

  <el-card style="margin: 10px 0;">
    <el-button type="primary" size="default" @click="addUser">添加用户</el-button>
    <el-button type="danger" size="default" @click="deleteBatchUser" :disabled="batchDeleteArr.length?false:true">批量删除</el-button>
    <!-- el-table展示用户信息 -->
     <el-table @selection-change="selectChange" style="margin: 10px 0;" border :data="userArr">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column label="#" align="center" type="index"></el-table-column>
        <el-table-column label="id" align="center" prop="id"></el-table-column>
        <el-table-column label="用户名字" align="center" prop="username" show-overflow-tooltip></el-table-column>
        <el-table-column label="用户名称" align="center" prop="name" show-overflow-tooltip></el-table-column>
        <el-table-column label="用户角色" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="更新时间" align="center" prop="updateTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="300px" align="center">
          <template #="{row,$index}">
            <el-button type="primary" size="small" @click="setRole(row)" icon="User">分配角色</el-button>
            <el-button type="primary" size="small" @click="updateUser(row)" icon="Edit">编辑</el-button>
            <el-popconfirm :title="`确定要删除${row.username}吗?`" width="260px" @confirm="deleteUser(row.id)">
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
      :page-sizes="[5, 7, 9, 11]"
      :background="true"
      layout=" prev, pager, next, jumper,-> ,sizes,total"
      :total="total"
      @current-change="getHasUser"
      @size-change="handler"
    />
  </el-card>

  <!-- 添加/更新用户抽屉结构 -->
  <el-drawer v-model="drawer" :direction="direction">
    <template #header>
      <h4>{{userParams.id?'更新用户':'添加用户'}}</h4>
    </template>
    <template #default>
      <el-form :model="userParams" :rules="rules" ref="formRef">
        <el-form-item label="用户姓名" prop="username">
          <el-input placeholder="请输入用户姓名" v-model="userParams.username"/>
        </el-form-item>
        <el-form-item label="用户呢称" prop="name">
          <el-input placeholder="请输入用户呢称" v-model="userParams.name"/>
        </el-form-item>
        <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
          <el-input placeholder="请输入用户密码" v-model="userParams.password"/>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </template>
  </el-drawer>

  <!-- 分配角色抽屉结构 -->
  <el-drawer v-model="drawer1" >
    <template #header>
      <h4>分配角色</h4>
    </template>
    <template #default>
      <el-form>
        <el-form-item label="用户姓名">
          <el-input v-model="userParams.username" :disabled="true"/>
        </el-form-item>
        <el-form-item label="职位列表">
          <el-checkbox
          v-model="checkAll"
          :indeterminate="isIndeterminate"
          @change="handleCheckAllChange"
          >
            全选
          </el-checkbox>
          <el-checkbox-group v-model="userRole" @change="handleCheckedCitiesChange" >
            <el-checkbox v-for="(item,index) in allRole" :key="index" :label="item">
              {{ item.roleName }}  
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer1=false">取消</el-button>
        <el-button type="primary" @click="confirmClick">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import useLayoutSettingStore from '@/store/modules/setting'
import {ref,onMounted,reactive,nextTick} from 'vue'
import { reqUserInfo,reqAddOrUpdateUser,reqAllRole, reqSetUserRole, reqRemoveUser, reqBatchRemoveUser } from '../../../api/acl/user'
import type { UserResponseData,Records,User,AllRoleResponseData ,AllRole,SetRoleData} from '../../../api/acl/user/type'
import { ElMessage } from 'element-plus'
//默认页码
let pageNo=ref<number>(1)
//一页展示几条数据
let pageSize=ref<number>(5)
//用户总个数
let total=ref<number>(0)
//存储全部用户数组
let userArr=ref<Records>([])
//定义响应式数据控制抽屉显隐
let drawer=ref<boolean>(false)
let drawer1=ref<boolean>(false)
//存储全部职位数据
let allRole=ref<AllRole>([])
//当前用户已有职位
let userRole=ref<AllRole>([])
//收集用户信息响应式数据
let userParams=reactive<User>({
  username:'',
  name:'',
  password:''
})
//定义数据收集用户输入进来的关键字
let keyword=ref<string>('')
//获取模板setting仓库
let settingStore=useLayoutSettingStore()
//获取组件实例
let formRef=ref<any>()
//收集顶部复选框全选数据
let checkAll = ref<boolean>(false)
//设置不确定样式
let isIndeterminate = ref(true)
//准备数据存储批量删除的用户ID
let batchDeleteArr=ref<User[]>([])
//全选框change事件
const handleCheckAllChange = (val:boolean) => {
  //val就是全选框的选中状态，true就是全选
  userRole.value = val ? allRole.value  : []
  isIndeterminate.value = false
}
//底部复选框change事件
const handleCheckedCitiesChange = (value:string[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === allRole.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < allRole.value.length
}

const validatorUsername=(rule:any,value:any,callBack:any)=>{
  if(value.trim().length>=5 && value.trim().length<=10){
    callBack()
  }else{
    callBack(new Error('用户名长度在5-10位之间'))
  }
}

const validatorname=(rule:any,value:any,callBack:any)=>{
  if(value.trim().length>=5 && value.trim().length<=10){
    callBack()
  }else{
    callBack(new Error('呢称长度在5-10位之间'))
  }
}

const validatorPassword=(rule:any,value:any,callBack:any)=>{
  if(value.trim().length>=6){
    callBack()
  }else{
    callBack(new Error('密码至少为六位'))
  }
}

//表单校验规则
const rules={
  username:[{required:true,trigger:'blur',validator:validatorUsername}],
  name:[{required:true,trigger:'blur',validator:validatorname}],
  password:[{required:true,trigger:'blur',validator:validatorPassword}],
}

//获取全部已有的用户信息
const getHasUser = async (pager=1)=>{
  //收集当前页码
  pageNo.value=pager
  let res:UserResponseData= await reqUserInfo(pageNo.value,pageSize.value,keyword.value)
  if(res.code==200){
    userArr.value=res.data.records
    total.value=res.data.total
  }
}

//分页器每页展示几条数据
const handler=()=>{
  getHasUser()
}

//添加用户
const addUser=()=>{
  drawer.value=true
  Object.assign(userParams,{
    username:'',
    name:'',
    password:'',
    id:0
  })
  //清除上一次提示的错误信息
  nextTick(()=>{
    formRef.value.clearValidate()
  })
}

//编辑用户
const updateUser=(row:User)=>{
  drawer.value=true
  //存储收集已有的用户信息
  Object.assign(userParams,row)
  //清除上一次提示的错误信息
  nextTick(()=>{
    formRef.value.clearValidate()
  })
}

//保存按钮
//注意:重复数据会201，添加一个不可能重复的用户试试
const save= async ()=>{
  //先通过校验再发请求
  await formRef.value.validate()
  let res=await reqAddOrUpdateUser(userParams)
  if(res.code==200){
    drawer.value=false
    ElMessage({
      type:'success',
      message:res.message
    })
    //由于下面的页面会刷新，所以下面的获取可写可不写，将来也可以做个判断，如果是修改的当前用户，就刷新页面。如果不是，就没必要了
    // getHasUser(userParams.id?pageNo.value:1)
    //浏览器自动刷新一次(考虑修改了当前用户)
    window.location.reload()
  }else{
    drawer.value=false
    ElMessage({
      type:'error',
      message:res.message
    })
  }
}

//取消按钮
const cancel=()=>{
  drawer.value=false
}

//分配角色
const setRole=async(row:User)=>{
  Object.assign(userParams,row)
  //获取职位数据
  let res:AllRoleResponseData=await reqAllRole((userParams.id as number))
  if(res.code==200){
    allRole.value=res.data.allRolesList
    userRole.value=res.data.assignRoles
    drawer1.value=true
  }
}

//分配职位确定按钮
const confirmClick=async()=>{
  //先收集数据
  let data:SetRoleData={
    userId:(userParams.id as number),
    roleIdList:userRole.value.map(item=>{
      return (item.id as number)
    })
  }
  //发请求
  let res:any= await reqSetUserRole(data)
  if(res.code==200){
    ElMessage({
      type:'success',
      message:res.message
    })
    drawer1.value=false
    getHasUser(pageNo.value)
  }else{
    ElMessage({
      type:'error',
      message:res.message
    })
    drawer1.value=false
  }
}

//删除某个用户
const deleteUser= async (userId:number)=>{
  let res:any= await reqRemoveUser(userId)
  if(res.code==200){
    ElMessage({
      type:'success',
      message:res.message
    })
    getHasUser(userArr.value.length>1?pageNo.value:pageNo.value-1)  
  }else{
    ElMessage({
      type:'error',
      message:res.data
    })
  }
}

//table复选框勾选框勾选时触发事件
const selectChange=(value:any)=>{
  batchDeleteArr.value=value
}

//批量删除
const deleteBatchUser=async()=>{
  let idsList:any=batchDeleteArr.value.map(item=>{
    return item.id
  })
  let res=await reqBatchRemoveUser(idsList)
  if(res.code==200){
    ElMessage({
      type:'success',
      message:res.message
    })
    getHasUser(userArr.value.length>1?pageNo.value:pageNo.value-1)  
  }else{
    ElMessage({
      type:'error',
      message:res.data
    })
  }
}

//搜索按钮
const search=()=>{
  getHasUser()
  //清空关键字
  keyword.value=''
}

//重置按钮
const reset=()=>{
  //这里是v-if为true重新加载组件了，不如重新获取数据,不推荐
  // settingStore.refresh=!settingStore.refresh
  getHasUser()
}

onMounted(()=>{
  getHasUser()
})
</script>

<style scoped lang="scss">
.form{
  display: flex;
  justify-content: space-between;
  align-items: center;
}

</style>