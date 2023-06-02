import { useState } from "react"

import classNames from "classnames"

// gear
import InputSel from "components/global/gear/inputAndSel/inputSel"
import MyButton from "components/global/gear/button/myButton"
import WorkerSelector from "components/global/gear/modal/workerSelector"
import { showRootLoading } from "components/global/gear/loadingCover/rootLoadingCover"
import MealSelector from "./MealSelector"

// css
import scss from "./reportTable.module.scss"
// option
import {
  Toption,
  optionsCreator_dailyReportPeriod, optionsCreator_mealsCost,
} from "js/utils/options/options"

// class
import { Class_reportItem } from "pages/home/dailyReport"
import { TdailyReportItemDto, TdailyReportWokerDto } from "js/api/dtoTypes"

// icon
import { IconAddCircle, IconRemoveCircle } from "public/image/icon/svgComponent/svgIcons"

// ==================================================
const optionArr_period = optionsCreator_dailyReportPeriod()
const optionArr_mealsCost = optionsCreator_mealsCost()

// ==================================================
export default function ReportTable(
  { classDailyReportItemArr,
    addDailyReportItem,
    isEdit,
  }:
    {
      classDailyReportItemArr: Class_reportItem[]
      addDailyReportItem: () => void
      isEdit: boolean
    }
) {

  const [showModal_worker, setShowModal_worker] = useState(false)
  const [showModal_meals, setShowModal_meals] = useState(false)

  const [activeItem, setActiveItem] = useState<Class_reportItem>()


  const toShowModal_worker = async () => {
    setShowModal_worker(true)
  }
  const modalOnCancel_worker = () => {
    setShowModal_worker(false)
  }

  const toShowModal_meals = async () => {
    setShowModal_meals(true)
  }
  const modalOnCancel_meals = () => {
    setShowModal_meals(false)
  }

  const modalOnConfirm_worker = (workerArr: TdailyReportWokerDto[]) => {
    if (!activeItem) return
    activeItem.addWorker(workerArr[0])
  }

  const modalOnConfirm_meals = (v: TdailyReportItemDto["meals"][number] | undefined) => {
    if (!activeItem || !v) return
    activeItem.addMeals(v)
  }

  const disabled = !isEdit

  // ------------------------------------------------
  return (
    <div className={classNames(scss.table)}>
      <div className={scss.roof} />
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
                  eleType, optionArr, label, inputType, placeholder,
                  headerClassName, bodyClassName, suffix,
                } = config[key] ?? {}

                if (eleType === "select") {
                  return (
                    <div key={cIndex}
                      className={classNames(scss.cell, headerClassName, bodyClassName)}>
                      <InputSel
                        disabled={disabled}
                        showBaseline="auto"
                        placeholder={placeholder}
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
                        className="inline-grid"
                        disabled={disabled}
                        showBaseline="auto"
                        placeholder={placeholder}
                        inputProps={{
                          value: theClass[key] as string,
                          inputType,
                          // @ts-ignore
                          onChange: (v) => { theClass[key] = v },
                          className: scss.textarea,
                        }} />
                      {suffix && disabled && <span>{suffix}</span>}
                    </div>
                  )
                }
                if (eleType === "textarea") {
                  return (
                    <div key={cIndex}
                      className={classNames(
                        scss.cell,
                        headerClassName, bodyClassName)}>
                      <InputSel
                        disabled={disabled}
                        showBaseline="auto"
                        placeholder={placeholder}
                        textareaProps={{
                          value: theClass[key] as string,
                          // @ts-ignore
                          onChange: (v) => { theClass[key] = v },
                          className: scss.textarea,
                        }} />
                    </div>
                  )
                }
                if (eleType === "timePicker") {
                  return (
                    <div key={cIndex}
                      className={classNames(
                        scss.cell,
                        headerClassName, bodyClassName)}>
                      <InputSel
                        disabled={disabled}
                        showBaseline="auto"
                        placeholder={placeholder}
                        timePickerProps={{
                          value: theClass[key] as string,
                          onChange02: (v) => {
                            const foo = v?.toISOString()
                            // @ts-ignore
                            theClass[key] = foo
                          },
                        }} />
                    </div>
                  )
                }

                if (eleType === "modal" && key === "workers") {
                  const workersArr = theClass["workers"]
                  const onAdd = () => {
                    if (disabled) return;
                    setActiveItem(theClass)
                    toShowModal_worker()
                  }

                  return (
                    <div key={cIndex}
                      className={
                        classNames(scss.cell, scss.workerCell, headerClassName, bodyClassName)}
                    >
                      {!workersArr[0] && !disabled &&
                        <div className={scss.worker} >
                          <span></span>
                          <IconAddCircle className={scss.icon} onClick={onAdd} />
                        </div>
                      }
                      {workersArr?.map((worker, wIndex, arr) => {
                        const onRemove = () => {
                          theClass.removeWorker(wIndex)
                        }

                        const isLast = arr.length === wIndex + 1

                        return (
                          <div key={wIndex} className={scss.worker} >
                            <InputSel
                              disabled={true}
                              showBaseline={disabled ? "invisible" : "always"}
                              inputProps={{
                                value: worker.chName,
                              }}
                            />
                            {/* <span>{worker.chName}</span> */}
                            {!disabled && <IconRemoveCircle className={scss.icon} onClick={onRemove} />}
                            {/* {!isLast && <IconRemoveCircle className={scss.icon} onClick={onRemove} />}
                            {isLast && <IconAddCircle className={scss.icon} onClick={onAdd} />} */}
                          </div>
                        )
                      })}

                      {workersArr[0] && !disabled &&
                        <div className={scss.worker}>
                          <span></span>
                          <IconAddCircle className={scss.icon} onClick={onAdd} />
                        </div>
                      }
                    </div>
                  )
                }
                // ---------------------
                if (eleType === "modal" && key === "meals") {
                  // const mealsArr = theClass["meals"]
                  const mealsArr = theClass["meals"]
                  const onAdd = () => {
                    if (disabled) return;
                    setActiveItem(theClass)
                    toShowModal_meals()
                  }

                  return (
                    <div key={cIndex}
                      className={
                        classNames(scss.cell, scss.workerCell, headerClassName, bodyClassName)}
                    >
                      {!mealsArr[0] && !disabled &&
                        <div className={scss.worker} >
                          <span></span>
                          <IconAddCircle className={scss.icon} onClick={onAdd} />
                        </div>
                      }
                      {mealsArr?.map((meals, wIndex, arr) => {
                        const onRemove = () => {
                          theClass.removeMeals(wIndex)
                        }

                        const isLast = arr.length === wIndex + 1

                        return (
                          <div key={wIndex} className={scss.worker} >
                            <InputSel
                              disabled={true}
                              showBaseline={disabled ? "invisible" : "always"}
                              inputProps={{
                                value: mealsLookup[meals]
                              }}
                            />
                            {/* <span>{worker.chName}</span> */}
                            {!disabled && <IconRemoveCircle className={scss.icon} onClick={onRemove} />}
                            {/* {!isLast && <IconRemoveCircle className={scss.icon} onClick={onRemove} />}
                            {isLast && <IconAddCircle className={scss.icon} onClick={onAdd} />} */}
                          </div>
                        )
                      })}

                      {mealsArr[0] && !disabled &&
                        <div className={scss.worker}>
                          <span></span>
                          <IconAddCircle className={scss.icon} onClick={onAdd} />
                        </div>
                      }
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
        {!disabled &&
          <MyButton
            label="新增回報"
            preImg="add"
            className={scss.newReportBtn}
            onClick={addDailyReportItem}
          />
        }
      </div>
      <WorkerSelector
        showModal={showModal_worker}
        onConfirm={modalOnConfirm_worker}
        onCancel={modalOnCancel_worker}
        label="選擇工務人員"
        selLimit={1}
      />

      <MealSelector
        visible={showModal_meals}
        onConfirm={modalOnConfirm_meals}
        onCancel={modalOnCancel_meals}
      />

    </div>
  )
}
// =================================================================


type TclassKeys = keyof Class_reportItem

const headerKeyArr: (TclassKeys | "workingTime")[] = [
  "periodOfDay",
  "workingTime",
  "customerName",
  "description",
  "workers",
  "dispatchOrderId",
  "meals",

  "departureTime",
  "departureWorksiteTime",
  "contactName",
  "licensePlate",
  "stayLength",
  "arrivalTime",
]

const bodyKeyArr: TclassKeys[] = [
  "periodOfDay",
  "departureTime",
  "departureWorksiteTime",
  "customerName",
  "description",
  "workers",
  "dispatchOrderId",
  "meals",
  "arrivalTime",
  "contactName",
  "licensePlate",
  "stayLength",
]

type Tconfig = {
  [key in (TclassKeys | "workingTime")]?:
  {
    label: string
    placeholder: string
    color?: "black" | "main"
    style?: React.CSSProperties
    headerClassName: string
    bodyClassName: string
    optionArr?: Toption[]
    inputType?: "number" | "text"
    suffix?: string
  } & (
    { eleType?: "input" | "timePicker" | "textarea" | "modal" } |
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
    placeholder: "時段",
    headerClassName: classNames("w-[104px] row-span-6"),
    bodyClassName: classNames("row-span-2"),
  },
  workingTime: {
    label: "工務時間",
    placeholder: "時間",
    headerClassName: classNames("w-[170px] row-span-2 col-span-2"),
    bodyClassName: classNames(),
  },
  customerName: {
    eleType: "textarea",
    label: "客戶名稱/工程名稱",
    placeholder: "客戶名稱/工程名稱",
    headerClassName: classNames("w-[250px] row-span-3", scss.textLeft),
    bodyClassName: classNames("row-span-1"),
  },
  contactName: {
    eleType: "input",
    label: "接洽人",
    placeholder: "請輸入接洽人",
    headerClassName: classNames("w-[250px] row-span-3", scss.textLeft),
    bodyClassName: classNames("row-span-1"),
  },
  description: {
    eleType: "textarea",
    label: "工作內容",
    placeholder: "請輸入接洽內容",
    headerClassName: classNames("w-auto row-span-6", scss.textLeft),
    bodyClassName: classNames("row-span-2"),
  },
  workers: {
    eleType: "modal",
    label: "工務人員",
    placeholder: "接洽人",
    headerClassName: classNames("w-[140px] row-span-6", scss.textLeft),
    bodyClassName: classNames("row-span-2"),
  },
  dispatchOrderId: {
    eleType: "input",
    label: "派工單序號",
    placeholder: "派工單序號",
    headerClassName: classNames("w-[160px] row-span-3", scss.textLeft),
    bodyClassName: classNames("row-span-1"),
  },
  meals: {
    eleType: "modal",
    // optionArr: optionArr_mealsCost,
    label: "餐費",
    placeholder: "餐費",
    headerClassName: classNames("w-[100px] row-span-3", scss.rightEdge),
    bodyClassName: classNames("row-span-1"),
  },
  departureTime: {
    eleType: "timePicker",
    label: "出發",
    placeholder: "時間",
    headerClassName: classNames("w-[85px] row-span-2"),
    bodyClassName: classNames("row-span-1"),
  },
  departureWorksiteTime: {
    eleType: "timePicker",
    label: "離工地",
    placeholder: "時間",
    headerClassName: classNames("w-[85px] row-span-4"),
    bodyClassName: classNames("row-span-2"),
  },
  arrivalTime: {
    eleType: "timePicker",
    label: "目的地",
    placeholder: "時間",
    headerClassName: classNames("w-[85px] row-span-2"),
    bodyClassName: classNames("row-span-1"),
  },
  licensePlate: {
    eleType: "input",
    label: "車牌",
    placeholder: "車牌",
    headerClassName: classNames("w-[160px] row-span-3", scss.textLeft),
    bodyClassName: classNames("row-span-1"),
  },
  stayLength: {
    eleType: "input",
    label: "住宿",
    placeholder: "天數",
    inputType: "number",
    headerClassName: classNames("w-[100px] row-span-3", scss.rightEdge),
    bodyClassName: classNames("row-span-1", scss.suffix),
    suffix: "天"
  },
}



const mealsLookup = {
  none: "無",
  breakfast: "早餐",
  lunch: "午餐",
  dinner: "晚餐",
} as const

