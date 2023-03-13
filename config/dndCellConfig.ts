

type Tconfig<key> = {
  id: key
  label: string
  width: string
  type: string
  position: string
}



type TdndCellConfigKeys =
  "discount" | "project" | "quoteType" |
  "L" | "W" | "H" | "B" | "area" | "cai"
  | "doorType" | "material" | "surface" |
  "doorRail" | "horsepower" | "qty"
  | "unitPrice" | "subTotal" | "memo" |
  "ejectionDoor" | "openType" | "thickness" |
  "totalCai"

type TdndCellConfig = {
  [key in TdndCellConfigKeys]: Tconfig<key>
}

const dndCellConfigOri = (): TdndCellConfig => ({
  discount: {
    id: "discount", label: "折數", width: "75px",
    type: "input", position: ""
  },
  project: {
    id: "project", label: "項目", width: "60px",
    type: "input", position: ""
  },
  quoteType: {
    id: "quoteType", label: "報價別", width: "105px",
    type: "select", position: ""
  },
  L: {
    id: "L", label: "L", width: "60px",
    type: "input", position: "center"
  },
  W: {
    id: "W", label: "W", width: "60px",
    type: "input", position: "center"
  },
  H: {
    id: "H", label: "H", width: "60px",
    type: "input", position: "center"
  },
  B: {
    id: "B", label: "B", width: "60px",
    type: "input", position: "center"
  },
  area: {
    id: "area", label: "面積", width: "60px",
    type: "input", position: ""
  },
  cai: {
    id: "cai", label: "才數", width: "75px",
    type: "input", position: ""
  },
  totalCai: {
    id: "totalCai", label: "總才數", width: "75px",
    type: "input", position: ""
  },
  doorType: {
    id: "doorType", label: "門型", width: "75px",
    type: "input", position: ""
  },
  material: {
    id: "material", label: "材料", width: "120px",
    type: "select", position: ""
  },
  surface: {
    id: "surface", label: "表面", width: "55px",
    type: "select", position: ""
  },
  doorRail: {
    id: "doorRail", label: "門軌", width: "70px",
    type: "selectWithIcon", position: ""
  },
  horsepower: {
    id: "horsepower", label: "馬力", width: "60px",
    type: "input", position: ""
  },
  qty: {
    id: "qty", label: "數量", width: "43px",
    type: "input", position: "center"
  },
  unitPrice: {
    id: "unitPrice", label: "單價", width: "84px",
    type: "input", position: ""
  },
  subTotal: {
    id: "subTotal", label: "複價", width: "84px",
    type: "input", position: ""
  },
  memo: {
    id: "memo", label: "備註", width: "90px",
    type: "select", position: ""
  },
  ejectionDoor: {
    id: "ejectionDoor", label: "彈射門", width: "60px",
    type: "checkbox", position: ""
  },
  openType: {
    id: "openType", label: "開門方式", width: "82px",
    type: "select", position: "center"
  },
  thickness: {
    id: "thickness", label: "厚度", width: "45px",
    type: "input", position: ""
  },
})
// =============================================================


type TdndCellConfigOutboundOrderKeys =
  Extract<TdndCellConfigKeys,
    "project" | "L" | "W" | "B" | "cai" |
    "totalCai" | "doorType" | "material" | "horsepower" |
    "surface" | "qty"
  > |
  "remark01" | "remark02" | "remark03" | "remark04" |
  "appended" | "orderCreatedDate" | "finishAppended" |
  "installer" | "installDate" | "implementQty"



type TdndCellConfigOutboundOrder = {
  [key in TdndCellConfigOutboundOrderKeys]: Tconfig<key>
}

const dndCellConfigOutboundOrderOri = (): TdndCellConfigOutboundOrder => ({
  ...dndCellConfigOri(),
  remark01: {
    id: "remark01", label: "備註1", width: "65px",
    type: "input", position: ""
  },
  remark02: {
    id: "remark02", label: "備註2", width: "65px",
    type: "input", position: ""
  },
  remark03: {
    id: "remark03", label: "備註3", width: "65px",
    type: "input", position: ""
  },
  remark04: {
    id: "remark04", label: "備註4", width: "65px",
    type: "input", position: ""
  },
  appended: {
    id: "appended", label: "追加", width: "65px",
    type: "input", position: ""
  },
  orderCreatedDate: {
    id: "orderCreatedDate", label: "工作表開立日期", width: "115px",
    type: "input", position: ""
  },
  finishAppended: {
    id: "finishAppended", label: "完成追加", width: "75px",
    type: "input", position: ""
  },
  installer: {
    id: "installer", label: "安裝人員", width: "85px",
    type: "input", position: ""
  },
  installDate: {
    id: "installDate", label: "安裝日期", width: "85px",
    type: "input", position: ""
  },
  implementQty: {
    id: "implementQty", label: "實作數量", width: "75px",
    type: "input", position: "center"
  },
})






export { dndCellConfigOri, dndCellConfigOutboundOrderOri }
export type {
  TdndCellConfig, TdndCellConfigKeys, Tconfig,
  TdndCellConfigOutboundOrder, TdndCellConfigOutboundOrderKeys

}

