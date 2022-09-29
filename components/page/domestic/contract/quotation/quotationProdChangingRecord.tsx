import { useState } from "react"

// antd
import { Collapse } from 'antd';

// glogal gear
import CellWithBar from "components/global/gear/cell/cellWithBar";
import Checkbox01 from "components/global/gear/checkbox/checkbox01"
// css
import style from "components/page/domestic/contract/quotation/quotationProdChangingRecord.module.scss"

// type
import type { TchangeRecord, TchangeListItem } from "fakeDatabase/domestic/quotation/fakeChangeProductRecord"


const { Panel } = Collapse

export default function QuotationProdChangingRecord({ prodChangingRecord }:
  { prodChangingRecord: TchangeRecord | undefined }) {

  if (!prodChangingRecord) return null

  return <TheQuotationProdChangingRecord prodChangingRecord={prodChangingRecord} />
}
// =====================================================
export function TheQuotationProdChangingRecord({ prodChangingRecord }:
  { prodChangingRecord: TchangeRecord }) {

  const { list, quotationId } = prodChangingRecord
  const quotationIdKeyList = Object.keys(list)

  // 點擊變粉紅色用
  const [activeIndex, setActiveIndex] = useState(-1)
  const changeActive = (panelIndex: string | string[]) => {
    const activeIndex = parseInt(panelIndex as string)
    setActiveIndex(activeIndex)
  }

  return (
    <div className={style.container}>
      <div className={`${style.row} ${style.outHeader}`}>
        {theadIndex.map((item, index) => {
          const { label } = theadConfigList[item]
          return (
            <div className={style.column} key={index}>
              <span>{label}</span>
            </div>
          )
        })}
      </div>
      <Collapse
        expandIcon={() => <></>}
        accordion={true}
        destroyInactivePanel={true}
        className={style.collapse}
        onChange={changeActive}
      >
        {quotationIdKeyList.map((key, index) => {
          const record = list[key]
          const isActive = activeIndex === index
          return (
            <Panel key={index}
              header={<PanelHeader record={record} isActive={isActive} />}
            >
              <CollapseBody record={record} />
            </Panel>
          )
        })}
      </Collapse>
    </div>
  )
}

// =======================================================
// =======================================================
// =======================================================

