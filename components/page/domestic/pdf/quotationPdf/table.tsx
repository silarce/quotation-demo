
// css
import style from "./quotationPdf.module.scss"

// option
import { optionsCreator_doorRail } from "fakeDatabase/options/options"
const optionsDoorRail = optionsCreator_doorRail()

// type
// import {  ProdClass } from "components/page/domestic/quotation/hook/useProduct"





export type TtableProdList = {
  category: string
  size: string
  doorType: string
  material: string
  thickness: string
  surface: string
  doorRail: string
  horsepower: string
  openType: string
  qty: string
  unitPrice: string
  priceTotal: string
  memo: string
}[]





export default function Table(
  { productList }:
    { productList: TtableProdList }
) {

  return (
    <div className={style.table}>

      {indexKeys.map((key, index) => {
        const { label, width } = config[key]
        const theStyle = { width }
        return (
          <div className={style.theadCell} key={index} style={theStyle}>
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

      {productList.map((item, rIndex) => {
        const data = item
        return indexKeys.map((key, cIndex) => {
          let value = data[key]
          const { width, align } = config[key]
          const theStyle = { width }
          const subClass = " " + style[align ?? ""]

          if (key === "doorRail") {
            const imgSrc =
              (optionsDoorRail.find((item) => item.value === value))?.icon
            return (
              <div className={style.tbodyCell + subClass} key={cIndex} style={theStyle}>
                {/*  eslint-disable-next-line @next/next/no-img-element */}
                <img src={imgSrc} alt="" />
              </div>
            )
          }
          return (
            <div className={style.tbodyCell + subClass} key={cIndex} style={theStyle}>
              <span>{value}</span>
            </div>
          )
        })
      })}
      {/* 補空的row */}
      {/* {(() => {
        const leftoverRow = 12 - fakeDataArr.length
        const leftoverArr = Array(leftoverRow).fill("")
        return leftoverArr.map((row, rIndex) => {
          return indexKeys.map((key, cIndex) => {
            const { width } = config[key]
            const theStyle = { width }
            return (
              <div className={style.tbodyCell} key={cIndex} style={theStyle}>
                <span>　</span>
              </div>
            )
          })
        })
      })()} */}
    </div>
  )
}

// =============================================================================
/* 產品資料中有厚度的資料
但是不會出現在主產品設定中讓使用者編輯
*/
// =============================================================================

type TindexKeys =
  "category" | "size" | "doorType" | "material" | "thickness" |
  "surface" | "doorRail" | "horsepower" | "openType" | "qty" |
  "unitPrice" | "priceTotal" | "memo"

type Tconfig = {
  [key in TindexKeys]: {
    label: string
    width: string
    align?: "center" | "right"
  }
}

const indexKeys: TindexKeys[] = [
  "category", "size", "doorType", "material", "thickness",
  "surface", "doorRail", "horsepower", "openType", "qty",
  "unitPrice", "priceTotal", "memo"
]

const config: Tconfig = {
  category: {
    label: "項目",
    width: "130px",
  },
  size: {
    label: "尺寸(單位:cm)",
    width: "210px",
  },
  doorType: {
    label: "門型",
    width: "150px",
  },
  material: {
    label: "材料",
    width: "140px",
    align: "center",
  },
  thickness: {
    label: "厚度",
    width: "80px",
    align: "center",
  },
  surface: {
    label: "表面",
    width: "80px",
    align: "center",
  },
  doorRail: {
    label: "門軌",
    width: "70px",
    align: "center",
  },
  horsepower: {
    label: "馬力",
    width: "110px",
    align: "right",
  },
  openType: {
    label: "開閉方式",
    width: "80px",
    align: "center",
  },
  qty: {
    label: "數量",
    width: "70px",
    align: "right",
  },
  unitPrice: {
    label: "單價",
    width: "100%",
    align: "right",
  },
  priceTotal: {
    label: "複價",
    width: "100%",
    align: "right",
  },
  memo: {
    label: "備註",
    width: "80px",
    align: "center",
  },
}

// =============================================================================




