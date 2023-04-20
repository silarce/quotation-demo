import { Dispatch, SetStateAction } from "react"

// global gear
import InputSel from "components/global/gear/inputAndSel/inputSel"

// css
import style from "./powerTransmissionSpareList.module.scss"

// fake
import type { Tprofile } from "pages/worksDepartment/contractList/contract/powerTransmissionSpareList/edit"

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
            <InputSel className={style.input02} key={index}
              datePickerProps={{ value: stateValue ?? "", onChange, }}
              label={label}
              captionWidth="80px"
              gap="40px"
              captionColor="main"
              disabled={
                !editable || key === "projectName" ? true : false
              } />
          )
        }
        // -----
        const onChange = (v: string) => {
          setData(data => {
            data[key] = v
            return { ...data }
          })
        }
        const showBaseline = key === "projectName" ? "invisible" : "always"
        return (
          <InputSel className={style.input02} key={index}
            inputProps={{
              value: stateValue ?? "",
              onChange
            }}
            label={label}
            captionWidth="80px"
            captionColor="main"
            gap="40px"
            width={key === "projectName" ? "700px" : "255px"}
            disabled={
              !editable || key === "projectName" ? true : false
            }
            showBaseline={showBaseline}
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