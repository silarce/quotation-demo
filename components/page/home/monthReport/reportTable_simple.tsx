import { useEffect } from "react";
import classNames from "classnames";
import moment from "moment";

import TextareaAutosize, { TextareaAutosizeProps } from 'react-textarea-autosize';


// gear
import myAlert from "components/global/gear/modal/simpleModal/alertModals";

// api
import {
  TdailyReportDto, TdailyReportItemDto,
  useApiDailyReports_id,
} from "js/api/api_dailyReport";


// config
// import {
//   Tconfig,
//   headerKeyArr, bodyKeyArr, config
// } from "../dailyReport/ReportTable";


// css
// import scss from "./reportTable_simple.module.scss"
import scss from "../dailyReport/reportTable.module.scss"
import scss_locale from "./reportTable_simple.module.scss"



export default function ReportTable_simple(
  {
    // reportId = "1af97beb-eafd-4654-8c76-56c6cf3f2c72",
    reportId = "bbd576ff-f31f-4fb6-8f25-74d273a9583c",
  }:
    {
      reportId?: string

    }
) {

  const {
    dailyReport_id,
    updateDailyReports_id,
  } = useApiDailyReports_id(reportId)



  useEffect(() => {

    (async () => {
      try {
        updateDailyReports_id()
      } catch (error) {
        myAlert.err({ title: "取得日報表失敗" })
      }

    })()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportId])



  return (
    <div className={classNames(scss.table, scss_locale.table)}>
      <div className={scss.roof} />
      <div className={classNames(scss.thead, scss_locale.thead)}>
        {headerKeyArr.map((key, index) => {
          let { label, headerClassName } = config[key] ?? {}
          return (
            <div key={key}
              className={classNames(
                scss.cell,
                headerClassName,
              )} >
              <span>{label}</span>
            </div>
          )
        })}
      </div> {/* thead */}


      <div className={classNames(scss.tbody, scss_locale.tbody)}>
        {dailyReport_id?.items.map((item) => {

          const { id } = item

          return (
            <div key={id} className={classNames(scss.row, scss_locale.row)}>

              {bodyKeyArr.map((key, index) => {
                let { headerClassName, bodyClassName, } = config[key] ?? {}

                let value = item[key]


                if (key === "meals") {
                  value = value as TdailyReportItemDto["meals"]
                  return (
                    <div key={key}
                      className={classNames(
                        scss.cell, headerClassName, bodyClassName)}>
                      {value?.map((meal) => {
                        return (
                          <span key={id}>{meal}</span>
                        )
                      })}
                    </div>
                  )
                }

                if (key === "workers") {
                  value = value as TdailyReportItemDto["workers"]
                  return (
                    <div key={key}
                      className={classNames(
                        scss.cell, headerClassName, bodyClassName)}>
                      {value?.map((worker) => {
                        const { chName, id } = worker
                        return (
                          <span key={id}>{chName}</span>
                        )
                      })}
                    </div>
                  )
                }


                if (
                  key === "customerName" ||
                  key === "description"
                ) {
                  return (
                    <div key={key}
                      className={classNames(
                        scss.cell,
                        headerClassName, bodyClassName)}>
                      <div className={scss_locale.textareaBox}>
                        <TextareaAutosize
                          value={value as string}
                          autoComplete="off"
                          disabled={true}
                        />
                      </div>
                    </div>
                  )

                }

                if (
                  key === "departureTime" ||
                  key === "departureWorksiteTime" ||
                  key === "arrivalTime"
                ) {
                  value = moment(value as string).format("HH:mm")
                }


                return (
                  <div key={key}
                    className={classNames(
                      scss.cell, headerClassName, bodyClassName)}>
                    <span>{value as string}</span>
                  </div>
                )
              })}

            </div>
          )
        })}
      </div>
    </div>
  )

}


// =============================================================================





const headerKeyArr = [
  "periodOfDay",
  "workingTime",
  "customerName",
  "description",
  "workers",
  "workOrderNumber",
  "meals",

  "departureTime",
  "departureWorksiteTime",
  "contactName",
  "licensePlate",
  "stayLength",
  "arrivalTime",
] as const




const bodyKeyArr = [
  "periodOfDay",
  "departureTime",
  "departureWorksiteTime",
  "customerName",
  "description",
  "workers",
  "workOrderNumber",
  "meals",
  "arrivalTime",
  "contactName",
  "licensePlate",
  "stayLength",
] as const



type Tconfig = {
  [key in (keyof TdailyReportItemDto | "workingTime")]?:
  {
    label: string
    placeholder: string
    color?: "black" | "main"
    headerClassName: string
    bodyClassName: string
  }
}


const config: Tconfig = {
  periodOfDay: {
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
    label: "客戶名稱/工程名稱",
    placeholder: "客戶名稱/工程名稱",
    headerClassName: classNames("w-[250px] row-span-3", scss.textLeft),
    bodyClassName: classNames("row-span-1"),
  },
  contactName: {
    label: "接洽人",
    placeholder: "請輸入接洽人",
    headerClassName: classNames("w-[250px] row-span-3", scss.textLeft),
    bodyClassName: classNames("row-span-1"),
  },
  description: {
    label: "工作內容",
    placeholder: "請輸入接洽內容",
    headerClassName: classNames("w-auto row-span-6", scss.textLeft),
    bodyClassName: classNames("row-span-2"),
  },
  workers: {
    label: "工務人員",
    placeholder: "接洽人",
    headerClassName: classNames("w-[140px] row-span-6", scss.textLeft),
    bodyClassName: classNames("row-span-2"),
  },
  workOrderNumber: {
    label: "派工單序號",
    placeholder: "派工單序號",
    headerClassName: classNames("w-[160px] row-span-3", scss.textLeft),
    bodyClassName: classNames("row-span-1"),
  },
  meals: {
    label: "餐費",
    placeholder: "餐費",
    headerClassName: classNames("w-[100px] row-span-3"),
    bodyClassName: classNames("row-span-1"),
  },
  departureTime: {
    label: "出發",
    placeholder: "時間",
    headerClassName: classNames("w-[85px] row-span-2"),
    bodyClassName: classNames("row-span-1", scss.single),
  },
  departureWorksiteTime: {
    label: "離工地",
    placeholder: "時間",
    headerClassName: classNames("w-[85px] row-span-4"),
    bodyClassName: classNames("row-span-2"),
  },
  arrivalTime: {
    label: "目的地",
    placeholder: "時間",
    headerClassName: classNames("w-[85px] row-span-2"),
    bodyClassName: classNames("row-span-1", scss.single),
  },
  licensePlate: {
    label: "車牌",
    placeholder: "請選擇",
    headerClassName: classNames("w-[160px] row-span-3", scss.textLeft),
    bodyClassName: classNames("row-span-1"),
  },
  stayLength: {
    label: "住宿",
    placeholder: "天數",
    headerClassName: classNames("w-[100px] row-span-3",),
    bodyClassName: classNames("row-span-1", scss.suffix),
  },
} as const






