import { ChangeEvent, InputHTMLAttributes, useState } from "react"
import style from "./outboundOrder.module.scss"

// global gear
import Input03 from "components/global/gear/input/input03"

// data
import { dndCellConfigOutboundOrderOri, TdndCellConfigOutboundOrderKeys } from "config/dndCellConfig"
const dndCellConfigOutboundOrder = dndCellConfigOutboundOrderOri()



export default function OrderTable(
  { editable }:
    { editable: boolean }) {

  const [orderList, setOrderList] = useState(fakeOrderData)

  return (
    <div className={style.orderTable}>

      <div className={style.thead}>
        {/*  */}
        <div className={`${style.theadItem} ${style.indexCell}`} />
        {/*  */}

        {orderKeyIndex01.map((key, index) => {
          const { label, width, position } = dndCellConfigOutboundOrder[key]
          const theStyle = {
            width
          }
          const textCenter = position === "center" ? style.textCenter : ""
          return (
            <div className={`${style.theadItem} ${textCenter}`}
              key={index} style={theStyle}>
              <span>{label}</span>
            </div>
          )
        })}
        {/* 灰色柱子 */}
        <div className={` ${style.pilar}`}>
          <div />
        </div>
        {/*  */}
        {orderKeyIndex02.map((key, index) => {
          const { label, width, position } = dndCellConfigOutboundOrder[key]
          const theStyle = {
            width
          }
          const textCenter = position === "center" ? style.textCenter : ""
          return (
            <div className={`${style.theadItem} ${textCenter}`}
              key={index} style={theStyle}>
              <span>{label}</span>
            </div>
          )
        })}
      </div>

      <div className={style.tableList}>
        {orderList.map((item, groupIndex) => {
          const { project, list } = item

          return (
            <div key={groupIndex}>
              {list.map((row, rowIndex) => {
                const bgcSub = rowIndex !== 0 ? style.bgcSub : ""
                return (
                  <div className={`${style.row} ${bgcSub}`}
                    key={rowIndex}>
                    {/*  */}
                    {rowIndex === 0
                      ? <div className={`${style.column} ${style.indexCell}`}>
                        <span>{groupIndex + 1}</span>
                      </div>
                      : <div className={`${style.column} ${style.indexCell}`}>
                        <span></span>
                      </div>
                    }
                    {/*  */}
                    {orderKeyIndex01.map((key, columnIndex) => {
                      let { value } = row[key]
                      if (rowIndex !== 0 && columnIndex === 0) value = ""
                      const { width, position } = dndCellConfigOutboundOrder[key]
                      const theStyle = { width }
                      const textCenter = position === "center" ? style.textCenter : ""
                      return (
                        <div className={`${style.column} ${textCenter}`}
                          key={columnIndex} style={theStyle}
                        >
                          <span>{value}</span>
                        </div>
                      )
                    })}
                    {/* 沒有柱子的灰色柱子 */}
                    <div className={`${style.pilar}`} />
                    {/*  */}
                    {orderKeyIndex02.map((key, columnIndex) => {
                      let { value } = row[key]
                      if (rowIndex !== 0 && columnIndex === 0) value = ""
                      const { width, position } = dndCellConfigOutboundOrder[key]
                      const theStyle = { width }
                      const textCenter = position === "center" ? style.textCenter : ""

                      const onChange = (e: ChangeEvent<HTMLInputElement>) => {
                        const value = e.target.value
                        orderList[groupIndex]
                          .list[rowIndex][key]
                          .value = value
                        setOrderList([...orderList])
                      }

                      return (
                        <div className={`${style.column} ${textCenter}`}
                          key={columnIndex} style={theStyle}
                        >
                          <Input03
                            stateValue={value}
                            onChange={onChange}
                            className={style.input03}
                            disabled={!editable}
                          />
                        </div>
                      )
                    })}

                    {/*  */}
                    {/*  */}
                    {rowIndex !== 0 && <div className={style.ribbon}></div>}
                  </div> // row
                ) // return
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// =======================================================
const orderKeyIndex01: TdndCellConfigOutboundOrderKeys[] = [
  "project", "L", "W", "B", "qty",
  "implementQty", "cai", "totalCai", "doorType",
  "material", "horsepower", "surface",
]


const orderKeyIndex02: TdndCellConfigOutboundOrderKeys[] = [
  "remark01", "remark02", "remark03", "remark04",
  "appended", "orderCreatedDate", "finishAppended",
  "installer", "installDate",
]




const fakeOrderDataItemOri = () => ({
  project: {
    value: "SD2"
  },
  L: {
    value: "516"
  },
  W: {
    value: "230"
  },
  B: {
    value: "45"
  },
  qty: {
    value: "1"
  },
  implementQty: {
    value: "1"
  },
  cai: {
    value: "22181.49"
  },
  totalCai: {
    value: "22181.49"
  },
  doorType: {
    value: "SJ-302"
  },
  material: {
    value: "不鏽鋼304#"
  },
  horsepower: {
    value: "1/3HP"
  },
  surface: {
    value: "烤漆"
  },

  remark01: {
    value: ""
  },
  remark02: {
    value: ""
  },
  remark03: {
    value: ""
  },
  remark04: {
    value: ""
  },
  appended: {
    value: ""
  },
  orderCreatedDate: {
    value: ""
  },
  finishAppended: {
    value: ""
  },
  installer: {
    value: ""
  },
  installDate: {
    value: ""
  },
})
// const fakeOrderDataItem = {
//   project: {
//     value: "SD2"
//   },
//   L: {
//     value: "516"
//   },
//   W: {
//     value: "230"
//   },
//   B: {
//     value: "45"
//   },
//   qty: {
//     value: "1"
//   },
//   implementQty: {
//     value: "1"
//   },
//   cai: {
//     value: "22181.49"
//   },
//   totalCai: {
//     value: "22181.49"
//   },
//   doorType: {
//     value: "SJ-302"
//   },
//   material: {
//     value: "不鏽鋼304#"
//   },
//   horsepower: {
//     value: "1/3HP"
//   },
//   surface: {
//     value: "烤漆"
//   },

//   remark01: {
//     value: ""
//   },
//   remark02: {
//     value: ""
//   },
//   remark03: {
//     value: ""
//   },
//   remark04: {
//     value: ""
//   },
//   appended: {
//     value: ""
//   },
//   orderCreatedDate: {
//     value: ""
//   },
//   finishAppended: {
//     value: ""
//   },
//   installer: {
//     value: ""
//   },
//   installDate: {
//     value: ""
//   },
// }


const fakeOrderData = [
  {
    project: "SD2",
    list: [
      fakeOrderDataItemOri(), fakeOrderDataItemOri()
    ]
  },
  {
    project: "SD3",
    list: [
      fakeOrderDataItemOri(), fakeOrderDataItemOri(), fakeOrderDataItemOri()
    ]
  },
  {
    project: "SD4",
    list: [
      fakeOrderDataItemOri(), fakeOrderDataItemOri()
    ]
  },
  {
    project: "SD5",
    list: [
      fakeOrderDataItemOri()
    ]
  },
  {
    project: "SD5",
    list: [
      fakeOrderDataItemOri()
    ]
  },
]



