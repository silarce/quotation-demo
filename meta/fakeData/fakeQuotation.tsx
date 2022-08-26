// 報價單假資料

import type { Toption } from "components/global/gear/select/select03"

// ========================================================
// type
interface Tprofile {
  quotationId: string
  clientId: string
  clientName: string
  contactPerson: string
  contactPhone: string
  fax: string
  clientState: string
  ageing: string //時效
  builtDate: string//報價日期
  projectName: string
  trackState: string//追蹤狀態
  schedule: string//工地進度
  projectAddress: string
}

// -------------------------------
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

interface Taccessory {
  id: string
  name: string
  unit: string
  qty: string
  listPrice: string //牌價
  totalListPrice: string //牌價複價
  price: string //單價
  totalPrice: string //複價
}

interface Tproduct {
  discount: string  // 折數
  project: string  // 項目
  quoteType: string  // 報價別
  L: string  // L
  W: string  // W
  H: string  // H
  B: string  // B
  area: string  // 面積
  cai: string  // 才數 // 只有台灣在用的單位，沒有英文譯名
  doorType: string  // 門型
  material: string  // 材料
  surface: string  // 表面
  horsepower: string  // 馬力
  qty: string  // 數量
  unitPrice: string  // 單價
  subTotal: string  // 複價
  memo: string  // 備註
  component: Tcomponent[]
  accessory: Taccessory[]
}

// -----------------------------

interface Tmemo {
  content: string
}
interface TmemoList {
  list: Tmemo[]
  options: Tmemo[]
}
// type TmemoList = Tmemo[]

// -----------------------------
// -----------------------------
interface Tquotation {
  profile: Tprofile
  productList: Tproduct[]
  memoList: TmemoList
}


// ========================================================
// ========================================================
// ========================================================
// profile

const fakeProfile: Tprofile = {
  quotationId: "S-110211-06",
  clientId: "S0000",
  clientName: "新加坡商犀牛頓科技股份有限公司",
  contactPerson: "陳小明小華",
  contactPhone: "0987654321",
  fax: "04-12345656",
  clientState: "一般客戶",
  ageing: "10",
  builtDate: "2020-02-02",
  projectName: "台灣日鑛金屬(股)公司~JX金屬台灣彰濱廠房增建工程",
  trackState: "",
  schedule: "",
  projectAddress: "未定",
}


// ========================================================
// ========================================================
// ========================================================
// product

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

// ------------------------------------
// component

