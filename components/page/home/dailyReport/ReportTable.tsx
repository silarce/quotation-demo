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
  { classDailyReportItemArr, addDailyReportItem,
    isSubordinate,
    reviewedAt,
    isEdit,
  }:
    {
      classDailyReportItemArr: Class_reportItem[]
      addDailyReportItem: () => void
      isSubordinate: boolean
      reviewedAt: boolean
      isEdit: boolean
    }
) {

  const readOlny = isEdit

  return (
    <div className={classNames(scss.table)}>
      {/*  */}
      <div className={classNames(scss.thead)}>
        {headerKeyArr.map(key => {
          const { label, width, flex } = config[key] ?? {}

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
                if (key === "periodOfDay") {
                  return (
                    <div key={key} style={{ width, flex }} className={scss.select}>
                      {!readOlny
                        ? <span>{value as string}</span>
                        : <InputSel
                          selectProps={{
                            options: optionArr_period,
                            value: theClass[key],
                            onChange: (v) => { theClass[key] = v!.value as "AM" | "PM" },
                            arrowType: "black",
                            fontSize: "16px",
                          }} />
                      }
                    </div>
                  )
                }


                // -----
                if (
                  key === "description" ||
                  key === "customerName" ||
                  key === "contactName" ||
                  key === "mealsCost"
                ) {
                  return (
                    <div key={key} style={{ width, flex }} className={scss.content}>
                      {!readOlny
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

        {readOlny &&
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
  "periodOfDay" | "customerName" | "contactName" | "description"
  | "mealsCost"
>

const headerKeyArr: (TclassKeys)[] = [
  "periodOfDay", "customerName", "contactName", "description", "mealsCost",
]
// const bodyKeyArr: TclassKeys[] = [
const bodyKeyArr: (TclassKeys)[] = [
  "periodOfDay", "customerName", "contactName", "description",
  "mealsCost",
]

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
  description: {
    label: "工作內容",
    width: "auto",
    flex: "auto",
  },
  mealsCost: {
    label: "餐費",
    width: "104px",
  },
}