const PanelHeader = ({ record, isActive }:
  {
    record: TchangeListItem
    isActive: boolean
  }) => {
  return (
    <CellWithBar isActive={isActive}>
      <div className={style.panelHeader}>
        {theadIndex.map((key, index) => {
          let value = record[key]
          if (key === "priceChange") {
            // -value是為了把負號拿掉
            value = value < 0 ? `-$${-value}` : `+$${value}`
          }
          return (
            <div className={style.column} key={index}>
              <span>{value}</span>
            </div>
          )
        })}
      </div>
    </CellWithBar>
  )
}
// =======================================================
const CollapseBody = ({ record }:
  { record: TchangeListItem }) => {
  const { product } = record
  return (
    <div>
      <div className={style.panelBodyHeader}>
        <span></span>
        <span></span>
        {collapseBodyIndex.map((item, index) => {
          const { label, width } = detailTheadConfigList[item]
          const theStyle = { width }
          return (
            <div className={style.column} key={index} style={theStyle} >
              <span>{label}</span>
            </div>
          )
        })}
      </div>
      {/*  */}
      {product.map((item, index) => {
        const { action } = item
        const classAction = action === "add" ? style.add
          : action === "remove" ? style.remove : ""

        // console.log(item)



        return (
          <div key={index} className={style.panelBodyBody}>
            <span className={`${style.action} ${classAction}`}></span>
            <span>{index + 1}</span>
            {collapseBodyIndex.map((key, index) => {
              const { width, type } = detailTheadConfigList[key]
              const value = item[key]
              const theStyle = { width }

              if (type === "checkbox")
                return (
                  <div className={`${style.column} text-center`} key={index} style={theStyle}>
                    <Checkbox01
                      stateValue={value as boolean}
                      cursor="auto"
                    />
                  </div>
                )

              if (type === "selectWithIcon") {
                const { label, icon } =
                  value as {
                    label: string
                    icon: string
                  }
                return (
                  <div className={style.column} key={index} style={theStyle}>
                    {/*  eslint-disable-next-line @next/next/no-img-element */}
                    <img src={icon} alt="" />
                    <span>
                      {label}
                    </span>
                  </div>
                )
              }

              return (
                <div className={style.column} key={index} style={theStyle}>
                  <span>
                    {value as string}
                  </span>
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}



// =======================================================
// =======================================================
// =======================================================

interface TtheadConfig {
  label: string,
}

interface TtheadConfigList {
  "id": TtheadConfig
  "date": TtheadConfig
  "priceChange": TtheadConfig
  "remark": TtheadConfig
}

type TtheadIndex = (keyof TtheadConfigList)[]

const theadIndex: TtheadIndex = [
  "id",
  "date",
  "priceChange",
  "remark",
]

const theadConfigList: TtheadConfigList = {
  "id": {
    label: "編號",
    // width: "110px",
  },
  "date": {
    label: "日期",
    // width: "88px",
  },
  "priceChange": {
    label: "追加追減價格",
    // width: "105px",
  },
  "remark": {
    label: "備註",
    // width: "auto",
  },
}
// =======================================================
interface TdetailTheadConfig {
  label: string
  width: string
  type?: string
}

interface TdetailTheadConfigList {
  "discount": TdetailTheadConfig
  "project": TdetailTheadConfig
  "quoteType": TdetailTheadConfig
  "L": TdetailTheadConfig
  "W": TdetailTheadConfig
  "H": TdetailTheadConfig
  "B": TdetailTheadConfig
  "area": TdetailTheadConfig
  "cai": TdetailTheadConfig
  "doorType": TdetailTheadConfig
  "material": TdetailTheadConfig
  "surface": TdetailTheadConfig
  "horsepower": TdetailTheadConfig
  "qty": TdetailTheadConfig
  "unitPrice": TdetailTheadConfig
  "subTotal": TdetailTheadConfig
  "memo": TdetailTheadConfig
  "doorRail": TdetailTheadConfig
  "ejectionDoor": TdetailTheadConfig
}

type TdetailTheadIndex = (keyof TdetailTheadConfigList)[]

const collapseBodyIndex: TdetailTheadIndex = [
  "discount",
  "project",
  "quoteType",
  "L",
  "W",
  "H",
  "B",
  "area",
  "cai",
  "doorType",
  "material",
  "surface",
  "doorRail",
  "horsepower",
  "qty",
  "unitPrice",
  "subTotal",
  "memo",
  "ejectionDoor",
]

const detailTheadConfigList: TdetailTheadConfigList = {
  "discount": { label: "折數", width: "75px" },
  "project": { label: "項目", width: "60px" },
  "quoteType": { label: "報價別", width: "105px" },
  "L": { label: "L", width: "60px" },
  "W": { label: "W", width: "60px" },
  "H": { label: "H", width: "60px" },
  "B": { label: "B", width: "60px" },
  "area": { label: "面積", width: "60px" },
  "cai": { label: "才數", width: "75px" },
  "doorType": { label: "門型", width: "75px" },
  "material": { label: "材料", width: "120px" },
  "surface": { label: "表面", width: "55px" },
  "horsepower": { label: "馬力", width: "60px" },
  "qty": { label: "數量", width: "43px" },
  "unitPrice": { label: "單價", width: "84px" },
  "subTotal": { label: "複價", width: "84px" },
  "memo": { label: "備註", width: "90px" },
  "doorRail": { label: "門軌", width: "70px", type: "selectWithIcon" },
  "ejectionDoor": { label: "彈射門", width: "60px", type: "checkbox" },
}