const fakeComponent: Tcomponent[] = [
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
// ----------------------------------------------------------
// ----------------------------------------------------------
// accessory
const fakeAccessory: Taccessory[] = [
  {
    id: "SJ0A09",
    name: "鋁合金障礙感知器",
    unit: "M",
    qty: "1",
    listPrice: "5000",
    totalListPrice: "5000",
    price: "5000",
    totalPrice: "5000",
  },
  {
    id: "SJ0A77",
    name: "紅外線",
    unit: "組",
    qty: "1",
    listPrice: "15000",
    totalListPrice: "15000",
    price: "15000",
    totalPrice: "15000",
  },
  {
    id: "SJ0A07",
    name: "遙控器",
    unit: "組",
    qty: "1",
    listPrice: "5000",
    totalListPrice: "5000",
    price: "5000",
    totalPrice: "5000",
  },
  {
    id: "SJ0A01",
    name: "防颱底座鎖固",
    unit: "組",
    qty: "1",
    listPrice: "5000",
    totalListPrice: "5000",
    price: "5000",
    totalPrice: "5000",
  },
]



// ----------------------------------------------------------
// ----------------------------------------------------------


const fakeProductList: Tproduct[] = [
  {
    discount: "100.00",
    project: "SD1",
    quoteType: "捲門捲門捲",
    L: "516",
    W: "230",
    H: "230",
    B: "45",
    area: "14.19",
    cai: "154.52",
    doorType: "SJ-302",
    material: "不鏽鋼304#",
    surface: "BA",
    horsepower: "1/3HP",
    qty: "1",
    unitPrice: "158610",
    subTotal: "158610",
    memo: "防颱防颱",
    component: JSON.parse(JSON.stringify(fakeComponent)),
    accessory: JSON.parse(JSON.stringify(fakeAccessory))
  },
  {
    discount: "86.43",
    project: "SD2",
    quoteType: "捲門",
    L: "416",
    W: "100",
    H: "330",
    B: "20",
    area: "22.66",
    cai: "200.87",
    doorType: "SJ-302",
    material: "不鏽鋼304#",
    surface: "BA",
    horsepower: "1/3HP",
    qty: "1",
    unitPrice: "158610",
    subTotal: "158610",
    memo: "防颱防颱",
    component: JSON.parse(JSON.stringify(fakeComponent)),
    accessory: JSON.parse(JSON.stringify(fakeAccessory))
  },
]
// ----------------------------------------------------------
// ----------------------------------------------------------
// ----------------------------------------------------------
const fakeMemo: TmemoList = {
  list: [
    { content: "防颱型捲門含防颱底座鎖固*1個、檔輪、鋁合金障感器及遙控器(1:2),捲箱2面0.8t。" },
    { content: "捲門烤漆色,採三久公司標準色(雲白/乳白),J-302門片1.5t色鋼捲(正反面不同色),若指定顏色單價另計" },
    { content: "抗風壓結構計算技師簽證費用、材料檢驗費用、防颱中柱、高空作業自動防火連動操作裝置、前遮板、矽利康、懸吊系統、門框補強立柱、收邊料,單價另計。" },
    { content: "如預先理設螺絲時提供交由土木工程負責設。" },
    { content: "水泥補修及與捲門無關之工作或鐵件皆不在承作範圍之内。" },
  ],
  options: [
    { content: "防颱型捲門含防颱底座鎖固*1個、檔輪、鋁合金障感器及遙控器(1:2),捲箱2面0.8t。" },
    { content: "捲門烤漆色,採三久公司標準色(雲白/乳白),J-302門片1.5t色鋼捲(正反面不同色),若指定顏色單價另計" },
    { content: "抗風壓結構計算技師簽證費用、材料檢驗費用、防颱中柱、高空作業自動防火連動操作裝置、前遮板、矽利康、懸吊系統、門框補強立柱、收邊料,單價另計。" },
    { content: "如預先理設螺絲時提供交由土木工程負責設。" },
    { content: "水泥補修及與捲門無關之工作或鐵件皆不在承作範圍之内。" },
  ]
}
// // ----------------------------------------------------------
// const fakeMemo: TmemoList = [
//   { content: "防颱型捲門含防颱底座鎖固*1個、檔輪、鋁合金障感器及遙控器(1:2),捲箱2面0.8t。" },
//   { content: "捲門烤漆色,採三久公司標準色(雲白/乳白),J-302門片1.5t色鋼捲(正反面不同色),若指定顏色單價另計" },
//   { content: "抗風壓結構計算技師簽證費用、材料檢驗費用、防颱中柱、高空作業自動防火連動操作裝置、前遮板、矽利康、懸吊系統、門框補強立柱、收邊料,單價另計。" },
//   { content: "如預先理設螺絲時提供交由土木工程負責設。" },
//   { content: "水泥補修及與捲門無關之工作或鐵件皆不在承作範圍之内。" },
// ]

// ========================================================
// ========================================================
// ========================================================





const fakeQuotationData: Tquotation = {
  profile: fakeProfile,
  productList: fakeProductList,
  memoList: fakeMemo
}


export default fakeQuotationData
export { fakeComponent, fakeAccessory }
export type {
  Tquotation,
  Tprofile,
  Tcomponent, Taccessory, Tproduct,
  TmemoList, Tmemo,
}

