import { useState, useContext } from "react"
import { useRouter } from "next/router"

import classNames from "classnames"
import Image from "next/image"
import moment from 'moment';

// antd
import { Drawer } from "antd"

// gear
import InputSel from "components/global/gear/inputAndSel/inputSel"
import MyButton from "components/global/gear/button/myButton"
import WorkerSelector from "components/global/gear/modal/workerSelector"
import { showRootLoading } from "components/global/gear/loadingCover/rootLoadingCover"
import MealSelector from "./MealSelector"
import CheckButton from "components/global/gear/button/checkButton"

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
import iconSearch from "public/image/icon/search.svg"
import { IconAddCircle, IconRemoveCircle, IconDelete01 } from "public/image/icon/svgComponent/svgIcons"
import iconArrow from "public/image/icon/arrow03_left.svg"
import { IconCheck02 } from "public/image/icon/svgComponent/svgIcons"

// other
import { AppContext } from "pages/_app"
import { DailyReportContext } from "pages/home/dailyReport"


// type
import { ThookEmptyReport } from "hooks/home/useDailyReport"
import { TuserDto } from "js/api/dtoTypes"

// ==================================================
const optionArr_period = optionsCreator_dailyReportPeriod()
const optionArr_mealsCost = optionsCreator_mealsCost()

