import { useState } from "react"

import classNames from "classnames"

// gear
import InputSel from "components/global/gear/inputAndSel/inputSel"
import MyButton from "components/global/gear/button/myButton"
import EmployeeSelector from "components/global/gear/modal/employeeSelector"
import { showRootLoading } from "components/global/gear/loadingCover/rootLoadingCover"

// css
import scss from "./reportTable.module.scss"
// option
import {
  Toption,
  optionsCreator_dailyReportPeriod, optionsCreator_mealsCost,
} from "fakeDatabase/options/options"

// class
import { Class_reportItem } from "pages/home/dailyReport"
import { TemployeeDto } from "js/api/dtoTypes"
import myAlert from "components/global/gear/modal/simpleModal/alertModals"



// ==================================================
const optionArr_period = optionsCreator_dailyReportPeriod()
const optionArr_mealsCost = optionsCreator_mealsCost()

// ==================================================
export default function ReportTable(
  { classDailyReportItemArr,
    addDailyReportItem,
    isEdit,
    employeeArr,
    updateEmployeeArr,
    editSearchValue
  }:
    {
      classDailyReportItemArr: Class_reportItem[]
      addDailyReportItem: () => void
      isEdit: boolean
      employeeArr: TemployeeDto[]
      updateEmployeeArr: () => void
      editSearchValue: (v: string | undefined) => void
    }
) {

  const [showModal, setShowModal] = useState(false)

  const [activeItem, setActiveItem] = useState<Class_reportItem>()


  const toShowModal = async () => {
    try {
      showRootLoading(true)
      await updateEmployeeArr()
    }
    catch { myAlert.err({ title: "取得人員資料失敗" }) }
    finally {
      showRootLoading(false)
    }
    setShowModal(true)
  }

  const modalOnCancel = () => {
    editSearchValue(undefined)
    setShowModal(false)
  }

  const modalOnConfirm = (v: TemployeeDto[]) => {
    if (!activeItem) return
    activeItem.workers = v
  }

  const disabled = !isEdit

  // ------------------------------------------------
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
                        disabled={disabled}
                        showBaseline="auto"
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
                        disabled={disabled}
                        showBaseline="auto"
                        inputProps={{
                          value: theClass[key] as string,
                          // @ts-ignore
                          onChange: (v) => { theClass[key] = v },
                          className: scss.textarea,
                        }} />
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
                        timePickerProps={{
                          value: theClass[key] as string,
                          // @ts-ignore
                          onChange: (v) => { theClass[key] = v },
                        }} />
                    </div>
                  )
                }
                if (eleType === "modal" && key === "workers") {
                  const workersArr = theClass["workers"]
                  return (
                    <div key={cIndex}
                      className={
                        classNames(scss.cell, headerClassName, bodyClassName, "cursor-pointer")}
                      onClick={() => {
                        if (disabled) return;
                        setActiveItem(theClass)
                        toShowModal()
                      }}
                    >
                      {!workersArr && !disabled &&
                        <div className="grid place-content-center">
                          <span>點擊選擇人員</span>
                        </div>
                      }
                      {workersArr?.map((worker, wIndex) => {
                        worker = worker as TemployeeDto
                        return (
                          <div key={wIndex}>
                            <span>{worker.chName}</span>
                          </div>
                        )
                      })}
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
      <EmployeeSelector
        showModal={showModal}
        employeeArr={employeeArr}
        searchCustomer={editSearchValue}
        onConfirm={modalOnConfirm}
        onCancel={modalOnCancel}
        label="選擇工務人員"
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
  "mealsCost",
  
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
  "mealsCost",
  "arrivalTime",
  "contactName",
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
    headerClassName: classNames("w-[250px] row-span-3", scss.textLeft),
    bodyClassName: classNames("row-span-1"),
  },
  contactName: {
    eleType: "input",
    label: "接洽人",
    headerClassName: classNames("w-[250px] row-span-3", scss.textLeft),
    bodyClassName: classNames("row-span-1"),
  },
  description: {
    eleType: "textarea",
    label: "工作內容",
    headerClassName: classNames("w-auto row-span-6", scss.textLeft),
    bodyClassName: classNames("row-span-2"),
  },
  workers: {
    eleType: "modal",
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
    eleType: "timePicker",
    label: "出發",
    headerClassName: classNames("w-[85px] row-span-2"),
    bodyClassName: classNames("row-span-1"),
  },
  departureWorksiteTime: {
    eleType: "timePicker",
    label: "離工地",
    headerClassName: classNames("w-[85px] row-span-4"),
    bodyClassName: classNames("row-span-2"),
  },
  arrivalTime: {
    eleType: "timePicker",
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





