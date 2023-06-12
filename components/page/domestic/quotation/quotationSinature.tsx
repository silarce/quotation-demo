
// global gear
import InputSel from "components/global/gear/inputAndSel/inputSel"
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
            <InputSel
              isMust={true}
              mustTipClassName={style.mustTip}
              inputProps={{
                value: signature ?? "",
                onChange: (v) => onChange(v)
              }}
              disabled={disabled}
              showBaseline={"always"}
            />
          </div>
        )
      })}
    </div>
  )


}










