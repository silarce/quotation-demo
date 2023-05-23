import classNames from "classnames"

// gear
import InputSel from "components/global/gear/inputAndSel/inputSel"
import MyButton from "components/global/gear/button/myButton"

// css
import scss from "./reportTable.module.scss"
// option
import {
  Toption,
  optionsCreator_dailyReportPeriod, optionsCreator_mealsCost,
} from "fakeDatabase/options/options"

const optionArr_period = optionsCreator_dailyReportPeriod()
const optionArr_mealsCost = optionsCreator_mealsCost()

// class
import { Class_reportItem } from "pages/home/dailyReport"


// ==================================================
export default function ReportTable(
  { classDailyReportItemArr, addDailyReportItem,
    isEdit,
  }:
    {
      classDailyReportItemArr: Class_reportItem[]
      addDailyReportItem: () => void
      isEdit: boolean
    }
) {

  const readOlny = isEdit

  return (
    <div className={classNames(scss.table)}>
      {/*  */}
      <div className={classNames(scss.thead)}>

        {headerKeyArr.map((key, index) => {
          const { label, style, headerClassName: className } = config[key] ?? {}
          // 
          return (
            <div key={key} style={style}
              className={classNames(scss.cell, className)} >
              <span>{label}</span>
            </div>
          )
          // 
        })}
      </div>
      {/*  */}

      <div className={classNames(scss.tbody)}>

        {classDailyReportItemArr.map((theClass, rIndex) => {
          return (
            <div key={rIndex} className={classNames(scss.row)}>

              {bodyKeyArr.map((key, cIndex) => {
                const {
                  eleType, optionArr, label,
                  headerClassName, bodyClassName,
                } = config[key] ?? {}

                if (eleType === "select") {
                  return (
                    <div key={cIndex}
                      className={classNames(scss.cell, headerClassName, bodyClassName)}>
                      <InputSel
                        selectProps={{
                          options: optionArr ?? [],
                          value: theClass[key] as string,
                          // @ts-ignore
                          onChange: (v) => { theClass[key] = v!.value },
                          arrowType: "black",
                          fontSize: "16px",
                        }} />
                    </div>
                  )
                }
                if (eleType === "input") {
                  return (
                    <div key={cIndex}
                      className={classNames(
                        scss.cell,
                        headerClassName, bodyClassName)}>
                      <InputSel
                        inputProps={{
                          value: theClass[key] as string,
                          // @ts-ignore
                          onChange: (v) => { theClass[key] = v },
                          className: scss.textarea,
                          inputType: "number",
                        }} />
                    </div>
                  )
                }

                return (
                  <div key={cIndex}
                    className={classNames(scss.cell, headerClassName, bodyClassName)}>
                    {cIndex}
                  </div>
                )
              })}
            </div>
          )

        })}

      </div>



      {/* <div className={classNames(scss.tbody)}>

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
                  key === "contactName"
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
                if (
                  key === "mealsCost"
                ) {
                  return (
                    <div key={key} style={{ width, flex }} className={scss.content}>
                      {!readOlny
                        ? <span>{value as string}</span>
                        : <InputSel
                          inputProps={{
                            value: theClass[key] ?? "",
                            onChange: (v) => { theClass[key] = v },
                            className: scss.textarea,
                            inputType: "number"
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
      </div> */}
    </div>
  )
}
// =================================================================

// // type TclassKeys = keyof Class_dailyReportItem
// type TclassKeys = Extract<keyof Class_reportItem,
//   "periodOfDay" | "customerName" | "contactName" | "description" |
//   "mealsCost" |
//   "departureTime" | "arrivalTime" | "departureWorksiteTime" |
//   "licensePlate" | "stayLength" | "workers">

// const headerKeyArr: (TclassKeys)[] = [
//   "periodOfDay", "customerName", "contactName", "description", "mealsCost",
// ]
// // const bodyKeyArr: TclassKeys[] = [
// const bodyKeyArr: (TclassKeys)[] = [
//   "periodOfDay", "customerName", "contactName", "description",
//   "mealsCost",
// ]

