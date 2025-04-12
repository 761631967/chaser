//分类属性数据类型
export interface ResponseData {
  code: number,
  message: string,
  ok: boolean
}

//分类相关属性
export interface CategoryObj {
  id: number | string,
  name: string,
  category1Id?: number,
  category2Id?: number,
}

//相应分类接口返回的数据类型
export interface CategoryResponseData extends ResponseData {
  data: CategoryObj[]
}

//已有属性与属性值ts类型

//属性值对象ts类型
export interface Attrvalue {
  id?: number,
  valueName: string,
  attrId?: number,
  flag?: boolean
}

//存储每一个属性值对象的数组
export type AttrValueList = Attrvalue[]

//属性对象
export interface Attr {
  id?: number,
  attrName: string,
  categoryId: number | string,
  categoryLevel: number,
  attrValueList: AttrValueList
}

//存储每个属性对象的数组
export type AttrList = Attr[]

//属性接口返回类型
export interface AttrResponseData extends ResponseData {
  data: AttrList
}
