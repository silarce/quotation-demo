
// global gear
import Input03 from "components/global/gear/input/input03"
// css
import style from "./quotationSinature.module.scss"


export default function QuotationSinature(
  { signatureArr, disabled = false }:
    {
      signatureArr: { label: string, signature: string, onChange: (v: string) => void }[]
      disabled: boolean
    }) {
  return (
    <div className={style.container}>
      {signatureArr.map((item, index) => {
        const { label, signature, onChange } = item


        return (
          <div key={index}>
            <span>{label}</span>
            <Input03
              stateValue={signature}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              showBaseline={"always"}
            />
          </div>
        )
      })}
    </div>
  )


}










