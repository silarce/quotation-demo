

interface TproductString {
  discount: string  // 折數
  project: string  // 項目
  L: string  // L
  W: string  // W
  H: string  // H
  qty: string  // 數量
  memo: string //備註
  // cai: string  // 才數 // 只有台灣在用的單位，沒有英文譯名
  // area: string  // 面積
  // unitPrice: string  // 單價
  // subTotal: string  // 複價
}

interface TproductObject {
  doorType: string  // 門型
  horsepower: string  // 馬力
  quoteType: string
  material: string
  surface: string
  doorRail: string
  B: string  // B
}

interface TproductBoolean {
  ejectionDoor: boolean // 是否可選彈射門
  typhoonProof: boolean
}

type Tproduct =
  TproductString
  & TproductBoolean
  & TproductObject


const fakeQuotProductListOri = (): Tproduct[] => [
  {
    discount: "100.00",
    project: "SD1",
    quoteType: "不是捲門",
    L: "516",
    W: "0",
    H: "230",
    B: "45",
    // area: "14.19",
    // cai: "1540.5", //才數
    doorType: "SJ-30287", //門型
    material: "不鏽鋼304#",
    surface: "BA",
    doorRail: "60",
    horsepower: "1/3HP",
    qty: "1",
    // unitPrice: "158610",
    // subTotal: "158610",
    memo: "防颱防颱",
    ejectionDoor: false,
    typhoonProof: false
  },
  {
    discount: "86.43",
    project: "SD2",
    quoteType: "捲門",
    L: "0",
    W: "165",
    H: "330",
    B: "77",
    // area: "22.66",
    // cai: "200.87",
    doorType: "SJ-302",
    material: "不鏽鋼304#",
    surface: "BA",
    doorRail: "75",
    horsepower: "1/3HP",
    qty: "1",
    // unitPrice: "158610",
    // subTotal: "158610",
    memo: "防颱防颱",
    ejectionDoor: true,
    typhoonProof: true,
  },
]




export type {
  Tproduct,
  TproductString,
  TproductBoolean,
  TproductObject,
}
export { fakeQuotProductListOri }

