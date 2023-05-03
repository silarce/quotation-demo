import { useState } from "react"


import Image from "next/image"
import classNames from "classnames"

// gear
import InputSel from "components/global/gear/inputAndSel/inputSel"
import Checkbox01 from "components/global/gear/checkbox/checkbox01"
import MyButton from "components/global/gear/button/myButton"

// icon
import iconCheck from "public/image/icon/check.svg"

// css
import scss from "./reportTable.module.scss"

// option
import { optionsCreator_dailyReportPeriod } from "fakeDatabase/options/options"
const optionArr_period = optionsCreator_dailyReportPeriod()

// class
import { Class_reportItem } from "pages/home/dailyReport"

// ==================================================
export default function ReportTable(
  { classDailyReportItemArr, addDailyReportItem, isSubordinate }:
    {
      classDailyReportItemArr: Class_reportItem[]
      addDailyReportItem: () => void
      isSubordinate: boolean
    }
) {

  // const [contentValue, setContentValue] = useState<string[]>([])


  return (
    <div className={classNames(scss.table)}>
      {/*  */}
      <div className={classNames(scss.thead)}>
        {headerKeyArr.map(key => {
          const { label, width, flex } = config[key] ?? {}
          if (key === "workingTypes") {
            return (
              <div key={key} className={classNames(scss.purposeColumn)} style={{ width }}>
                <div><span>{label}</span></div>
                <div>
                  {workingTypesKeyArr.map(key => {
                    const { label, width } = config[key] ?? {}
                    return (
                      <div key={key} className={classNames()} style={{ width }}>
                        <span>{label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          }
          // 
          return (
            <div key={key} className={classNames()} style={{ width, flex }}>
              <span>{label}</span>
            </div>
          )
        })}
      </div>
      {/*  */}

      <div className={classNames(scss.tbody)}>

        {classDailyReportItemArr.map((theClass, index) => {
          return (
            <div key={index} className={classNames(scss.row)}>
              {bodyKeyArr.map((key) => {
                const value = theClass[key]
                const { label, width, flex } = config[key] ?? {}
                // -----
                // if (key === "periodOfDay") {
                if (key === "periodOfDay") {
                  return (
                    <div key={key} style={{ width }}>
                      {!isSubordinate
                        ? <span>{value as string}</span>
                        : <InputSel
                          selectProps={{
                            options: optionArr_period,
                            value: theClass[key],
                            onChange: (v) => { theClass[key] = v!.value as "AM" | "PM" },
                            arrowType: "black",
                          }} />
                      }
                    </div>
                  )
                }
                // -----

                if (
                  key === "install" ||
                  key === "powerDelivery" ||
                  key === "repair" ||
                  key === "maintenance" ||
                  key === "inspection"
                ) {
                  return (
                    <div key={key} className={scss.check}
                      style={{ width }}>
                      {(() => {
                        if (isSubordinate) {
                          return <Checkbox01
                            stateValue={theClass[key]}
                            onClick={() => { theClass[key] = !theClass[key] }} />
                        }
                        else if (value) {
                          return <Image src={iconCheck} alt="check" />
                        }
                        else return null
                      })()}
                    </div>
                  )
                }

                // -----
                // if (key === "description") {
                if (
                  key === "description" ||
                  key === "customerName" ||
                  key === "contactName"
                ) {
                  return (
                    <div key={key} style={{ width, }} className={scss.content}>
                      {!isSubordinate
                        ? <span>{value as string}</span>
                        : <InputSel
                          textareaProps={{
                            value: theClass[key] ?? "",
                            onChange: (v) => { theClass[key] = v },
                            className: scss.textarea
                          }} />
                      }
                    </div>
                  )
                }
                // -----
                return null
              })}
            </div>
          )
        })}

        {isSubordinate &&
          <MyButton
            label="新增回報"
            preImg="add"
            className={scss.newReportBtn}
            onClick={addDailyReportItem}
          />
        }
        <div>
        </div>

      </div>

    </div>
  )
}
// =================================================================

// type TclassKeys = keyof Class_dailyReportItem
type TclassKeys = Extract<keyof Class_reportItem,
  "periodOfDay" | "customerName" | "contactName" |
  "install" | "powerDelivery" | "repair" | "maintenance" | "inspection" |
  "description" | "workingTypes"
>

const headerKeyArr: (TclassKeys)[] = [
  "periodOfDay", "customerName", "contactName", "workingTypes", "description",
]
// const bodyKeyArr: TclassKeys[] = [
const bodyKeyArr: (TclassKeys)[] = [
  "periodOfDay", "customerName", "contactName",
  "install", "powerDelivery", "repair", "maintenance", "inspection",
  "description",
]
const workingTypesKeyArr = [
  "install", "powerDelivery", "repair", "maintenance", "inspection",
] as const

type Tconfig = {
  [key in (TclassKeys)]?: {
    label: string
    width?: React.CSSProperties["width"]
    color?: "black" | "main"
    flex?: "auto"
  }
}

const config: Tconfig = {
  periodOfDay: {
    label: "上午/下午",
    width: "104px",
  },
  customerName: {
    label: "客戶名稱",
    width: "163px",
  },
  contactName: {
    label: "接洽人",
    width: "147px",
  },
  workingTypes: {
    label: "工作項目",
    width: "auto",
    // position: "center",
    color: "main"
  },


  install: {
    label: "安裝",
    width: "50px",
  },
  powerDelivery: {
    label: "送電",
    width: "50px",
  },
  repair: {
    label: "維修",
    width: "50px",
  },
  maintenance: {
    label: "保養",
    width: "50px",
  },
  inspection: {
    label: "現勘",
    width: "50px",
  },


  description: {
    label: "工作內容",
    width: "auto",
    flex: "auto"
  },
}













