


// 捲門
// 大捲門
// 特大號捲門
// 不是捲門
// 也不是捲門

type TquoteTypeKeys =
  "捲門" | "大捲門" | "不是捲門"



interface Tpart {
  subType: string  //中類
  subTypeName: string  //種類名稱
  id: string | null  //代號
  material: string  //材質
  surface: string  //表面
  basicWeight: string | null // 重量基重
  unit: string | null //單位
  qty: string | undefined //數量
  listPrice: string //牌價
  // totalListPrice: string //牌價複價
  // price: string //單價
  // totalPrice: string //複價
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
    // totalListPrice: "87556.49",

    // totalPrice: "87566",
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
    // totalListPrice: "4485",

    // totalPrice: "2084",
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
    // totalListPrice: "11286",

    // totalPrice: "11286",
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
    // totalListPrice: "11286",

    // totalPrice: "11286",
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
    // totalListPrice: "1848",

    // totalPrice: "1848",
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
    // totalListPrice: "11286",

    // totalPrice: "11286",
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
    // totalListPrice: "4485",

    // totalPrice: "2084",
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
    // totalListPrice: "4485",

    // totalPrice: "2084",
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
    // totalListPrice: "87556.49",

    // totalPrice: "87566",
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
    // totalListPrice: "4485",

    // totalPrice: "2084",
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
    // totalListPrice: "11286",

    // totalPrice: "11286",
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
    // totalListPrice: "11286",

    // totalPrice: "11286",
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
    // totalListPrice: "1848",

    // totalPrice: "1848",
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
    // totalListPrice: "11286",

    // totalPrice: "11286",
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
    // totalListPrice: "4485",

    // totalPrice: "2084",
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
    // totalListPrice: "4485",

