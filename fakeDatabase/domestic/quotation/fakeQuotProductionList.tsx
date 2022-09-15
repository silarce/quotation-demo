
import {
  Tcomponent, TcomponentList,
  fakeComponentList
} from "./fakeQuotComponentList"
import {
  Taccessory, TaccessoryList,
  fakeAccessoryList
} from "./fakeQuotAccessoryList"

const _ = require("lodash")


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
  ejectionDoor: boolean
  component: Tcomponent[]
  accessory: Taccessory[]
  // ----
  quoteTypeType: string
}



const fakeQuotProductListOri: () => Tproduct[] = () => [
  {
    discount: "100.00",
    project: "SD1",
    quoteType: "不是捲門",
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
    ejectionDoor: false,
    component: JSON.parse(JSON.stringify(fakeComponentList)),
    accessory: JSON.parse(JSON.stringify(fakeAccessoryList)),
    quoteTypeType: "normal"
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
    ejectionDoor: true,
    component: JSON.parse(JSON.stringify(fakeComponentList)),
    accessory: JSON.parse(JSON.stringify(fakeAccessoryList)),
    quoteTypeType: "rollerDoor"
  },
]


// =========================================================
type TprodCellKey = keyof (Omit<Tproduct, "component" | "accessory" | "quoteTypeType">)

type TprodCellConfig = {
  keyList: TprodCellKey[]
  cellConfig: {
    [key in TprodCellKey]: TcellConfig
  }
}

interface TcellConfig {
  id: string
  label: string
  width: string
  type: string
}


const prodCellConfigOri: () => TprodCellConfig = () => ({
  keyList: [
    "discount", "project", "quoteType", "L", "W",
    "H", "B", "area", "cai", "doorType",
    "material", "surface", "horsepower", "qty", "unitPrice",
    "subTotal", "memo", "ejectionDoor"],
  cellConfig: {
    discount: { id: "discount", label: "折數", width: "75px", type: "input" },
    project: { id: "project", label: "項目", width: "60px", type: "input" },
    quoteType: { id: "quoteType", label: "報價別", width: "105px", type: "select" },
    L: { id: "L", label: "L", width: "60px", type: "input" },
    W: { id: "W", label: "W", width: "60px", type: "input" },
    H: { id: "H", label: "H", width: "60px", type: "input" },
    B: { id: "B", label: "B", width: "60px", type: "input" },
    area: { id: "area", label: "面積", width: "60px", type: "input" },
    cai: { id: "cai", label: "才數", width: "75px", type: "input" },
    doorType: { id: "doorType", label: "門型", width: "75px", type: "input" },
    material: { id: "material", label: "材料", width: "120px", type: "select" },
    surface: { id: "surface", label: "表面", width: "55px", type: "select" },
    horsepower: { id: "horsepower", label: "馬力", width: "60px", type: "input" },
    qty: { id: "qty", label: "數量", width: "43px", type: "input" },
    unitPrice: { id: "unitPrice", label: "單價", width: "84px", type: "input" },
    subTotal: { id: "subTotal", label: "複價", width: "84px", type: "input" },
    memo: { id: "memo", label: "備註", width: "90px", type: "select" },
    ejectionDoor: { id: "ejectionDoor", label: "彈射門", width: "60px", type: "checkbox" },
  }
})


const emptyProduct: Tproduct = {
  discount: "",
  project: "",
  quoteType: "",
  L: "",
  W: "",
  H: "",
  B: "",
  area: "",
  cai: "",
  doorType: "",
  material: "",
  surface: "",
  horsepower: "",
  qty: "",
  unitPrice: "",
  subTotal: "",
  memo: "",
  ejectionDoor: false,
  component: _.cloneDeep(fakeComponentList),
  accessory: _.cloneDeep(fakeAccessoryList),
  quoteTypeType: "normal"
}



export type { Tproduct }
export { fakeQuotProductListOri, emptyProduct }

export type { TprodCellConfig, TcellConfig, TprodCellKey }
export { prodCellConfigOri }