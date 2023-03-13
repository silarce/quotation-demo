import { ChangeEvent, Dispatch, SetStateAction } from "react"

// global gear
import Input02 from "components/global/gear/input/input02"
import TimePicker01 from "components/global/gear/input/timePicker01"

// css
import style from "./powerTransmissionSpareList.module.scss"

// fake
import type { Tprofile } from "pages/worksDepartment/contractList/[contractId]/powerTransmissionSpareList/edit/[id]"




export default function Profile(
  { data, setData, editable }:
    {
      data: Partial<Tprofile>
      setData: Dispatch<SetStateAction<Partial<Tprofile>>>
      editable: boolean
    }
) {


  return (
    <div className={style.profile}>
      {indexKeys.map((key, index) => {
        const { label, type } = config[key]
        const stateValue = data[key]
        // -----
        if (type === "date") {
          const onChange = (dateString: string) => {
            const value = dateString
            setData(data => {
              data[key] = value
              return { ...data }
            })
          }
          return (
            <TimePicker01 className={style.input02} key={index}
              label={label}
              labelWidth="80px"
              stateValue={stateValue}
              onChange={onChange}
              disabled={
                !editable || key === "projectName" ? true : false
              }
            />
          )
        }
        // -----
        const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
          const value = e.target.value
          setData(data => {
            data[key] = value
            return { ...data }
          })
        }
        return (
          <Input02 className={style.input02} key={index}
            label={label}
            stateValue={stateValue}
            onChange={onChange}
            labelWidth="80px"
            width={key === "projectName" ? "700px" : "255px"}
            disabled={
              !editable || key === "projectName" ? true : false
            }
          />
        )
      })}
    </div>

  )
}

// ===================================================

type TindexKeys = keyof Tprofile

const indexKeys: TindexKeys[]
  = [
    "applyDate",
    "projectId",
    "neededDate",
    "projectName",
  ]

const config: {
  [key in TindexKeys]: {
    label: string
    type?: "date"
  }
} = {
  projectId: {
    label: "工程編號"
  },
  projectName: {
    label: "工程名稱"
  },
  neededDate: {
    label: "需要日期",
    type: "date"
  },
  applyDate: {
    label: "填表日期",
    type: "date"
  },
}


// 把profile的時間input改為時間選擇器
// 把profile的時間input改為時間選擇器
// 把profile的時間input改為時間選擇器
// 把profile的時間input改為時間選擇器
// 把profile的時間input改為時間選擇器
// 把profile的時間input改為時間選擇器
// 把profile的時間input改為時間選擇器
// 把profile的時間input改為時間選擇器
// 把profile的時間input改為時間選擇器
// 把profile的時間input改為時間選擇器
// 把profile的時間input改為時間選擇器
// 把profile的時間input改為時間選擇器
// 把profile的時間input改為時間選擇器