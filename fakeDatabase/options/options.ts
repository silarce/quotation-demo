

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
    { value: "contacts.name", label: "聯絡人" },
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




// 報價別
export const optionsCreator_quoteType_new =
  (): ToptionPlus => {
    const obj = {
      捲門: {
        value: "捲門", label: "捲門", quoteTypeType: "rollerDoor"
      },
      大捲門: {
        value: "大捲門", label: "大捲門", quoteTypeType: "rollerDoor"
      },
      特大號捲門: {
        value: "特大號捲門", label: "特大號捲門", quoteTypeType: "rollerDoor"
      },
      不是捲門: {
        value: "不是捲門", label: "不是捲門", quoteTypeType: "normal"
      },
      也不是捲門: {
        value: "也不是捲門", label: "也不是捲門", quoteTypeType: "normal"
      },
    }
    return {
      obj,
      options: Object.values(obj)
    }
  }


// 接上api前暫時先這樣
// 材料
export const optionsCreator_material_new =
  (): ToptionPlus => {
    const obj = {
      "不鏽鋼304#": { value: "不鏽鋼304#", label: "不鏽鋼304#" },
      "不鏽鋼316#": { value: "不鏽鋼316#", label: "不鏽鋼316#" },
      "烤漆鐵": { value: "烤漆鐵", label: "烤漆鐵" },
    }
    return {
      obj,
      options: Object.values(obj)
    }
  }

// 表面
export const optionsCreator_surface_new =
  (): ToptionPlus => {
    const obj = {
      AA: { value: "AA", label: "AA" },
      BA: { value: "BA", label: "BA" },
      CC: { value: "CC", label: "CC" },
      DS: { value: "DS", label: "DS" },
    }
    return {
      obj,
      options: Object.values(obj)
    }
  }

// 備註
// export const optionsCreator_memo_new =
//   (): ToptionPlus => {
//     const obj = {
//       防颱: { value: "防颱", label: "防颱" },
//       耐候: { value: "耐候", label: "耐候" },
//       耐酸腐蝕: { value: "耐酸腐蝕", label: "耐酸腐蝕" },
//       防颱防颱: { value: "防颱防颱", label: "防颱防颱" },
//     }
//     return {
//       obj,
//       options: Object.values(obj)
//     }
//   }

// 門軌
export const optionsCreator_doorRail_new =
  (): ToptionPlus => {
    const obj = {
      "75": { value: "75", label: "75", icon: iconDoorRail75.src },
      "60": { value: "60", label: "60", icon: iconDoorRail60.src },
      "98": { value: "98", label: "98", icon: iconDoorRail98.src },
    }
    return {
      obj,
      options: Object.values(obj)
    }
  }

// B 報價單的B
export const optionsCreator_B_new =
  (): ToptionPlus => {
    const obj = {
      "77": { value: "77", label: "77"},
      "45": { value: "45", label: "45"},
      "20": { value: "20", label: "20"},
    }
    return {
      obj,
      options: Object.values(obj)
    }
  }



// export const optionsCreator_ =
//   ():Toption[] => [

//   ]









export type { Toption, ToptionPlus }