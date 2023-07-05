import { useState, useContext, useEffect, useMemo } from "react"
import { useRouter } from "next/router"

import classNames from "classnames"
import Image from "next/image"
import moment from 'moment';

import _ from "lodash"

// antd
import { Drawer, Badge, Spin } from "antd"
import { LoadingOutlined } from '@ant-design/icons';

// gear
import InputSel from "components/global/gear/inputAndSel/inputSel"
import MyButton from "components/global/gear/button/myButton"
import WorkerSelector from "components/global/gear/modal/workerSelector"
import MealSelector from "./MealSelector"
import LicensePlateSelector from "./LicensePlateSelector";
import CheckButton from "components/global/gear/button/checkButton"
import LoadingCover01 from "components/global/gear/loadingCover/loadingCover01";

// css
import scss from "./reportTable.module.scss"

// api
import {
  TdailyReportDto,
  useApiDailyReports
} from "js/api/api_dailyReport";



// option
import {
  Toption,
  optionsCreator_dailyReportPeriod,
} from "js/utils/options/options"

// class
import { Class_reportItem } from "pages/home/dailyReport"
import { TdailyReportItemDto, TdailyReportWokerDto } from "js/api/dtoTypes"

// icon
import { IconAddCircle, IconRemoveCircle, IconDelete01 } from "public/image/icon/svgComponent/svgIcons"
import iconArrow from "public/image/icon/arrow03_left.svg"
import { IconCheck02 } from "public/image/icon/svgComponent/svgIcons"

// other
import { AppContext } from "pages/_app"
import { DailyReportContext } from "pages/home/dailyReport"


