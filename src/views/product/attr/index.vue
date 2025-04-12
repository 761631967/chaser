<template>
  <div>
    <Category :scene="scene"/>
    <el-card style="margin: 10px 0;">
      <div v-show="scene == 0">
        <el-button type="primary" size="default" icon="Plus" :disabled="categoryStore.c3Id ? false : true" @click="addAttr">添加属性</el-button>
        <el-table border style="margin:10px 0" :data="attrArr">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column label="属性名称" width="120px" prop="attrName"></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row, $index }">
              <el-tag style="margin: 5px;" v-for="(item, index) in row.attrValueList" :key="item.id">{{ item.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px">
            <template #="{ row, $index }">
              <el-button type="primary" size="small" @click="updateAttr(row)" icon="Edit" ></el-button>
              <el-popconfirm :title="`确定删除${row.attrName}吗?`" width="200px" @confirm="deleteAttr(row.id)">
                <template #reference>
                  <el-button type="primary" size="small" icon="Delete"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="scene == 1">
        <el-form :inline="true">
          <el-form-item label="属性名称" >
            <el-input  placeholder="请输入属性名称"  clearable v-model="attrParams.attrName"/>  
          </el-form-item>
        </el-form>
        <el-button type="primary" size="default" @click="addAttrValue" icon="Plus" :disabled="attrParams.attrName ?false:true">添加属性值</el-button>
        <el-button type="primary" size="default" @click="cancel">取消</el-button>
        <el-table border style="margin: 10px 0;" :data="attrParams.attrValueList">
          <el-table-column label="序号" width="80px" type="index" align="center"></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row, $index }">
              <el-input :ref="(vc:any)=>inputArr[$index]=vc" v-if="row.flag" @blur="toLook(row,$index)" v-model="row.valueName" placeholder="请输入属性值名称" />
              <div v-else @click="toEdit(row,$index)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #="{ row, $index }">
              <el-button type="primary" size="small" icon="Delete" @click="attrParams.attrValueList.splice($index,1)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" size="default" @click="save" :disabled="attrParams.attrValueList.length>0?false:true">保存</el-button>
        <el-button type="primary" size="default" @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
//引入watch
import { watch, ref ,reactive,nextTick,onBeforeUnmount} from 'vue';
import { reqAttr , reqAddOrUpdateAttr,reqRemoveAttr} from '../../../api/product/attr'
import type { AttrResponseData, Attr, Attrvalue } from '../../../api/product/attr/type';
//获取仓库信息
import useCategoryStore from '../../../store/modules/category';
import { ElMessage } from 'element-plus';
//这里我用第三方库lodash进行深拷贝
import  cloneDeep  from 'lodash/cloneDeep';
let categoryStore = useCategoryStore();

//收集新增属性数据
let attrParams = reactive<Attr>({
  attrName:"",
  attrValueList:[],
  categoryId:'',
  categoryLevel:3
})

//存储已有属性与属性值
let attrArr = ref<Attr[]>([])

//定义card内容切换
let scene = ref<number>(0)

//准备一个数组存储组件实例
let inputArr=ref<any>([])

//监听三级分类id
watch(() => categoryStore.c3Id, async () => {
  //清空上一次查询已有属性与属性值
  attrArr.value = []
  //确保有id再执行
  if (!categoryStore.c3Id) return
  getArr()
})

const getArr = async () => {
 //先获取分类id
  const { c1Id, c2Id, c3Id } = categoryStore;
  let res: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)
  if (res.code == 200) {
    attrArr.value = res.data
  }
}

//添加属性按钮
const addAttr =()=>{
  //每次点击前先清空数据
  Object.assign(attrParams,{
    attrName:"",
    attrValueList:[],
    categoryId:categoryStore.c3Id,
    categoryLevel:3
  })
  scene.value = 1
}

//table表格修改已有属性按钮
const updateAttr = (row:Attr) =>{
  scene.value = 1
  //将已有属性对象赋值给attrParams对象
  Object.assign(attrParams, cloneDeep(row))
}

//添加属性值按钮
const addAttrValue = () =>{
  attrParams.attrValueList.push({
    valueName:'',
    flag:true
  })
  //获取最后的el-input组件聚焦
  nextTick(()=>{
    inputArr.value.at(-1).focus()
  })
}

//保存按钮
const save = async() =>{
  let res= await reqAddOrUpdateAttr(attrParams)
  if(res.code==200){
    //切换场景
    getArr()
    scene.value = 0
    ElMessage({
      type: 'success',
      message: res.message
    })
  }else{
    ElMessage({
      type: 'error',
      message: res.message
    })
  }
}

//取消按钮
const cancel = () =>{
  scene.value = 0
}

//属性值表单元素失去焦点
const toLook = (row:Attrvalue,$index:number) => {
  //非法情况1判断
  if(row.valueName.trim()==''){
    attrParams.attrValueList.splice($index,1)
    ElMessage({
      type: 'error',
      message: '属性值不能为空'
    })
    return;
  }
  //非法情况2判断
  let repeat = attrParams.attrValueList.find((item)=>{
    //切记要把当前属性值对象从数组中扣除再进行判断
    if(item!=row){
      return item.valueName===row.valueName
    }
  })
  if(repeat){
    //清除重复数据
    attrParams.attrValueList.splice($index,1)
    ElMessage({
      type: 'error',
      message: '属性值不能重复'
    })
    return;
  }
  row.flag=false
}

const toEdit =(row:Attrvalue,$index:number) =>{
  row.flag=true
  nextTick(()=>{
    inputArr.value[$index].focus()
  })
}

//删除某一个已有属性方法
const deleteAttr = async(attrId:number) =>{
  //发送删除请求
  let res = await reqRemoveAttr(attrId)
  if(res.code==200){
    ElMessage({
      type: 'success',
      message: res.message
    })
    //重新获取属性列表
    getArr()
  }else{
    ElMessage({
      type: 'error',
      message: res.message
    })
  }
}

//路由组件销毁前把pinia相关数据清空
onBeforeUnmount(()=>{
  categoryStore.$reset()
})

</script>

<style scoped></style>