// 報價單假資料



// ========================================================
// profile
interface Tquotataion {
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

const fakeProfile = {
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
// product
interface TfakeProduct {
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
}


const fakeProductList: TfakeProduct[] = [
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
    memo: "防颱防颱"
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
    memo: "防颱防颱"
  },
]
// ========================================================




const fakeQuotationData = {
  profile: fakeProfile,
  productList: fakeProductList
}




export default fakeQuotationData

