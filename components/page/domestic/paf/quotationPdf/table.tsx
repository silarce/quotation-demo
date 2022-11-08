
// css
import style from "./quotationPdf.module.scss"






export default function Table() {



  return (
    <div className={style.table}>

      {indexKeys.map((key, index) => {
        const { label, width } = config[key]
        const theStyle = { width }
        return (
          <div className={style.thead} key={index} style={theStyle}>
            <span>
              {
                label === "開閉方式"
                  ?
                  <>
                    <span>開閉</span> <br />
                    <span>方式</span>
                  </>
                  : label
              }
            </span>
          </div>
        )
      })}
    </div>
  )
}

// =============================================================================

type TindexKeys =
  "project" | "size" | "doorType" | "material" | "thickness" |
  "surface" | "doorRail" | "horsepower" | "openType" | "qty" |
  "unitPrice" | "subTotal" | "memo"

type Tconfig = {
  [key in TindexKeys]: {
    label: string
    width: string
  }
}

const indexKeys: TindexKeys[] = [
  "project", "size", "doorType", "material", "thickness",
  "surface", "doorRail", "horsepower", "openType", "qty",
  "unitPrice", "subTotal", "memo"
]

const config: Tconfig = {
  project: {
    label: "項目",
    width: "120px",
  },
  size: {
    label: "尺寸(單位:cm)",
    width: "195px",
  },
  doorType: {
    label: "門型",
    width: "150px",
  },
  material: {
    label: "材料",
    width: "90px",
  },
  thickness: {
    label: "厚度",
    width: "80px",
  },
  surface: {
    label: "表面",
    width: "80px",
  },
  doorRail: {
    label: "門軌",
    width: "80px",
  },
  horsepower: {
    label: "馬力",
    width: "80px",
  },
  openType: {
    label: "開閉方式",
    width: "75px",
  },
  qty: {
    label: "數量",
    width: "95px",
  },
  unitPrice: {
    label: "單價",
    width: "130px",
  },
  subTotal: {
    label: "複價",
    width: "155px",
  },
  memo: {
    label: "備註",
    width: "80px",
  },
}


















