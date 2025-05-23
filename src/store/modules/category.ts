//商品分类小仓库
import { defineStore } from 'pinia'
import { reqC1, reqC2, reqC3 } from "@/api/product/attr"
import type { CategoryResponseData } from "@/api/product/attr/type"
import type { CategoryState } from "./types/type"

let useCategoryStore = defineStore('Category', {
  state: (): CategoryState => {
    return {
      c1Arr: [],
      //存储一级分类ID
      c1Id: '',
      //存储二级分类数据
      c2Arr: [],
      c2Id: '',
      c3Arr: [],
      c3Id: '',
    }
  },
  actions: {
    //获取一级分类方法
    async getC1() {
      let res: CategoryResponseData = await reqC1()
      if (res.code == 200) {
        this.c1Arr = res.data
      }
    },

    //获取二级分类方法
    async getC2() {
      let res: CategoryResponseData = await reqC2(this.c1Id)
      if (res.code == 200) {
        this.c2Arr = res.data
      }
    },

    //获取三级分类方法
    async getC3() {
      let res: CategoryResponseData = await reqC3(this.c2Id)
      if (res.code == 200) {
        this.c3Arr = res.data
      }
    }

  },
  getters: {

  }
})
export default useCategoryStore