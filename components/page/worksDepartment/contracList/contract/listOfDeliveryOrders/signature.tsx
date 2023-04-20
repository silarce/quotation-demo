
import {  Dispatch, SetStateAction } from "react"

// global gear
import InputSel from "components/global/gear/inputAndSel/inputSel"

// css
import style from "./listOfDeliveryOrders.module.scss"


// fake
import { Tsignature } from "pages/worksDepartment/contractList/contract/listOfDeliveryOrders/edit"



export default function Signature(
  { signature, setSignature, editable }:
    {
      signature: Partial<Tsignature>
      setSignature: Dispatch<SetStateAction<Partial<Tsignature>>>
      editable: boolean
    }
) {


  return (
    <div className={style.signature}>

      {indexKeys.map((key, index) => {
        const { label, placeholder } = config[key]
        const stateValue = signature[key]

        const onChange
          = (v: string) => {
            signature[key] = v
            setSignature({ ...signature })
          }

        return (
          <div className={style.cell} key={index}>
            <span>{label}</span>
            <InputSel className={style.input02}
              inputProps={{
                value: stateValue ?? "",
                onChange
              }}
              placeholder={placeholder}
              disabled={!editable}
            />
          </div>
        )
      })}

    </div>
  )
}

// ====================================================


type TindexKeys = keyof Tsignature
const indexKeys: TindexKeys[]
  = ["會計", "倉庫", "廠務主管", "單位主管", "填表",]

const config: {
  [key in TindexKeys]: {
    label: string
    placeholder: string
  }
} = {
  會計: {
    label: "會計",
    placeholder: "請輸入會計人員"
  },
  倉庫: {
    label: "倉庫",
    placeholder: "請輸入倉庫人員"
  },
  廠務主管: {
    label: "廠務主管",
    placeholder: "請輸入廠務主管"
  },
  單位主管: {
    label: "單位主管",
    placeholder: "請輸入單位主管"
  },
  填表: {
    label: "填表",
    placeholder: "請輸入填表人"
  }
}