type TclassKeys = keyof Class_reportItem

// type TheaderKey = 

const headerKeyArr: (TclassKeys | "workingTime")[] = [
  "periodOfDay",
  "workingTime",
  "customerName",
  "contactName",
  "description",
  "workers",
  "dispatchOrderId",
  "mealsCost",

  "departureTime",
  "departureWorksiteTime",
  "licensePlate",
  "stayLength",
  "arrivalTime",
]

const bodyKeyArr: TclassKeys[] = [
  "periodOfDay",
  "departureTime",
  "departureWorksiteTime",
  "customerName",
  "contactName",
  "description",
  "workers",
  "dispatchOrderId",
  "mealsCost",
  "arrivalTime",
  "licensePlate",
  "stayLength",
]

type Tconfig = {
  [key in (TclassKeys | "workingTime")]?:
  {
    label: string
    color?: "black" | "main"
    style?: React.CSSProperties
    headerClassName: string
    bodyClassName: string
    optionArr?: Toption[]
  } & (
    { eleType?: "input" } |
    {
      eleType?: "select"
      optionArr: Toption[]
    }
  )
}




const config: Tconfig = {
  periodOfDay: {
    eleType: "select",
    optionArr: optionArr_period,
    label: "上午/下午",
    headerClassName: classNames("w-[104px] row-span-6"),
    bodyClassName: classNames("row-span-2"),
  },
  workingTime: {
    label: "工務時間",
    headerClassName: classNames("w-[170px] row-span-2 col-span-2"),
    bodyClassName: classNames(),
  },
  customerName: {
    eleType: "input",
    label: "客戶名稱",
    headerClassName: classNames("w-[120px] row-span-6", scss.textLeft),
    bodyClassName: classNames("row-span-2"),
  },
  contactName: {
    eleType: "input",
    label: "接洽人",
    headerClassName: classNames("w-[147px] row-span-6", scss.textLeft),
    bodyClassName: classNames("row-span-2"),
  },
  description: {
    eleType: "input",
    label: "工作內容",
    headerClassName: classNames("w-auto row-span-6", scss.textLeft),
    bodyClassName: classNames("row-span-2"),
  },
  workers: {
    eleType: "input",
    label: "工務人員",
    headerClassName: classNames("w-[140px] row-span-6", scss.textLeft),
    bodyClassName: classNames("row-span-2"),
  },
  dispatchOrderId: {
    eleType: "input",
    label: "派工單序號",
    headerClassName: classNames("w-[160px] row-span-3", scss.textLeft),
    bodyClassName: classNames("row-span-1"),
  },
  mealsCost: {
    eleType: "select",
    optionArr: optionArr_mealsCost,
    label: "餐費",
    headerClassName: classNames("w-[85px] row-span-3", scss.rightEdge),
    bodyClassName: classNames("row-span-1"),
  },
  departureTime: {
    eleType: "input",
    label: "出發",
    headerClassName: classNames("w-[85px] row-span-2"),
    bodyClassName: classNames("row-span-1"),
  },
  departureWorksiteTime: {
    eleType: "input",
    label: "離工地",
    headerClassName: classNames("w-[85px] row-span-4"),
    bodyClassName: classNames("row-span-2"),
  },
  arrivalTime: {
    eleType: "input",
    label: "目的地",
    headerClassName: classNames("w-[85px] row-span-2"),
    bodyClassName: classNames("row-span-1"),
  },
  licensePlate: {
    eleType: "input",
    label: "車牌",
    headerClassName: classNames("w-[160px] row-span-3", scss.textLeft),
    bodyClassName: classNames("row-span-1"),
  },
  stayLength: {
    eleType: "input",
    label: "住宿",
    headerClassName: classNames("w-[85px] row-span-3", scss.rightEdge),
    bodyClassName: classNames("row-span-1"),
  },
}





