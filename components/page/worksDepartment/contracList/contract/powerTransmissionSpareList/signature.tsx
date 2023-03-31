


import { ChangeEvent, Dispatch, SetStateAction } from "react"

// global gear
import Input02 from "components/global/gear/input/input02"

// css
import style from "./powerTransmissionSpareList.module.scss"

// fake
import { Tsignature } from "pages/worksDepartment/contractList/contract/powerTransmissionSpareList/edit"


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
          = (e: ChangeEvent<HTMLTextAreaElement>) => {
            const value = e.target.value
            signature[key] = value
            setSignature({ ...signature })
          }

        return (
          <div className={style.cell} key={index}>
            <span>{label}</span>
            <Input02
              className={style.input02}
              stateValue={stateValue}
              onChange={onChange}
              placeholder={placeholder}
              disabled={!editable}
            />
          </div>
        )
      })}

    </div>
  )

}

// ========================================================

type TindexKeys = keyof Tsignature
const indexKeys: TindexKeys[]
  = ["領料人員", "配料人員", "填表人員"]

const config: {
  [key in TindexKeys]: {
    label: string
    placeholder: string
  }
} = {
  領料人員: {
    label: "領料人員",
    placeholder: "請輸入領料人員"
  },
  配料人員: {
    label: "配料人員",
    placeholder: "請輸入配料人員"
  },
  填表人員: {
    label: "填表人員",
    placeholder: "請輸入填表人員"
  },

}


