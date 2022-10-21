
import { ChangeEvent, Dispatch, SetStateAction } from "react"

// global gear
import Input02 from "components/global/gear/input/input02"


// css
import style from "./dispatchList.module.scss"


// fake
import { TfakeProfile, TfakeData } from "pages/worksDepartment/contractList/[contractId]/dispatchList"


export default function Profile(
  { data, setData }:
    {
      data: TfakeData
      setData: Dispatch<SetStateAction<TfakeData>>
    }) {

  const profile = data.profile


  return (
    <div className={style.profile}>

      <div className={style.left}>
        {indexKeys01.map((key, index) => {
          const value = profile[key]
          const { label, labelWidth } = config01[key]
          const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
            const value = e.target.value
            setData(data => {
              data.profile[key] = value
              return { ...data }
            })
          }
          return (
            // <Input02 className={style.input02} key={index}
            <Input02 className={`${style.input02} p-0`} key={index}
              stateValue={value}
              label={label}
              labelWidth={labelWidth}
              onChange={onChange}
              labelColor="main"
              disabled={true}
              gap={"24px"}
            />
          )
        })}
      </div>


      <div className={style.right}>
        {indexKeys02.map((key, index) => {
          const value = profile[key]
          const { label, labelWidth } = config02[key]
          const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
            const value = e.target.value
            setData(data => {
              data.profile[key] = value
              return { ...data }
            })
          }
          return (
            <Input02 className={style.input02} key={index}
              stateValue={value}
              label={label}
              labelWidth={labelWidth}
              onChange={onChange}
              labelColor="main"
              gap={"24px"}
            />
          )
        })}
      </div>
    </div>
  )
}
// ============================================================

type TindexKey01 = keyof Pick<TfakeProfile,
  "工程名稱" | "承包商" | "聯絡人" | "工地電話" | "工程地點"
>
type TindexKey02 = keyof Pick<TfakeProfile,
  "工程編號" | "管制卡編號"
>

const indexKeys01: TindexKey01[]
  = ["工程名稱", "承包商", "聯絡人", "工地電話", "工程地點",]
const indexKeys02: TindexKey02[]
  = ["工程編號", "管制卡編號"]

type Tconfig<keys extends string> = {
  [key in keys]: {
    label: string
    labelWidth: string
  }
}

const config01: Tconfig<TindexKey01> = {
  工程名稱: {
    label: "工程名稱",
    labelWidth: "80px",
  },
  承包商: {
    label: "承包商",
    labelWidth: "80px",
  },
  聯絡人: {
    label: "聯絡人",
    labelWidth: "80px",
  },
  工地電話: {
    label: "工地電話",
    labelWidth: "80px",
  },
  工程地點: {
    label: "工程地點",
    labelWidth: "80px",
  },
}
const config02: Tconfig<TindexKey02> = {
  工程編號: {
    label: "工程編號",
    labelWidth: "100px",
  },
  管制卡編號: {
    label: "管制卡編號",
    labelWidth: "100px",
  },
}












