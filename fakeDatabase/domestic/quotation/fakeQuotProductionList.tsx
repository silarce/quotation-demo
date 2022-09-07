
import {
  Tcomponent, TcomponentList,
  fakeComponentList
} from "./fakeQuotComponentList"
import {
  Taccessory, TaccessoryList,
  fakeAccessoryList
} from "./fakeQuotAccessoryList"


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



const fakeQuotProductList: Tproduct[] = [
  {
    discount: "100.00",
    project: "SD1",
    quoteType: "捲門捲門捲",
    L: "516",
    W: "230",
    H: "230",
    B: "45",
    area: "14.19",
    cai: "15400.52", //才數
    doorType: "SJ-30287", //門型
    material: "不鏽鋼304#",
    surface: "BA",
    horsepower: "1/3HP",
    qty: "1",
    unitPrice: "158610",
    subTotal: "158610",
    memo: "防颱防颱",
    component: JSON.parse(JSON.stringify(fakeComponentList)),
    accessory: JSON.parse(JSON.stringify(fakeAccessoryList))
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
    component: JSON.parse(JSON.stringify(fakeComponentList)),
    accessory: JSON.parse(JSON.stringify(fakeAccessoryList))
  },
]


// =========================================================
type TprodCellConfig = {
  keyList: (keyof (Omit<Tproduct, "component" | "accessory">))[]
  cellConfig: {
    [key in (keyof (Omit<Tproduct, "component" | "accessory">))]: {
      id: string
      label: string;
      width: string
    }
  }
}

const prodCellConfig: TprodCellConfig = {
  keyList: [
    "discount", "project", "quoteType", "L", "W",
    "H", "B", "area", "cai", "doorType",
    "material", "surface", "horsepower", "qty", "unitPrice",
    "subTotal", "memo"],
  cellConfig: {
    discount: { id: "discount", label: "折數", width: "75px" },
    project: { id: "project", label: "項目", width: "60px" },
    quoteType: { id: "quoteType", label: "報價別", width: "105px" },
    L: { id: "L", label: "L", width: "60px" },
    W: { id: "W", label: "W", width: "60px" },
    H: { id: "H", label: "H", width: "60px" },
    B: { id: "B", label: "B", width: "60px" },
    area: { id: "area", label: "面積", width: "60px" },
    cai: { id: "cai", label: "才數", width: "75px" },
    doorType: { id: "doorType", label: "門型", width: "75px" },
    material: { id: "material", label: "材料", width: "120px" },
    surface: { id: "surface", label: "表面", width: "55px" },
    horsepower: { id: "horsepower", label: "馬力", width: "60px" },
    qty: { id: "qty", label: "數量", width: "43px" },
    unitPrice: { id: "unitPrice", label: "單價", width: "84px" },
    subTotal: { id: "subTotal", label: "複價", width: "84px" },
    memo: { id: "memo", label: "備註", width: "90px" },
  }
}



export type { Tproduct }
export { fakeQuotProductList }

export type { TprodCellConfig }
export { prodCellConfig }