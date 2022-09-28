
import iconDoorRail75 from "public/image/icon/doorRail/doorRail75.svg"

import { Toption } from "components/global/gear/select/select03"


import {
  Tcomponent,
  fakeComponentListOri
} from "./fakeQuotComponentList"
import {
  Taccessory,
  fakeAccessoryListOri
} from "./fakeQuotAccessoryList"




const fakeComponentList = fakeComponentListOri()
const fakeAccessoryList = fakeAccessoryListOri()





interface TproductString {
  discount: string  // 折數
  project: string  // 項目
  L: string  // L
  W: string  // W
  H: string  // H
  B: string  // B
  area: string  // 面積
  cai: string  // 才數 // 只有台灣在用的單位，沒有英文譯名
  doorType: string  // 門型
  horsepower: string  // 馬力
  qty: string  // 數量
  unitPrice: string  // 單價
  subTotal: string  // 複價
}

interface TproductBoolean {
  ejectionDoor: boolean // 是否可選彈射門
}

interface TproductObject {
  quoteType: {
    value: string
    label: string
    quoteTypeType: string
  } | Toption  // 報價別
  material: {
    value: string
    label: string
  } | Toption // 材料
  surface: {
    value: string
    label: string
  } | Toption  // 表面
  doorRail: {
    value: string
    label: string
    icon: string
  } | Toption // 門軌
  memo: {
    value: string
    label: string
  } | Toption  // 備註
}

interface TproductArray {
  component: Tcomponent[] //材料/配件設定
  accessory: Taccessory[] //選配設定
}


type Tproduct =
  TproductString &
  TproductBoolean &
  TproductObject &
  TproductArray


const fakeQuotProductListOri: () => Tproduct[] = () => [
  {
    discount: "100.00",
    project: "SD1",
    quoteType: {
      value: "不是捲門",
      label: "不是捲門",
      quoteTypeType: "normal"
    },
    L: "516",
    W: "230",
    H: "230",
    B: "45",
    area: "14.19",
    cai: "15400.52", //才數
    doorType: "SJ-30287", //門型
    material: {
      value: "不鏽鋼304#",
      label: "不鏽鋼304#",
    },
    surface: {
      value: "BA",
      label: "BA",
    },
    doorRail: {
      value: "75",
      label: "75",
      icon: iconDoorRail75.src
    },
    horsepower: "1/3HP",
    qty: "1",
    unitPrice: "158610",
    subTotal: "158610",
    memo: {
      value: "防颱防颱",
      label: "防颱防颱",
    },
    component: fakeComponentList,
    accessory: fakeAccessoryList,
    ejectionDoor: false,
  },
  {
    discount: "86.43",
    project: "SD2",
    quoteType: {
      value: "捲門",
      label: "捲門",
      quoteTypeType: "rollerDoor"
    },
    L: "416",
    W: "100",
    H: "330",
    B: "20",
    area: "22.66",
    cai: "200.87",
    doorType: "SJ-302",
    material: {
      value: "不鏽鋼304#",
      label: "不鏽鋼304#"
    },
    surface: {
      value: "BA",
      label: "BA"
    },
    doorRail: {
      value: "75",
      label: "75",
      icon: iconDoorRail75.src
    },
    horsepower: "1/3HP",
    qty: "1",
    unitPrice: "158610",
    subTotal: "158610",
    memo: {
      value: "防颱防颱",
      label: "防颱防颱"
    },
    component: fakeComponentList,
    accessory: fakeAccessoryList,
    ejectionDoor: true,
  },
]


// =========================================================
type TprodCellKey = keyof (Omit<Tproduct, "component" | "accessory">)

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
    "material", "surface", "doorRail", "horsepower", "qty", "unitPrice",
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
    doorRail: { id: "doorRail", label: "門軌", width: "70px", type: "selectWithIcon" },
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
  quoteType: {
    value: "",
    label: "",
    quoteTypeType: ""
  },
  L: "",
  W: "",
  H: "",
  B: "",
  area: "",
  cai: "",
  doorType: "",
  material: {
    value: "",
    label: "",
  },
  surface: {
    value: "",
    label: "",
  },
  doorRail: {
    value: "",
    label: "",
    icon: ""
  },
  horsepower: "",
  qty: "",
  unitPrice: "",
  subTotal: "",
  memo: {
    value: "",
    label: "",
  },
  ejectionDoor: false,
  component: fakeComponentList,
  accessory: fakeAccessoryList,
}



export type {
  Tproduct,
  TproductString,
  TproductBoolean,
  TproductObject,
  TproductArray,
}
export { fakeQuotProductListOri, emptyProduct }

export type { TprodCellConfig, TcellConfig, TprodCellKey }
export { prodCellConfigOri }