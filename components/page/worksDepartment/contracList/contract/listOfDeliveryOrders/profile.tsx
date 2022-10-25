import { ChangeEvent, Dispatch, SetStateAction } from "react"

// global gear
import Input02 from "components/global/gear/input/input02"


// css
import style from "./listOfDeliveryOrders.module.scss"

// fake
import type { Tprofile } from "pages/worksDepartment/contractList/[contractId]/listOfDeliveryOrders/edit/[id]"




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
        const { label } = config[key]
        const stateValue = data[key]
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
  }
} = {
  projectId: {
    label: "工程編號"
  },
  projectName: {
    label: "工程名稱"
  },
  neededDate: {
    label: "需要日期"
  },
  applyDate: {
    label: "填表日期"
  },
}


