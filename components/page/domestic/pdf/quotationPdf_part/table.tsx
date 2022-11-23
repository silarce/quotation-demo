
import { ProdClass, PartClass } from "components/page/domestic/quotation/hook/useProduct"

// css
import scss from "./quotationPdf_part.module.scss"


export default function Table(
  { prod }:
    { prod: ProdClass }
) {

  const { part: partArr } = prod

  return (
    <div className={scss.table}>
      <div className={scss.thead}>
        <div style={{ width: "90px" }}><span>項次:</span></div>
        {keyIndex.map((key, index) => {
          const { label, style } = config[key]
          const { width, flex } = style
          return (
            <div key={index} style={{ width, flex }}><span>{label}</span></div>
          )
        })}
      </div>

      <div className={scss.tbody}>
        {partArr.map((part, pIndex) => {
          return (
            <div className={scss.row} key={pIndex}>
              <div style={{ width: "90px" }}><span>{pIndex}</span></div>
              {keyIndex.map((key, cIndex) => {
                const { style } = config[key]
                const value = part[key] as string
                return (
                  <div key={cIndex} style={style}><span>{value}</span></div>
                )
              })}
            </div>
          )
        })}
      </div>

      <div className={scss.total}>
        <div><span>報價合計 : </span></div>
        <div><span>{prod.priceTotal}</span></div>
      </div>
    </div>
  )
}


// ============================================================================

type TkeyIndex =
  keyof
  Pick<
    PartClass,
    "subTypeName" | "material" | "surface" | "unit" | "qty" | "price" | "totalPrice"
  >
type Tconfig = {
  [key in TkeyIndex]: {
    label: string
    style: {
      width: string
      textAlign?: "left" | "center" | "right"
      flex?: string
    }
  }
}

const keyIndex: TkeyIndex[] =
  ["subTypeName", "material", "surface", "unit", "qty", "price", "totalPrice"]

const config: Tconfig = {
  subTypeName: {
    label: "名稱",
    style: {
      width: "300px"
    },
  },
  material: {
    label: "材質",
    style: {
      width: "auto",
      flex: "1"
    },

  },
  surface: {
    label: "表面",
    style: {
      width: "auto",
      flex: "1"
    },

  },
  unit: {
    label: "單位",
    style: {
      width: "80px"
    },

  },
  qty: {
    label: "數量",
    style: {
      width: "100px",
      textAlign: "right",
    },

  },
  price: {
    label: "單價",
    style: {
      width: "120px",
      textAlign: "right",
    },

  },
  totalPrice: {
    label: "金額",
    style: {
      width: "150px",
      textAlign: "right",
    },

  },
}













