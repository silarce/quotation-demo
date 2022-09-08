
import { Toption } from "./localType"



interface Tcomponent {
  id01: string
  typeName: string
  id02: string | null
  material: { value: string, options: Toption[] } | string | null
  surface: { value: string, options: Toption[] } | string | null
  basicWeight: string | null
  unit: string | null
  qty: string
  listPrice: string //牌價
  totalListPrice: string //牌價複價
  price: string //單價
  totalPrice: string //複價
}

type TcomponentList = Tcomponent[]


const materialOptions: Toption[] = [
  { value: "不鏽鋼304#", label: "不鏽鋼304#" },
  { value: "不鏽鋼316#", label: "不鏽鋼316#" },
  { value: "烤漆鐵", label: "烤漆鐵" },
  { value: "鍍鋅鋼", label: "鍍鋅鋼" },
  { value: "合金鋼", label: "合金鋼" },
  { value: "耐候鋼", label: "耐候鋼" },
  { value: "鋁合金", label: "鋁合金" },
  { value: "陽極鋁合金", label: "陽極鋁合金" },
]
const surfaceOptions: Toption[] = [
  { value: "AA", label: "AA" },
  { value: "BA", label: "BA" },
  { value: "CC", label: "CC" },
  { value: "DS", label: "DS" },
]



const fakeComponentList: TcomponentList = [
  {
    id01: "SJ0A",
    typeName: "門片",
    id02: "SJ3020A0088",
    material: { value: "不鏽鋼304#", options: materialOptions },
    surface: { value: "BA", options: surfaceOptions },
    basicWeight: "22.00",
    unit: "m2",
    qty: "14.19",
    listPrice: "6171",
    totalListPrice: "87556.49",
    price: "6171",
    totalPrice: "87566",
  },
  {
    id01: "SJ0A",
    typeName: "門軌",
    id02: "SJ3020A0088",
    material: { value: "不鏽鋼316#", options: materialOptions },
    surface: null,
    basicWeight: null,
    unit: null,
    qty: "1",
    listPrice: "11286",
    totalListPrice: "11286",
    price: "11286",
    totalPrice: "11286",
  },
  {
    id01: "SJ0A",
    typeName: "捲箱",
    id02: "SJ3020A0088",
    material: { value: "不鏽鋼316#", options: materialOptions },
    surface: null,
    basicWeight: null,
    unit: null,
    qty: "1",
    listPrice: "2895",
    totalListPrice: "2895",
    price: "2895",
    totalPrice: "2895",
  },
  {
    id01: "SJ0A",
    typeName: "底座",
    id02: "SJ3020A0088",
    material: { value: "不鏽鋼316#", options: materialOptions },
    surface: null,
    basicWeight: null,
    unit: null,
    qty: "1",
    listPrice: "1848",
    totalListPrice: "1848",
    price: "1848",
    totalPrice: "1848",
  },
  {
    id01: "SJ0E",
    typeName: "捲軸",
    id02: "SJIN0E0002",
    material: "捲軸 Ø5”",
    surface: null,
    basicWeight: null,
    unit: "M",
    qty: "1",
    listPrice: "975.00",
    totalListPrice: "4485",
    price: "453",
    totalPrice: "2084",
  },
  {
    id01: "SJ0E",
    typeName: "馬達機",
    id02: "SJ3020A0088",
    material: "220V 1HP",
    surface: null,
    basicWeight: null,
    unit: "組",
    qty: "1",
    listPrice: "975.00",
    totalListPrice: "4485",
    price: "453",
    totalPrice: "2084",
  },
  {
    id01: "SJ0E",
    typeName: "配電箱及按鈕開關",
    id02: null,
    material: null,
    surface: null,
    basicWeight: null,
    unit: "組",
    qty: "1",
    listPrice: "975.00",
    totalListPrice: "4485",
    price: "453",
    totalPrice: "2084",
  },
  {
    id01: "SJ0E",
    typeName: "安裝費",
    id02: null,
    material: null,
    surface: null,
    basicWeight: null,
    unit: "組",
    qty: "1",
    listPrice: "48975.00",
    totalListPrice: "4485",
    price: "453",
    totalPrice: "2084",
  },
]






export type {
  Tcomponent,
  TcomponentList,
}

export {
  fakeComponentList
}