// ==================================================
export default function ReportTable(
  { classDailyReportItemArr,
    addDailyReportItem,
    removeDailyReportItem,
    isEdit,
    reportDateArr
  }:
    {
      classDailyReportItemArr: Class_reportItem[] | undefined
      addDailyReportItem: () => void
      removeDailyReportItem: (index: number) => void
      isEdit: boolean
      reportDateArr: string[]
    }
) {
  const router = useRouter()
  const isMine = (router.query.isMine === "true") ? true : false

  const { reportInEdit } = useContext(DailyReportContext)



  const { rwd1023 } = useContext(AppContext)


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

  const modalOnConfirm_meals = (v: TdailyReportItemDto["meals"]) => {
    if (!activeItem) return
    v.forEach((value) => activeItem.addMeals(value))
    modalOnCancel_meals()
    // activeItem.addMeals(v)
  }

  const disabled = !isEdit

  // ------------------------------------------------
  const theHeaderKeyArr = rwd1023 ? headerKeyArr_mobile : headerKeyArr
  const theBodyKeyArr = rwd1023 ? headerKeyArr_mobile : bodyKeyArr

  // ------------------------------------------------
  // ------------------------------------------------
  // ------------------------------------------------
  return (
    <Drawer
      className={scss.drawer}
      visible={!!classDailyReportItemArr}
      // getContainer={false}
      getContainer={rwd1023 ? undefined : false}
      width={"100%"}
      closable={false}
    >

      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      {rwd1023 && <Panel />}
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      {!reportInEdit?.id &&
        <DatePicker reportDateArr={reportDateArr} disabled={disabled} />
      }

      <div className={classNames(scss.table)}>
        <div className={scss.roof} />
        {/*  */}
        <div className={classNames(scss.thead)}>
          {theHeaderKeyArr.map((key, index) => {
            let { label, label_mobile, headerClassName, headerClassName_mobile } = config[key] ?? {}
            if (!rwd1023) headerClassName_mobile = undefined

            const theLabel = (() => {
              if (key === "remove" && !isMine) return undefined
              return rwd1023 ? (label_mobile || label) : label
            })()

            return (
              <div key={key}
                className={classNames(
                  scss.cell,
                  headerClassName,
                  headerClassName_mobile,
                )} >
                <span>{theLabel}</span>
              </div>
            )
            // 
          })}
        </div>
        {/*  */}
        <div className={classNames(scss.tbody)}>
          {classDailyReportItemArr?.map((theClass, rIndex) => {
            return (
              <div key={rIndex} className={classNames(scss.row)}>

                {theBodyKeyArr.map((key, cIndex) => {
                  let {
                    eleType, optionArr, label, inputType,
                    placeholder, placeholder_mobile,
                    headerClassName, bodyClassName,
                    headerClassName_mobile, bodyClassName_mobile,
                    suffix
                  } = config[key] ?? {}

                  if (!rwd1023) {
                    headerClassName_mobile = undefined
                    bodyClassName_mobile = undefined
                  }

                  const thePlaceholder =
                    rwd1023 ? (placeholder_mobile || placeholder) : placeholder

                  if (eleType === "select") {
                    return (
                      <div key={cIndex}
                        className={classNames(
                          scss.cell, headerClassName, bodyClassName, headerClassName_mobile, bodyClassName_mobile)}>
                        <InputSel
                          disabled={disabled}
                          showBaseline="auto"
                          placeholder={thePlaceholder}
                          selectProps={{
                            options: optionArr ?? [],
                            value: theClass[key as TclassKeys] as string,
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
                          headerClassName, bodyClassName, headerClassName_mobile, bodyClassName_mobile)}>
                        <InputSel
                          className="inline-grid"
                          disabled={disabled}
                          showBaseline="auto"
                          placeholder={thePlaceholder}
                          inputProps={{
                            value: theClass[key as TclassKeys] as string,
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
                          headerClassName, bodyClassName, headerClassName_mobile, bodyClassName_mobile)}>
                        <InputSel
                          disabled={disabled}
                          showBaseline="auto"
                          placeholder={thePlaceholder}
                          textareaProps={{
                            value: theClass[key as TclassKeys] as string,
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
                          headerClassName, bodyClassName, headerClassName_mobile, bodyClassName_mobile)}>
                        <InputSel
                          disabled={disabled}
                          showBaseline="auto"
                          placeholder={thePlaceholder}
                          timePickerProps={{
                            value: theClass[key as TclassKeys] as string,
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
                          classNames(
                            scss.cell, scss.workerCell,
                            headerClassName, bodyClassName, headerClassName_mobile, bodyClassName_mobile)}
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
                          classNames(scss.cell, scss.workerCell,
                            headerClassName, bodyClassName, headerClassName_mobile, bodyClassName_mobile)}
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
                  // 
                  if (key === "remove") {
                    const onClick = disabled ? undefined : () => removeDailyReportItem(rIndex)
                    return (
                      <div key={cIndex}
                        className={classNames(scss.cell,
                          headerClassName, bodyClassName, headerClassName_mobile, bodyClassName_mobile)}>
                        {isMine && <IconDelete01 onClick={onClick} />}
                      </div>
                    )
                  }
                  // 
                  // return (
                  //   <div key={cIndex}
                  //     className={classNames(scss.cell,
                  //       headerClassName, bodyClassName, headerClassName_mobile, bodyClassName_mobile)}>
                  //     {cIndex}
                  //   </div>
                  // )
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
    </Drawer>
  )
}
// =================================================================


type TclassKeys = keyof Class_reportItem

const headerKeyArr: (TclassKeys | "workingTime" | "remove")[] = [
  "periodOfDay",
  "workingTime",
  "customerName",
  "description",
  "workers",
  "dispatchOrderId",
  "meals",
  "remove",

  "departureTime",
  "departureWorksiteTime",
  "contactName",
  "licensePlate",
  "stayLength",
  "arrivalTime",
]
const headerKeyArr_mobile: (TclassKeys | "remove")[] = [
  "periodOfDay",
  "departureTime",
  "arrivalTime",
  "departureWorksiteTime",
  "customerName",
  "contactName",
  "description",
  "workers",
  "dispatchOrderId",
  "licensePlate",
  "meals",
  "stayLength",
  "remove",
]

const bodyKeyArr: (TclassKeys | "remove")[] = [
  "periodOfDay",
  "departureTime",
  "departureWorksiteTime",
  "customerName",
  "description",
  "workers",
  "dispatchOrderId",
  "meals",
  "remove",
  "arrivalTime",
  "contactName",
  "licensePlate",
  "stayLength",
]

type Tconfig = {
  [key in (TclassKeys | "workingTime" | "remove")]?:
  {
    label: string
    label_mobile?: string
    placeholder: string
    placeholder_mobile?: string
    color?: "black" | "main"

    headerClassName: string
    headerClassName_mobile: string
    bodyClassName: string
    bodyClassName_mobile: string
    optionArr?: Toption[]
    inputType?: "number" | "text"
    suffix?: string
  } & (
    { eleType?: "input" | "timePicker" | "textarea" | "modal" | "icon" } |
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
    headerClassName_mobile: classNames("h-[43px]"),
    bodyClassName: classNames("row-span-2"),
    bodyClassName_mobile: classNames("h-[43px]"),

  },
  workingTime: {
    label: "工務時間",
    placeholder: "時間",
    headerClassName: classNames("w-[170px] row-span-2 col-span-2"),
    headerClassName_mobile: classNames("h-[43px]"),
    bodyClassName: classNames(),
    bodyClassName_mobile: classNames("h-[43px]"),
  },
  customerName: {
    eleType: "textarea",
    label: "客戶名稱/工程名稱",
    label_mobile: "客戶名稱",
    placeholder: "客戶名稱/工程名稱",
    placeholder_mobile: "客戶名稱",
    headerClassName: classNames("w-[250px] row-span-3", scss.textLeft),
    headerClassName_mobile: classNames("h-[62px]"),
    bodyClassName: classNames("row-span-1"),
    bodyClassName_mobile: classNames("h-[62px]"),
  },
  contactName: {
    eleType: "input",
    label: "接洽人",
    placeholder: "請輸入接洽人",
    headerClassName: classNames("w-[250px] row-span-3", scss.textLeft),
    headerClassName_mobile: classNames("h-[62px]"),
    bodyClassName: classNames("row-span-1"),
    bodyClassName_mobile: classNames("h-[62px]"),
  },
  description: {
    eleType: "textarea",
    label: "工作內容",
    placeholder: "請輸入接洽內容",
    headerClassName: classNames("w-auto row-span-6", scss.textLeft),
    headerClassName_mobile: classNames("h-[300px]"),
    bodyClassName: classNames("row-span-2"),
    bodyClassName_mobile: classNames("h-[300px]"),
  },
  workers: {
    eleType: "modal",
    label: "工務人員",
    placeholder: "接洽人",
    headerClassName: classNames("w-[140px] row-span-6", scss.textLeft),
    headerClassName_mobile: classNames("h-[120px]"),
    bodyClassName: classNames("row-span-2"),
    bodyClassName_mobile: classNames("h-[120px]"),
  },
  dispatchOrderId: {
    eleType: "input",
    label: "派工單序號",
    placeholder: "派工單序號",
    headerClassName: classNames("w-[160px] row-span-3", scss.textLeft),
    headerClassName_mobile: classNames("h-[43px]"),
    bodyClassName: classNames("row-span-1"),
    bodyClassName_mobile: classNames("h-[43px]"),
  },
  meals: {
    eleType: "modal",
    label: "餐費",
    placeholder: "餐費",
    headerClassName: classNames("w-[100px] row-span-3"),
    headerClassName_mobile: classNames("h-[120px]"),
    bodyClassName: classNames("row-span-1"),
    bodyClassName_mobile: classNames("h-[120px]"),
  },
  departureTime: {
    eleType: "timePicker",
    label: "出發",
    placeholder: "時間",
    headerClassName: classNames("w-[85px] row-span-2"),
    headerClassName_mobile: classNames("h-[43px]", scss.single),
    bodyClassName: classNames("row-span-1", scss.single),
    bodyClassName_mobile: classNames("h-[43px]"),
  },
  departureWorksiteTime: {
    eleType: "timePicker",
    label: "離工地",
    placeholder: "時間",
    headerClassName: classNames("w-[85px] row-span-4"),
    headerClassName_mobile: classNames("h-[43px]"),
    bodyClassName: classNames("row-span-2"),
    bodyClassName_mobile: classNames("h-[43px]"),
  },
  arrivalTime: {
    eleType: "timePicker",
    label: "目的地",
    placeholder: "時間",
    headerClassName: classNames("w-[85px] row-span-2"),
    headerClassName_mobile: classNames("h-[43px]", scss.single),
    bodyClassName: classNames("row-span-1", scss.single),
    bodyClassName_mobile: classNames("h-[43px]"),
  },
  licensePlate: {
    eleType: "input",
    label: "車牌",
    placeholder: "車牌",
    headerClassName: classNames("w-[160px] row-span-3", scss.textLeft),
    headerClassName_mobile: classNames("h-[43px]"),
    bodyClassName: classNames("row-span-1"),
    bodyClassName_mobile: classNames("h-[43px]"),
  },
  stayLength: {
    eleType: "input",
    label: "住宿",
    placeholder: "天數",
    inputType: "number",
    headerClassName: classNames("w-[100px] row-span-3",),
    headerClassName_mobile: classNames("h-[43px]"),
    bodyClassName: classNames("row-span-1", scss.suffix),
    bodyClassName_mobile: classNames("h-[43px]", scss.stayLength),
    suffix: "天"
  },
  remove: {
    eleType: "icon",
    label: "刪除",
    placeholder: "",
    headerClassName: classNames("w-[60px] row-span-6", scss.rightEdge),
    headerClassName_mobile: classNames("h-[43px]"),
    bodyClassName: classNames("row-span-2"),
    bodyClassName_mobile: classNames("h-[43px]"),
  }
}

const mealsLookup = {
  none: "無",
  breakfast: "早餐",
  lunch: "午餐",
  dinner: "晚餐",
} as const



// ==============================================================================
// ==============================================================================
// ==============================================================================
const DatePicker = (
  { reportDateArr, disabled }:
    {
      reportDateArr: string[]
      disabled: boolean
    }
) => {

  const { reportInEdit, changeReportDate } = useContext(DailyReportContext)

  return (
    <div className={scss.datePickerWrapper}>
      <InputSel
        label="日報表日期"
        captionColor="main"
        gap="24px"
        width={"245px"}
        className={scss.datePicker}
        placeholder="請選擇日期"
        disabled={disabled}
        datePickerProps={{
          value: reportInEdit?.date || "",
          onChange02(moment, dateString) {
            const dateStr = moment?.toISOString() ?? ""
            changeReportDate(dateStr)
          },
          antdDatePickerProps: {
            disabledDate: (date) => {
              const disabledDate = reportDateArr.some((theDate) => {
                return date.isSame(moment(theDate), "day")
              })
              return disabledDate
            }
          }
        }}
      />
    </div>
  )

}




// ==============================================================================
// ==============================================================================
// ==============================================================================
// mobile
const Panel = () => {

  return (
    <div>
      <TitlePanel />
      <Bar_reporter_inEdit02 />
    </div>
  )
}

const TitlePanel = () => {
  const { reportInEdit, cancelEditNewDailyReport } = useContext(DailyReportContext)
  const employeeChName = reportInEdit?.employeeChName
  const date = moment(reportInEdit?.date).format("y-MM-DD")
  return (
    <div className={scss.TitlePanel}>
      <div className={classNames(scss.left)}>
        <Image src={iconArrow} alt="return" onClick={cancelEditNewDailyReport} />
      </div>
      <div className={classNames(scss.center)}><span>{employeeChName} {date}</span></div>
      {/* <div className={classNames(scss.right)}><IconCheck02 /></div> */}
    </div>
  )
}

function Bar_reporter_inEdit02() {

  const {
    isReportEdit,
    switchIsEdit,
    setShowReviewerForReportModal,
  } = useContext(DailyReportContext)

  return (
    <div className={scss.Bar_reporter_inEdit02}>

      {isReportEdit &&
        <MyButton label="上傳"
          onClick={() => { setShowReviewerForReportModal(true) }} />
      }
      <MyButton label={isReportEdit ? "取消" : "編輯"}
        onClick={switchIsEdit} />

    </div>
  )
}