    // totalPrice: "2084",
  },
]
// =========================================================================
// =========================================================================
// =========================================================================
// =========================================================================
// =========================================================================
// =========================================================================
// =========================================================================
// =========================================================================
const fakePartOri03 = (): TpartList => [
  {
    subType: "SJ00",
    subTypeName: "捲門片",
    id: "SJ0000A0000",
    material: "SST",
    surface: "304#",
    basicWeight: "99.99",
    unit: "m2",
    qty: undefined,
    listPrice: "3082",
  },
  {
    subType: "SJ00",
    subTypeName: "捲輪",
    id: "SJ0000A0000",
    material: "SST",
    surface: "304#",
    basicWeight: "99.99",
    unit: "M",
    qty: undefined,
    listPrice: "901",
  },
  {
    subType: "SJ00",
    subTypeName: "門箱",
    id: "SJ0000A0000",
    material: "SST",
    surface: "304#",
    basicWeight: "99.99",
    unit: "M",
    qty: undefined,
    listPrice: "1390",
  },
  {
    subType: "SJ00",
    subTypeName: "底座",
    id: "SJ0000A0000",
    material: "SST",
    surface: "304#",
    basicWeight: "99.99",
    unit: "M",
    qty: undefined,
    listPrice: "887",
  },
  {
    subType: "SJ00",
    subTypeName: "門軌",
    id: "SJ0000A0000",
    material: "SST",
    surface: "304#",
    basicWeight: "99.99",
    unit: "M",
    qty: undefined,
    listPrice: "1642",
  },
  {
    subType: "SJ00",
    subTypeName: "馬達機",
    id: "SJ0000A0000",
    material: "SST",
    surface: "304#",
    basicWeight: "99.99",
    unit: "組",
    qty: "1",
    listPrice: "20259",
  },
  {
    subType: "SJ00",
    subTypeName: "配電箱及按鈕開關",
    id: "SJ0000A0000",
    material: "SST",
    surface: "304#",
    basicWeight: "99.99",
    unit: "組",
    qty: "1",
    listPrice: "2851",
  },
  {
    subType: "SJ00",
    subTypeName: "按裝費",
    id: "SJ0000A0000",
    material: "SST",
    surface: "304#",
    basicWeight: "99.99",
    unit: "m2",
    qty: undefined,
    listPrice: "864",
  },
  {
    subType: "SJ00",
    subTypeName: "障礙感知器",
    id: "SJ0000A0000",
    material: "SST",
    surface: "304#",
    basicWeight: "99.99",
    unit: "組",
    qty: "1",
    listPrice: "2400",
  },
  {
    subType: "SJ00",
    subTypeName: "障礙感知器-鋁合金",
    id: "SJ0000A0000",
    material: "SST",
    surface: "304#",
    basicWeight: "99.99",
    unit: "M",
    qty: undefined,
    listPrice: "864",
  },
  {
    subType: "SJ00",
    subTypeName: "遙控器(1:2)",
    id: "SJ0000A0000",
    material: "SST",
    surface: "304#",
    basicWeight: "99.99",
    unit: "套",
    qty: "1",
    listPrice: "2400",
  },
  {
    subType: "SJ00",
    subTypeName: "檔輪",
    id: "SJ0000A0000",
    material: "SST",
    surface: "304#",
    basicWeight: "99.99",
    unit: "M",
    qty: undefined,
    listPrice: "317",
  },
  {
    subType: "SJ00",
    subTypeName: "防颱可拆式抗風中柱",
    id: "SJ0000A0000",
    material: "SST",
    surface: "304#",
    basicWeight: "99.99",
    unit: "支",
    qty: "2",
    listPrice: "21600",
  },
]
// =================================================================================
const fakePartOri04 = (): TpartList => [
  {
    subType: "SJ00",
    subTypeName: "門片",
    id: "SJ0000A0000",
    material: "SST",
    surface: "304#",
    basicWeight: "99.99",
    unit: "m2",
    qty: undefined,
    listPrice: "8329",
  },
  {
    subType: "SJ00",
    subTypeName: "捲軸",
    id: "SJ0000A0000",
    material: "SST",
    surface: "304#",
    basicWeight: "99.99",
    unit: "M",
    qty: undefined,
    listPrice: "468",
  },
  {
    subType: "SJ00",
    subTypeName: "門箱",
    id: "SJ0000A0000",
    material: "SST",
    surface: "304#",
    basicWeight: "99.99",
    unit: "M",
    qty: undefined,
    listPrice: "6030",
  },
  {
    subType: "SJ00",
    subTypeName: "底座",
    id: "SJ0000A0000",
    material: "SST",
    surface: "304#",
    basicWeight: "99.99",
    unit: "M",
    qty: undefined,
    listPrice: "190",
  },
  {
    subType: "SJ00",
    subTypeName: "門軌",
    id: "SJ0000A0000",
    material: "SST",
    surface: "304#",
    basicWeight: "99.99",
    unit: "M",
    qty: undefined,
    listPrice: "2923",
  },
  {
    subType: "SJ00",
    subTypeName: "馬達機",
    id: "SJ0000A0000",
    material: "SST",
    surface: "304#",
    basicWeight: "99.99",
    unit: "組",
    qty: "1",
    listPrice: "13242",
  },
  {
    subType: "SJ00",
    subTypeName: "配電箱及按鈕開關",
    id: "SJ0000A0000",
    material: "SST",
    surface: "304#",
    basicWeight: "99.99",
    unit: "組",
    qty: "1",
    listPrice: "2851",
  },
  {
    subType: "SJ00",
    subTypeName: "按裝費",
    id: "SJ0000A0000",
    material: "SST",
    surface: "304#",
    basicWeight: "99.99",
    unit: "m2",
    qty: undefined,
    listPrice: "2592",
  },
  {
    subType: "SJ00",
    subTypeName: "支板63CM",
    id: "SJ0000A0000",
    material: "SST",
    surface: "304#",
    basicWeight: "99.99",
    unit: "組",
    qty: "1",
    listPrice: "5033",
  },
  {
    subType: "SJ00",
    subTypeName: "紅外線感知器",
    id: "SJ0000A0000",
    material: "SST",
    surface: "304#",
    basicWeight: "99.99",
    unit: "組",
    qty: "1",
    listPrice: "7200",
  },
]
// ==============================================================================
const fakePartOri05 = (): TpartList => [
  {
    subType: "SJ00",
    subTypeName: "捲門片",
    id: "SJ0000A0000",
    material: "SST",
    surface: "304#",
    basicWeight: "99.99",
    unit: "m2",
    qty: undefined,
    listPrice: "2962",
  },
  {
    subType: "SJ00",
    subTypeName: "捲軸",
    id: "SJ0000A0000",
    material: "SST",
    surface: "304#",
    basicWeight: "99.99",
    unit: "M",
    qty: undefined,
    listPrice: "468",
  },
  {
    subType: "SJ00",
    subTypeName: "門箱",
    id: "SJ0000A0000",
    material: "SST",
    surface: "304#",
    basicWeight: "99.99",
    unit: "M",
    qty: undefined,
    listPrice: "1390",
  },
  {
    subType: "SJ00",
    subTypeName: "底座",
    id: "SJ0000A0000",
    material: "SST",
    surface: "304#",
    basicWeight: "99.99",
    unit: "M",
    qty: undefined,
    listPrice: "887",
  },
  {
    subType: "SJ00",
    subTypeName: "門軌",
    id: "SJ0000A0000",
    material: "SST",
    surface: "304#",
    basicWeight: "99.99",
    unit: "M",
    qty: undefined,
    listPrice: "830",
  },
  {
    subType: "SJ00",
    subTypeName: "馬達機",
    id: "SJ0000A0000",
    material: "SST",
    surface: "304#",
    basicWeight: "99.99",
    unit: "組",
    qty: "1",
    listPrice: "9619",
  },
  {
    subType: "SJ00",
    subTypeName: "配電箱及按鈕開關",
    id: "SJ0000A0000",
    material: "SST",
    surface: "304#",
    basicWeight: "99.99",
    unit: "組",
    qty: "1",
    listPrice: "2851",
  },
  {
    subType: "SJ00",
    subTypeName: "按裝費",
    id: "SJ0000A0000",
    material: "SST",
    surface: "304#",
    basicWeight: "99.99",
    unit: "m2",
    qty: undefined,
    listPrice: "864",
  },
  {
    subType: "SJ00",
    subTypeName: "障礙感知器",
    id: "SJ0000A0000",
    material: "SST",
    surface: "304#",
    basicWeight: "99.99",
    unit: "組",
    qty: "1",
    listPrice: "2400",
  },
  {
    subType: "SJ00",
    subTypeName: "障礙感知器-鋁合金",
    id: "SJ0000A0000",
    material: "SST",
    surface: "304#",
    basicWeight: "99.99",
    unit: "M",
    qty: undefined,
    listPrice: "864",
  },
  {
    subType: "SJ00",
    subTypeName: "遙控器(1:2)",
    id: "SJ0000A0000",
    material: "SST",
    surface: "304#",
    basicWeight: "99.99",
    unit: "套",
    qty: "1",
    listPrice: "2400",
  },
  {
    subType: "SJ00",
    subTypeName: "檔輪",
    id: "SJ0000A0000",
    material: "SST",
    surface: "304#",
    basicWeight: "99.99",
    unit: "M",
    qty: undefined,
    listPrice: "317",
  },
]

// {
//   subType: "SJ00",
//   subTypeName: "",
//   id: "SJ0000A0000",
//   material: "SST",
//   surface: "304#",
//   basicWeight: "99.99",
//   unit: "",
//   qty: undefined,
//   listPrice: "",
// },










const fakePartGroupOri = (): {
  [key in TquoteTypeKeys]: Tpart[]
} => ({
  "捲門": fakePartOri03(),
  "不是捲門": fakePartOri04(),
  "大捲門": fakePartOri05(),
})


export type {
  Tpart,
  TpartList,
  TquoteTypeKeys
}

export {
  fakePartGroupOri
}