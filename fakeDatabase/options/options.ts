

// icon
import iconDoorRail75 from "public/image/icon/doorRail/doorRail75.svg"
import iconDoorRail60 from "public/image/icon/doorRail/doorRail60.svg"
import iconDoorRail98 from "public/image/icon/doorRail/doorRail98.svg"






interface Toption {
  value: string
  label: string
  quoteTypeType?: string
  icon?: string
  [key: string]: string | undefined
}

// 性別
export const optionsCreator_gender =
  (): Toption[] => [
    { value: "男", label: "男" },
    { value: "女", label: "女" },
  ]

// 婚姻狀況
export const optionsCreator_marital =
  (): Toption[] => [
    { value: "已婚", label: "未婚" },
    { value: "未婚", label: "已婚" },
  ]



// export const optionsCreator_department =
//   (): Toption[] => [
//     { value: "管理部", label: "管理部" },
//     { value: "營業部", label: "營業部" },
//     { value: "研發部", label: "研發部" },
//     { value: "工程部", label: "工程部" },
//     { value: "廠務部", label: "廠務部" },
//     { value: "會計部", label: "會計部" },
//   ]



// export const optionsCreator_jobTitle =
//   (): Toption[] => [
//     { value: "總經", label: "總經理" },
//     { value: "副總經理", label: "副總經理" },
//     { value: "協理", label: "協理" },
//     { value: "資深經理", label: "資深經理" },
//     { value: "經理", label: "經理" },
//     { value: "副理", label: "副理" },
//     { value: "課長", label: "課長" },
//     { value: "副課長", label: "副課長" },
//     { value: "專員", label: "專員" },
//     { value: "助理", label: "助理" },
//   ]

// export const optionsCreator_level =
//   (): Toption[] => [
//     { value: "Level 10", label: "Level 10" },
//     { value: "Level 9", label: "Level 9" },
//     { value: "Level 8", label: "Level 8" },
//     { value: "Level 7", label: "Level 7" },
//     { value: "Level 6", label: "Level 6" },
//     { value: "Level 5", label: "Level 5" },
//     { value: "Level 4", label: "Level 4" },
//     { value: "Level 3", label: "Level 3" },
//     { value: "Level 2", label: "Level 2" },
//     { value: "Level 1", label: "Level 1" },
//   ]

// 扣稅類別
export const optionsCreator_taxDeductionCategory =
  (): Toption[] => [
    { value: "應稅", label: "應稅" },
    { value: "應稅外加", label: "應稅外加" },
    { value: "免稅", label: "免稅" },
  ]
export const optionsCreator_customerCategory =
  (): Toption[] => [
    { value: "客戶", label: "客戶" },
    { value: "廠商", label: "廠商" },
    { value: "客戶廠商", label: "客戶廠商" },
  ]











// 門型編號
export const optionsCreator_doorType =
  (): Toption[] => [
    { value: "SJ-30287", label: "SJ-30287" },
    { value: "SJ-302", label: "SJ-302" },
    { value: "門型一", label: "門型一" },
    { value: "門型二", label: "門型二" },
    { value: "門型三", label: "門型三" },
  ]

// 客戶列表搜尋用
export const optionsCreator_clientSearch =
  (): Toption[] => [
    { value: "customerNumber", label: "客戶編號" },
    { value: "name", label: "客戶名稱" },
    // { value: "contactPerson", label: "聯絡人" },
    { value: "phone", label: "電話" },
  ]

// 報價別
export const optionsCreator_quoteType =
  (): Toption[] => [
    { value: "捲門", label: "捲門", quoteTypeType: "rollerDoor" },
    { value: "大捲門", label: "大捲門", quoteTypeType: "rollerDoor" },
    { value: "特大號捲門", label: "特大號捲門", quoteTypeType: "rollerDoor" },
    { value: "不是捲門", label: "不是捲門", quoteTypeType: "normal" },
    { value: "也不是捲門", label: "也不是捲門", quoteTypeType: "normal" },
  ]

// 材料
export const optionsCreator_material =
  (): Toption[] => [
    { value: "不鏽鋼304#", label: "不鏽鋼304#" },
    { value: "烤漆鐵", label: "烤漆鐵" },
    { value: "鍍鋅鋼", label: "鍍鋅鋼" },
    { value: "合金鋼", label: "合金鋼" },
    { value: "耐候鋼", label: "耐候鋼" },
    { value: "鋁合金", label: "鋁合金" },
    { value: "陽極鋁合金", label: "陽極鋁合金" },
  ]

// 表面
export const optionsCreator_surface =
  (): Toption[] => [
    { value: "AA", label: "AA" },
    { value: "BA", label: "BA" },
    { value: "CC", label: "CC" },
    { value: "DS", label: "DS" },
  ]

// 備註
export const optionsCreator_memo =
  (): Toption[] => [
    { value: "防颱", label: "防颱" },
    { value: "耐候", label: "耐候" },
    { value: "耐酸腐蝕", label: "耐酸腐蝕" },
  ]




// 門軌


export const optionsCreator_doorRail =
  (): Toption[] => [
    { value: "75", label: "75", icon: iconDoorRail75.src },
    { value: "60", label: "60", icon: iconDoorRail60.src },
    { value: "98", label: "98", icon: iconDoorRail98.src },
  ]


// export const optionsCreator_ =
//   ():Toption[] => [

//   ]









export type { Toption }