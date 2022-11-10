
// css
import style from "./quotationPdf.module.scss"

// option
import { optionsCreator_doorRail } from "fakeDatabase/options/options"
const optionsDoorRail = optionsCreator_doorRail()



export default function Table() {



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

      {fakeDataArr.map((row, rIndex) => {
        return indexKeys.map((key, cIndex) => {
          const value = row[key]
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
      {(() => {
        const leftoverRow = 12 - fakeDataArr.length
        const leftoverArr = Array(leftoverRow).fill("")
        return leftoverArr.map((row, rIndex) => {
          return indexKeys.map((key, cIndex) => {
            const { width } = config[key]
            const theStyle = { width }
            return (
              <div className={style.tbodyCell} key={cIndex} style={theStyle}>
                {/* 全形空格，這樣就不用設min-height了 */}
                <span>　</span>
              </div>
            )
          })
        })
      })()}
    </div>
  )
}

// =============================================================================
/* 產品資料中有厚度的資料
但是不會出現在主產品設定中讓使用者編輯
*/
// =============================================================================

type TindexKeys =
  "project" | "size" | "doorType" | "material" | "thickness" |
  "surface" | "doorRail" | "horsepower" | "openType" | "qty" |
  "unitPrice" | "subTotal" | "memo"

type Tconfig = {
  [key in TindexKeys]: {
    label: string
    width: string
    align?: "center" | "right"
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
    width: "90px",
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
    width: "80px",
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
    width: "80px",
    align: "right",
  },
  unitPrice: {
    label: "單價",
    width: "100%",
    align: "right",
  },
  subTotal: {
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



const fakeDataArr = [
  {
    project: "SD1",
    size: "720 x 330 + 77",
    doorType: "SJ-303A",
    material: "鍍鋅",
    thickness: "1.50t",
    surface: "烤漆",
    doorRail: "75",
    horsepower: "1/4 HP",
    openType: "電動",
    qty: "2樘",
    unitPrice: "635,242",
    subTotal: "1,270,484",
    memo: "一般",
  },
  {
    project: "SD2",
    size: "720 x 330 + 77",
    doorType: "SJ-303A",
    material: "SST",
    thickness: "1.50t",
    surface: "304#",
    doorRail: "98",
    horsepower: "1 1/2 HP",
    openType: "電動",
    qty: "2樘",
    unitPrice: "635,242",
    subTotal: "1,270,484",
    memo: "一般",
  },
  {
    project: "SD1(備用)",
    size: "720 x 330 + 77",
    doorType: "SJ-303A",
    material: "鍍鋅",
    thickness: "1.50t",
    surface: "304#",
    doorRail: "30",
    horsepower: "1/4 HP",
    openType: "電動",
    qty: "2樘",
    unitPrice: "635,242",
    subTotal: "1,270,484",
    memo: "一般",
  },
  {
    project: "SD2(備用)",
    size: "720 x 330 + 77",
    doorType: "SJ-303A",
    material: "鍍鋅",
    thickness: "1.50t",
    surface: "304#",
    doorRail: "75",
    horsepower: "5 HP",
    openType: "電動",
    qty: "2樘",
    unitPrice: "635,242",
    subTotal: "1,270,484",
    memo: "一般",
  },
]













