

type Tconfig = {
  id: string
  label: string
  width: string
  type: string
  position: string
}





const dndCellConfigOri = (): { [key: string]: Tconfig } => ({
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


type TdndCellConfig = ReturnType<typeof dndCellConfigOri>
type TdndCellConfigkeys = keyof TdndCellConfig

export { dndCellConfigOri }
export type { TdndCellConfig, TdndCellConfigkeys, Tconfig }

