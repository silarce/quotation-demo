

// css
import style from "./quotationMaterial.module.scss"
import styleL from "./local.module.scss"









export default function QuotationMaterial() {

  return (
    <>
      <div className={styleL.header}>
        <h2>材料/配件設定</h2>
      </div>
      {/*  */}
      <div className={styleL.thead}>
        {theadIndex.map((item, index) => {
          const { label, width } = theadInfo[item]
          const theStyle = { width }
          return (
            <div className={styleL.theadCell} key={index} style={theStyle}>
              <span>{label}</span>
            </div>
          )
        })}
      </div>
      {/*  */}
      <div>
        {/* {fakeData.map((row, pIndex) => {
          return (
            theadIndex.map((theadIndex, cIndex) => {
              const { width } = theadInfo[theadIndex]
              const value = row[theadIndex]

              const theStyle = { width }
              return (
                <div key={cIndex} style={theStyle}>
                  <span>{value}</span>
                </div>
              )
            })
          )
        })} */}
      </div>

    </>
  )
}


// ================================================

interface TtheadInfo {
  id01: { label: string, width: string } // 代號
  typeName: { label: string, width: string } // 種類名稱
  id02: { label: string, width: string } // 代號
  material: { label: string, width: string } // 材料
  surface: { label: string, width: string } // 表面
  basicWeight: { label: string, width: string } // 重量基重
  unit: { label: string, width: string } // 單位
  qty: { label: string, width: string } // 數量
  listPrice: { label: string, width: string } // 牌價
  totalListPrice: { label: string, width: string } // 牌價複價
  price: { label: string, width: string } // 單價
  totalPrice: { label: string, width: string } // 複價
}

interface Tdata {
  id01: string
  typeName: string
  id02?: string
  material?: string
  surface?: string
  basicWeight?: string
  unit?: string
  qty: string
  listPrice: string
  totalListPrice: string
  price: string
  totalPrice: string
}

const theadIndex: (keyof TtheadInfo)[] = [
  "id01", "typeName", "id02", "material",
  "surface", "basicWeight", "unit", "qty",
  "listPrice", "totalListPrice", "price", "totalPrice",
]


const theadInfo: TtheadInfo = {
  id01: { label: "代號", width: "45px" },
  typeName: { label: "種類名稱", width: "136px" },
  id02: { label: "代號", width: "116px" },
  material: { label: "材料", width: "120px" },
  surface: { label: "表面", width: "45px" },
  basicWeight: { label: "重量基重", width: "70px" },
  unit: { label: "單位", width: "38px" },
  qty: { label: "數量", width: "60px" },
  listPrice: { label: "牌價", width: "82px" },
  totalListPrice: { label: "牌價複價", width: "84px" },
  price: { label: "單價", width: "82px" },
  totalPrice: { label: "複價", width: "84px" },
}

const fakeData: Tdata[] = [
  {
    id01: "SJ0A",
    typeName: "門片",
    id02: "SJ3020A0088",
    material: "不鏽鋼304#",
    surface: "BA",
    basicWeight: "22.00",
    unit: "M2",
    qty: "14.19",
    listPrice: "6171",
    totalListPrice: "87556.49",
    price: "6171",
    totalPrice: "87566",
  },
  {
    id01: "SJ0A",
    typeName: "們軌",
    id02: "SJ3020A0088",
    material: "不鏽鋼316#",
    // surface: "BA",
    // basicWeight: "22.00",
    // unit: "M2",
    qty: "1",
    listPrice: "11286",
    totalListPrice: "11286",
    price: "11286",
    totalPrice: "11286",
  },
]

