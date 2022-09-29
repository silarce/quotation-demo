

// icon
import iconDoorRail75 from "public/image/icon/doorRail/doorRail75.svg"
import iconDoorRail60 from "public/image/icon/doorRail/doorRail60.svg"
import iconDoorRail98 from "public/image/icon/doorRail/doorRail98.svg"






interface Toption {
  value: string
  label: string
  quoteTypeType?: string
  icon?: string
}



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
    { value: "clientId", label: "客戶編號" },
    { value: "name", label: "客戶名稱" },
    { value: "contactPerson", label: "聯絡人" },
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