// ==================================================
// 防抖
let timeoutId: NodeJS.Timeout
// 
const optionArr_period = optionsCreator_dailyReportPeriod()
// ==================================================
export default function ReportTable(
  {
    addDailyReportItem,
    removeDailyReportItem,
  }:
    {
      addDailyReportItem: () => void
      removeDailyReportItem: (index: number) => void
    }
) {
  const router = useRouter()
  const isMine = (router.query.isMine === "true") ? true : false

  const { reportInEdit, userInfo } = useContext(DailyReportContext)
  const { rwd1023 } = useContext(AppContext)

  const classDailyReportItemArr = reportInEdit?.items

  const { isEdit, prevDate } = reportInEdit ?? {}

  const [monthStart, setMonthStart] = useState<string>()
  const [monthEnd, setMonthEnd] = useState<string>()

  const userId = userInfo.employee?.id

  const param = {
    pageSize: 999,
    filter: {
      $and: {
        "employee.id": { $eq: userId },
        date: {
          $gte: monthStart,
          $lte: monthEnd
        },
      }
    }
  }


  const [isLoading, setIsLoading] = useState(false)
  /**從當月的上個月到當月的下個月的資料 */
  const {
    dailyReport: dailyReport_calendar,
    setDailyReports: setDailyReports_calendar,
    updateDailyReports: updateDailyReports_calendar,
    controller
  } = useApiDailyReports(param)


  const isYesterdayHasReport = useMemo(() => {
    if (!reportInEdit) return false

    const yesterday = moment(reportInEdit.date).subtract(1, "day")

    // dailyReport_calendar是undefined就代表日期選擇器沒有被渲染出來
    // 就代表不是新增日報表，而是編輯已存在日報表
    if (!dailyReport_calendar) {
      // prevDate為該日報表前一筆資料的日期
      return moment(prevDate).isSame(yesterday)
    }
    /**其實在編輯已存在日報表時可以用isYesterdayHaveReport的作法把總表送進來處理
     * 但是prevDate已經做好了，所以就繼續用prevDate來處理
     */

    /**該日報表日期的前一天 */
    const isYesterdayHaveReport = dailyReport_calendar?.some((report) => {
      const reportDateM = moment(report.date)
      return moment(reportDateM).isSame(yesterday, "day")
    })

    return isYesterdayHaveReport ?? false
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportInEdit?.date])



  const cancelReq = () => {
    if (controller) controller.abort()
  }

  useEffect(() => {
    if (classDailyReportItemArr === undefined) return;
    const now = moment()
    setMonthStart(now.clone().subtract(1, "month").startOf("month").toISOString())
    setMonthEnd(now.clone().add(1, "month").startOf("month").toISOString())
  }, [classDailyReportItemArr])

  useEffect(() => {
    if (!monthStart || !monthEnd) return;
    clearTimeout(timeoutId)
    setIsLoading(true)

    timeoutId = setTimeout(async () => {
      try {
        await updateDailyReports_calendar()
      }
      catch { }
      setIsLoading(false)
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthStart, monthEnd])

  useEffect(() => {
    if (isEdit) return
    setDailyReports_calendar(undefined)
    setMonthStart(undefined)
    setMonthEnd(undefined)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit])


  const [showModal_worker, setShowModal_worker] = useState(false)
  const [showModal_meals, setShowModal_meals] = useState(false)
  const [showModal_licensePlate, setShowModal_licensePlate] = useState(false)

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
  }

  const modalOnConfirm_licensePlate = (v: string | undefined) => {
    if (!activeItem) return
    activeItem.licensePlate = v ?? ""
    setShowModal_licensePlate(false)
  }

  const disabled = !isEdit

  // ------------------------------------------------
  const theHeaderKeyArr = rwd1023 ? headerKeyArr_mobile : headerKeyArr
  const theBodyKeyArr = rwd1023 ? headerKeyArr_mobile : bodyKeyArr

  // ------------------------------------------------
  /**用來觸發目的地、離工地的focus */
  const [timeTrigger, setTimeTrigger] = useState({ rIndex: -1, key: "" })
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
        <DatePicker disabled={disabled}
          setMonthStart={setMonthStart}
          setMonthEnd={setMonthEnd}
          isLoading={isLoading}
          dailyReport={dailyReport_calendar}
          cancelReq={cancelReq}
        />
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
            {/* {sortedClassDailyReportItemArr?.map((theClass, rIndex) => { */ }
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
                            allowNewLineByUser: key === "description"
                          }} />
                      </div>
                    )
                  }

                  if (eleType === "timePicker") {

                    const focusTrigger =
                      (timeTrigger.rIndex === rIndex && timeTrigger.key === key)

                    const changeTrigger = () => {
                      let theKey: string = "";
                      if (key === "departureTime") theKey = "arrivalTime"
                      if (key === "arrivalTime") theKey = "departureWorksiteTime"
                      setTimeTrigger({ rIndex, key: theKey })
                    }

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
                              changeTrigger()
                            },
                            focusTrigger: focusTrigger
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
                              {!disabled && <IconRemoveCircle className={scss.icon} onClick={onRemove} />}
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
                              {!disabled && <IconRemoveCircle className={scss.icon} onClick={onRemove} />}
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
                  if (eleType === "modal" && key === "licensePlate") {
                    const licensePlate = theClass["licensePlate"]

                    const onAdd = () => {
                      if (disabled) return;
                      setActiveItem(theClass)
                      setShowModal_licensePlate(true)
                    }
                    return (
                      <div key={cIndex}
                        className={
                          classNames(scss.cell, scss.workerCell,
                            headerClassName, bodyClassName, headerClassName_mobile, bodyClassName_mobile)}
                      >
                        <div className={scss.worker} >
                          <InputSel
                            disabled={true}
                            showBaseline={disabled ? "invisible" : "always"}
                            placeholder={thePlaceholder}
                            inputProps={{
                              value: licensePlate ?? ""
                            }}
                          />
                          {!disabled && <IconAddCircle className={scss.icon} onClick={onAdd} />}
                        </div>
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
          isYesterdaySamePrevDate={isYesterdayHasReport}
        />

        <LicensePlateSelector
          visible={showModal_licensePlate}
          onConfirm={modalOnConfirm_licensePlate}
          onCancel={() => setShowModal_licensePlate(false)}
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
    eleType: "modal",
    label: "車牌",
    placeholder: "請選擇",
    headerClassName: classNames("w-[160px] row-span-3", scss.textLeft),
    headerClassName_mobile: classNames("h-[43px]"),
    bodyClassName: classNames("row-span-1"),
    bodyClassName_mobile: classNames("h-[43px]"),
  },
  stayLength: {
    eleType: "select",
    optionArr: [{ value: "0", label: "無" }, { value: "1", label: "有" }],
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
  { disabled,
    setMonthStart,
    setMonthEnd,
    isLoading,
    dailyReport,
    cancelReq,
  }:
    {
      disabled: boolean
      setMonthStart: (ISOstring: string) => void
      setMonthEnd: (ISOstring: string) => void
      isLoading: boolean
      dailyReport: TdailyReportDto[] | undefined
      cancelReq: () => void
    }
) => {

  const { reportInEdit, changeReportDate } = useContext(DailyReportContext)
  const isEdit = reportInEdit?.isEdit

  const defaultValue = useMemo(() => {
    if (!dailyReport) return undefined
    const inEditDate = moment()

    if (!dailyReport?.[0]) {
      if (reportInEdit) {
        reportInEdit.date = inEditDate.toISOString()
      }
      return inEditDate
    }
    const lastDate = moment(dailyReport?.[0].date)
    if (lastDate.isSame(inEditDate, "day")) return undefined
    else {
      if (reportInEdit) {
        reportInEdit.date = inEditDate.toISOString()
      }
      return inEditDate
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!dailyReport])

  return (
    <div className={scss.datePickerWrapper}>
      <InputSel
        /**key是為了使defaultValue更新 */
        // key={`${defaultValue}`}
        key={`${defaultValue} ${isEdit}`}
        label="日報表日期"
        captionColor="main"
        gap="24px"
        width={"245px"}
        className={scss.datePicker}
        placeholder="請選擇日期"
        disabled={disabled}
        datePickerProps={{
          // value: reportInEdit?.date || "",
          value: undefined,
          onChange02(moment, dateString) {
            const dateStr = moment?.toISOString() ?? ""
            changeReportDate(dateStr)
          },
          antdDatePickerProps: {
            // defaultValue: moment(reportInEdit?.date || undefined),
            defaultValue: defaultValue,
            disabledDate: (date) => {
              if (isLoading) return true
              // 比當日晚的日期都不能選
              if (date.isAfter(moment())) { return true }

              // // 已經存在的日期都不能選
              if (!dailyReport) return true

              const isDisabledDate = dailyReport.some((report) => {
                const isSame = date.isSame(moment(report.date), "day")
                return isSame
              })
              return isDisabledDate
            },
            onPanelChange: (theMoment, mode) => {
              cancelReq()
              const start =
                theMoment.clone().subtract(1, "month").startOf("month").toISOString()
              const end =
                theMoment.clone().endOf("month").add(1, "month").toISOString()
              setMonthStart(start)
              setMonthEnd(end)
            },
            dateRender: isLoading ? DateRender : undefined
          },
        }}
      />
    </div>
  )
}


const DateRender = () => {
  return (
    <Spin indicator={<LoadingOutlined />} />
  )
}


// ==============================================================================
// ==============================================================================
// ==============================================================================
// mobile
const Panel = () => {

  const {
    identity, reportInEdit, isReportEdit,
    userInfo,
  } = useContext(DailyReportContext)


  const Below = (() => {
    if (reportInEdit?.isUserIsViewer) {
      return () => null
    }
    if (identity === "manager") {
      if (!reportInEdit) return () => null
      else if (reportInEdit.isAllowToReview) return Bar_reviewer_inEdit_user
      else return () => null
    }

    if (identity === "reviewer") {
      if (!reportInEdit) return () => null
      else {
        if (!reportInEdit?.employeeId || reportInEdit?.employeeId === userInfo?.employee?.id) {
          if (isReportEdit) return Bar_reporter_inEdit02
          if (reportInEdit.isReviewedByOther) return Bar_reporter_reviewed
          return Bar_reporter_inEdit02
        }
        else if (reportInEdit.isAllowToReview) {
          return Bar_reviewer_inEdit_user
        }
        return () => null
      }
    }

    if (identity === "reporter") {
      if (!reportInEdit) return () => null
      else {
        if (reportInEdit.isReviewedByOther) return Bar_reporter_reviewed
        if (isReportEdit) return Bar_reporter_inEdit02
        return Bar_reporter_inEdit02
      }
    }
    return () => null
  })()


  return (
    <div>
      <TitlePanel />
      <Below />
    </div>
  )
}

const TitlePanel = () => {

  const {
    reportInEdit, cancelEditNewDailyReport,
    isReportEdit, setShowReviewerForReportModal
  }
    = useContext(DailyReportContext)
  const employeeChName = reportInEdit?.employeeChName
  const date = moment(reportInEdit?.date).format("y-MM-DD")

  return (
    <div className={scss.TitlePanel}>
      <div className={classNames(scss.left)}>
        <Image src={iconArrow} alt="return" onClick={cancelEditNewDailyReport} />
      </div>
      <div className={classNames(scss.center)}><span>{employeeChName} {date}</span></div>
      {isReportEdit &&
        <div className={classNames(scss.right)}
          onClick={() => setShowReviewerForReportModal(true)}><IconCheck02 /></div>
      }
    </div>
  )
}

function Bar_reporter_inEdit02() {

  const {
    isReportEdit,
    switchIsEdit,
  } = useContext(DailyReportContext)

  return (
    <div className={scss.bar}>
      {/* {isReportEdit &&
        <MyButton label="上傳"
          onClick={() => { setShowReviewerForReportModal(true) }} />
      } */}
      <MyButton label={isReportEdit ? "取消" : "編輯"}
        onClick={switchIsEdit} />
    </div>
  )
}

function Bar_reviewer_inEdit_user() {
  const {
    reportInEdit,
    doCheck
  } = useContext(DailyReportContext)

  return (
    <div className={scss.bar}>
      <CheckButton
        checkLabel="已讀"
        uncheckLable="未讀"
        value={!!reportInEdit?.isReviewedByUser}
        onClick={doCheck}
      />
    </div>
  )
}

const Bar_reporter_reviewed = () => {

  return (
    <div className={classNames(scss.bar, scss.reviwedBdage)}>
      <Badge
        className={scss.antdBadge02}
        color="auto"
        text="已檢視" />
    </div>
  )

}


// ===================================================================


export type { Tconfig }

export {
  headerKeyArr, bodyKeyArr, config
}
