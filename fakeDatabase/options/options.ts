

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

interface ToptionPlus {
  obj: { [key: string]: Toption },
  options: Toption[]
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


// 扣稅類別
export const optionsCreator_taxDeductionCategory =
  (): Toption[] => [
    { value: "應稅", label: "應稅" },
    { value: "應稅外加", label: "應稅外加" },
    { value: "免稅", label: "免稅" },
  ]
export const optionsCreator_customerCategory =
  (): Toption[] => [
    { value: "營造", label: "營造" },
    { value: "事務所", label: "事務所" },
    { value: "業主", label: "業主" },
  ]


// 類別
export const optionsCreator_prodClass =
  (): Toption[] => [
    { value: "", label: "不拘" },
    { value: "防火防煙捲門系列", label: "防火防煙捲門系列" },
    // { value: "防水防洪門系列", label: "防水防洪門系列" },
    // { value: "抗風防颱捲門系列", label: "抗風防颱捲門系列" },
    // { value: "廠辦管制門", label: "廠辦管制門" },
    // { value: "圍牆大門", label: "圍牆大門" },
    // { value: "機械門", label: "機械門" },
    // { value: "客製化", label: "客製化" },
  ]

// 門型
export const optionsCreator_doorType =
  (): Toption[] => [
    { value: "", label: "不拘" },
    { value: "SJ-302", label: "SJ-302" },
    // { value: "SJ-302A", label: "SJ-302A" },
    // { value: "SJ-302AS", label: "SJ-302AS" },
    // { value: "SJ-305D", label: "SJ-305D" },
    // { value: "SJ-312", label: "SJ-312" },
    // { value: "SJ-120A", label: "SJ-120A" },
    // { value: "SJ-303S", label: "SJ-303S" },
  ]

  // 門的形式
export const optionsCreator_doorForm =
  (): Toption[] => [
    { value: "", label: "不拘" },
    { value: "一般", label: "一般" },
    { value: "防颱", label: "防颱" },
  ]

// 客戶列表搜尋用
export const optionsCreator_clientSearch =
  (): Toption[] => [
    { value: "customerNumber", label: "客戶編號" },
    { value: "name", label: "客戶名稱" },
    { value: "contacts.name", label: "聯絡人" },
    { value: "phone", label: "電話" },
  ]

// 報價別
export const optionsCreator_quoteType =
  (): Toption[] => [
    { value: "捲門", label: "捲門", quoteTypeType: "rollerDoor" },
    // { value: "大捲門", label: "大捲門", quoteTypeType: "rollerDoor" },
    // { value: "不是捲門", label: "不是捲門", quoteTypeType: "normal" },
  ]

// 材料
export const optionsCreator_material =
  (): Toption[] => [
    { value: "SST304#", label: "SST 304#" },
    // { value: "SST316#", label: "SST 316#" },
    // { value: "鐵材烤漆", label: "鐵材烤漆" },
    // { value: "鍍鋅鋼板", label: "鍍鋅鋼板" },
    // { value: "高耐鍍鋅鋼板", label: "高耐鍍鋅鋼板" },
  ]

// 表面
export const optionsCreator_surface =
  (): Toption[] => [
    { value: "2B", label: "2B" },
    // { value: "BA", label: "BA" },
    // { value: "HL", label: "HL" },
    // { value: "NO.4", label: "NO.4" },
  ]

// 門軌
export const optionsCreator_doorRail =
  (): Toption[] => [
    { value: "75", label: "75", icon: iconDoorRail75.src },
    { value: "60", label: "60", icon: iconDoorRail60.src },
    { value: "98", label: "98", icon: iconDoorRail98.src },
  ]

// B 報價單的B
export const optionsCreator_B =
  (): Toption[] => [
    { value: "77", label: "77" },
    { value: "45", label: "45" },
    { value: "20", label: "20" },
  ]

// 馬力
export const optionsCreator_horsepower =
  (): Toption[] => [
    { value: "autoCalc", label: "自動計算" },
    { value: "1/4 HP", label: "1/4 HP" },
    { value: "1/3 HP", label: "1/3 HP" },
    { value: "1/2 HP", label: "1/2 HP" },
    { value: "3/4 HP", label: "3/4 HP" },
    { value: "1 HP", label: "1 HP" },
    { value: "1 1/2HP", label: "1 1/2 HP" },
    { value: "2 HP", label: "2 HP" },
    { value: "3 HP", label: "3 HP" },
    { value: "5 HP", label: "5 HP" },
  ]
// 報價單狀態
export const optionsCreator_quotationState =
  (): Toption[] => [
    { value: "預算", label: "預算" },
    { value: "投標", label: "投標" },
    { value: "發包", label: "發包" },
  ]




// export const optionsCreator_ =
//   ():Toption[] => [

//   ]









export type { Toption, ToptionPlus }