import classNames from "classnames"

// gear
import InputSel from "components/global/gear/inputAndSel/inputSel"
import MyButton from "components/global/gear/button/myButton"

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
          const { label, style, className } = config[key] ?? {}
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



const headerKeyArr = [
  "periodOfDay",
  "workingTime",
  "customerName",
  "contactName",
  "description",
  "workers",
  "DispatchOrderId",
  "mealsCost",

  "departureTime",
  "departureWorksiteTime",

  "licensePlate",
  "stayLength",

  "arrivalTime",

]


type Tconfig = {
  [key in string]: {
    eleType?: "input" | "select"
    label: string
    color?: "black" | "main"
    style?: React.CSSProperties
    className?: string
  }
}
const config: Tconfig = {
  periodOfDay: {
    eleType: "input",
    label: "上午/下午",
    className: classNames("w-[104px] row-span-6")
  },
  workingTime: {
    label: "工務時間",
    className: classNames("w-[170px] row-span-2 col-span-2"),
  },
  customerName: {
    eleType: "input",
    label: "客戶名稱",
    className: classNames("w-[120px] row-span-6", scss.textLeft),
  },
  contactName: {
    eleType: "input",
    label: "接洽人",
    className: classNames("w-[147px] row-span-6", scss.textLeft),
  },
  description: {
    eleType: "input",
    label: "工作內容",
    className: classNames("w-auto row-span-6", scss.textLeft),
  },
  workers: {
    eleType: "input",
    label: "工務人員",
    className: classNames("w-[140px] row-span-6", scss.textLeft),
  },
  DispatchOrderId: {
    eleType: "input",
    label: "派工單序號",
    className: classNames("w-[160px] row-span-3", scss.textLeft),
  },
  mealsCost: {
    eleType: "select",
    label: "餐費",
    className: classNames("w-[85px] row-span-3", scss.rightEdge),
  },
  departureTime: {
    eleType: "input",
    label: "出發",
    className: classNames("w-[85px] row-span-2"),
  },
  departureWorksiteTime: {
    eleType: "input",
    label: "離工地",
    className: classNames("w-[85px] row-span-4"),
  },
  arrivalTime: {
    eleType: "input",
    label: "目的地",
    className: classNames("w-[85px] row-span-2"),
  },
  licensePlate: {
    eleType: "input",
    label: "車牌",
    className: classNames("w-[160px] row-span-3", scss.textLeft),
  },
  stayLength: {
    eleType: "input",
    label: "住宿",
    className: classNames("w-[85px] row-span-3", scss.rightEdge),
  },
}





