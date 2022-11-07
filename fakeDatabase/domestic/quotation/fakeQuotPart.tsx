


// 捲門
// 大捲門
// 特大號捲門
// 不是捲門
// 也不是捲門

type TquoteTypeKeys =
  "捲門" | "大捲門" | "特大號捲門" | "不是捲門" | "也不是捲門"



interface Tpart {
  subType: string
  subTypeName: string
  id: string | null
  material: string
  surface: string
  basicWeight: string | null // 重量基重
  unit: string | null
  qty: string | undefined
  listPrice: string //牌價
  totalListPrice: string //牌價複價
  price: string //單價
  totalPrice: string //複價
}

type TpartList = Tpart[]


const fakePartOri01 = (): TpartList => [
  {
    subType: "SJ0A",
    subTypeName: "門片",
    id: "SJ3020A0088",
    material: "不鏽鋼304#",
    surface: "BA",
    basicWeight: "22.00",
    unit: "m2",
    qty: undefined,
    listPrice: "6171",
    totalListPrice: "87556.49",
    price: "6171",
    totalPrice: "87566",
  },
  {
    subType: "SJ0E",
    subTypeName: "捲軸",
    id: "SJIN0E0002",
    material: "捲軸 Ø5”",
    surface: "",
    basicWeight: null,
    unit: "M",
    qty: undefined,
    listPrice: "975.00",
    totalListPrice: "4485",
    price: "453",
    totalPrice: "2084",
  },
  {
    subType: "SJ0B",
    subTypeName: "門箱",
    id: "SJ3020A0088",
    material: "不鏽鋼304#",
    surface: "",
    basicWeight: null,
    unit: "M",
    qty: undefined,
    listPrice: "11286",
    totalListPrice: "11286",
    price: "11286",
    totalPrice: "11286",
  },
  {
    subType: "SJ0Z",
    subTypeName: "支板",
    id: "SJ3020A0088",
    material: "不鏽鋼304#",
    surface: "",
    basicWeight: null,
    unit: null,
    qty: "1",
    listPrice: "11286",
    totalListPrice: "11286",
    price: "11286",
    totalPrice: "11286",
  },
  {
    subType: "SJ0C",
    subTypeName: "底座",
    id: "SJ3020A0088",
    material: "不鏽鋼304#",
    surface: "",
    basicWeight: null,
    unit: "M",
    qty: undefined,
    listPrice: "1848",
    totalListPrice: "1848",
    price: "1848",
    totalPrice: "1848",
  },
  {
    subType: "SJ0D",
    subTypeName: "門軌",
    id: "SJ3020A0088",
    material: "不鏽鋼304#",
    surface: "",
    basicWeight: null,
    unit: "M",
    qty: undefined,
    listPrice: "11286",
    totalListPrice: "11286",
    price: "11286",
    totalPrice: "11286",
  },
  {
    subType: "SJ0F",
    subTypeName: "馬達機",
    id: "SJ3020A0088",
    material: "220V 1HP",
    surface: "",
    basicWeight: null,
    unit: "組",
    qty: "1",
    listPrice: "975.00",
    totalListPrice: "4485",
    price: "453",
    totalPrice: "2084",
  },
  {
    subType: "SJ0K",
    subTypeName: "配電箱及按鈕開關",
    id: null,
    material: "",
    surface: "",
    basicWeight: null,
    unit: "組",
    qty: "1",
    listPrice: "975.00",
    totalListPrice: "4485",
    price: "453",
    totalPrice: "2084",
  },
]
const fakePartOri02 = (): TpartList => [
  {
    subType: "SJ0A",
    subTypeName: "門片",
    id: "SJ3020A0088",
    material: "不鏽鋼316#",
    surface: "BA",
    basicWeight: "22.00",
    unit: "m2",
    qty: undefined,
    listPrice: "6171",
    totalListPrice: "87556.49",
    price: "6171",
    totalPrice: "87566",
  },
  {
    subType: "SJ0E",
    subTypeName: "捲軸",
    id: "SJIN0E0002",
    material: "捲軸 Ø5”",
    surface: "",
    basicWeight: null,
    unit: "M",
    qty: undefined,
    listPrice: "975.00",
    totalListPrice: "4485",
    price: "453",
    totalPrice: "2084",
  },
  {
    subType: "SJ0B",
    subTypeName: "門箱",
    id: "SJ3020A0088",
    material: "不鏽鋼316#",
    surface: "",
    basicWeight: null,
    unit: "M",
    qty: undefined,
    listPrice: "11286",
    totalListPrice: "11286",
    price: "11286",
    totalPrice: "11286",
  },
  {
    subType: "SJ0Z",
    subTypeName: "支板",
    id: "SJ3020A0088",
    material: "不鏽鋼316#",
    surface: "",
    basicWeight: null,
    unit: null,
    qty: "1",
    listPrice: "11286",
    totalListPrice: "11286",
    price: "11286",
    totalPrice: "11286",
  },
  {
    subType: "SJ0C",
    subTypeName: "底座",
    id: "SJ3020A0088",
    material: "不鏽鋼316#",
    surface: "",
    basicWeight: null,
    unit: "M",
    qty: undefined,
    listPrice: "1848",
    totalListPrice: "1848",
    price: "1848",
    totalPrice: "1848",
  },
  {
    subType: "SJ0D",
    subTypeName: "門軌",
    id: "SJ3020A0088",
    material: "不鏽鋼316#",
    surface: "",
    basicWeight: null,
    unit: "M",
    qty: undefined,
    listPrice: "11286",
    totalListPrice: "11286",
    price: "11286",
    totalPrice: "11286",
  },
  {
    subType: "SJ0F",
    subTypeName: "馬達機",
    id: "SJ3020A0088",
    material: "220V 1HP",
    surface: "",
    basicWeight: null,
    unit: "組",
    qty: "1",
    listPrice: "975.00",
    totalListPrice: "4485",
    price: "453",
    totalPrice: "2084",
  },
  {
    subType: "SJ0K",
    subTypeName: "配電箱及按鈕開關",
    id: null,
    material: "",
    surface: "",
    basicWeight: null,
    unit: "組",
    qty: "1",
    listPrice: "975.00",
    totalListPrice: "4485",
    price: "453",
    totalPrice: "2084",
  },
]



const fakePartGroupOri = (): {
  [key in TquoteTypeKeys]: Tpart[]
} => ({
  "捲門": fakePartOri01(),
  "大捲門": fakePartOri01(),
  "特大號捲門": fakePartOri01(),
  "不是捲門": fakePartOri02(),
  "也不是捲門": fakePartOri02(),
})


export type {
  Tpart,
  TpartList,
  TquoteTypeKeys
}

export {
  fakePartGroupOri
}