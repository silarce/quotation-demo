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


// ==================================================
export default function ReportTable(
  { reportDetailArr, isSubordinate }:
    {
      reportDetailArr: TreportDetail[]
      isSubordinate: boolean
    }
) {

  const [contentValue, setContentValue] = useState<string[]>([])


  return (
    <div className={classNames(scss.table)}>
      {/*  */}
      <div className={classNames(scss.thead)}>
        {keyArr.map(key => {
          const { label, width, flex } = config[key]
          if (key === "purpose") {
            return (
              <div key={key} className={classNames(scss.purposeColumn)} style={{ width }}>
                <div><span>{label}</span></div>
                <div>
                  {purposeKeyArr.map(key => {
                    const { label, width } = config[key]
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

        {reportDetailArr.map((data, index) => {
          return (
            <div key={index} className={classNames(scss.row)}>
              {keyArr.map((key) => {
                const value = data[key]
                const { label, width, flex } = config[key]
                // -----
                if (key === "period") {
                  return (
                    <div key={key} style={{ width }}>
                      {!isSubordinate
                        ? <span>{value as string}</span>
                        : <InputSel
                          selectProps={{
                            options: optionArr_period,
                            value: "",
                            onChange: () => { },
                            arrowType: "black",
                          }} />
                      }
                    </div>
                  )
                }
                // -----
                if (key === "purpose") {
                  const purposeValue = data[key]
                  return purposeKeyArr.map((purposeKey) => {
                    const value = purposeValue[purposeKey]

                    const { width } = config[purposeKey]
                    return (
                      <div key={purposeKey} className={scss.check}
                        style={{ width }}>
                        {(() => {
                          if (isSubordinate) {
                            return <Checkbox01
                              stateValue={value}
                              onClick={() => { }} />
                          }
                          else if (value) {
                            return <Image src={iconCheck} alt="check" />
                          }
                          else return null
                        })()}
                      </div>
                    )
                  })
                }
                // -----
                if (key === "content") {

                  const onChange = (v: string) => {
                    setContentValue(arr => {
                      arr[index] = v
                      return [...arr]
                    })
                  }

                  return (
                    <div key={key} style={{ width, }} className={scss.content}>
                      {!isSubordinate
                        ? <span>{value as string}</span>
                        : <InputSel
                          textareaProps={{
                            value: contentValue[index] ?? "",
                            onChange: onChange,
                            className: scss.textarea
                          }} />
                      }
                    </div>
                  )
                }

                // -----
                return (
                  <div key={key} style={{ width }}>
                    {!isSubordinate
                      ? <span>{value as string}</span>
                      : <InputSel
                        inputProps={{
                          value: "",
                          onChange: () => { }
                        }} />
                    }
                  </div>
                )
              })}
            </div>
          )
        })}

        {isSubordinate &&
          <MyButton
            label="新增回報"
            preImg="add"
            className={scss.newReportBtn}
          />
        }
        <div>
        </div>

      </div>

    </div>
  )
}
// =================================================================

type TreportDetail = {
  period: string
  customerName: string
  contactPerson: string
  purpose: {
    openUp: boolean // 開拓
    valuation: boolean // 估價
    contract: boolean // 訂約
    collectMoney: boolean // 收款
    serve: boolean // 服務
  }
  content: string
}

type Tkeys = keyof TreportDetail
type TpurposeKeys = keyof TreportDetail["purpose"]

type Tconfig = {
  [key in (Tkeys | TpurposeKeys)]: {
    label: string
    width: React.CSSProperties["width"]
    // position?: "left" | "center"
    color?: "black" | "main"
    flex?: "auto"
  }
}


const keyArr: Tkeys[] = [
  "period", "customerName", "contactPerson", "purpose", "content",
]
const purposeKeyArr: TpurposeKeys[] = [
  "openUp", "valuation", "contract", "collectMoney", "serve",
]


const config: Tconfig = {
  period: {
    label: "上午/下午",
    width: "104px",
  },
  customerName: {
    label: "客戶名稱",
    width: "163px",
  },
  contactPerson: {
    label: "接洽人",
    width: "147px",
  },
  purpose: {
    label: "工作項目",
    width: "auto",
    // position: "center",
    color: "main"
  },
  openUp: {
    label: "開拓",
    width: "50px",
  },
  valuation: {
    label: "估價",
    width: "50px",
  },
  contract: {
    label: "訂約",
    width: "50px",
  },
  collectMoney: {
    label: "收款",
    width: "50px",
  },
  serve: {
    label: "服務",
    width: "50px",
  },

  content: {
    label: "工作內容",
    width: "auto",
    flex: "auto"
  },

}

