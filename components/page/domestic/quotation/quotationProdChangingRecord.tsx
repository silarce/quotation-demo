import { useState } from "react"

// antd
import { Collapse } from 'antd';

// glogal gear
import CellWithBar from "components/global/gear/cell/cellWithBar";
import Checkbox01 from "components/global/gear/checkbox/checkbox01"
// css
import style from "components/page/domestic/quotation/quotationProdChangingRecord.module.scss"

// type
import type { TchangeRecord, TchangeListItem } from "fakeDatabase/domestic/quotation/fakeChangeProductRecord"

// config
import { prodCellConfigOri } from "./hook/useProduct";
const prodCellConfig = prodCellConfigOri()

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
            if (typeof value === "string") value = parseFloat(value)
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

  const { keyList, cellConfig } = prodCellConfig

  return (
    <div>

      <div className={style.panelBodyHeader}>
        <span></span>
        <span></span>
        {keyList.map((key, index) => {
          const { label, width } = cellConfig[key]
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

        return (
          <div key={index} className={style.panelBodyBody}>
            <span className={`${style.action} ${classAction}`}></span>
            <span>{index + 1}</span>
            {keyList.map((key, index) => {
              const { width, type } = cellConfig[key]
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





