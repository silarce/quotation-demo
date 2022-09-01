
// global gear
import Input03 from "components/global/gear/input/input03"

// css
import style from "./quotationSinature.module.scss"

// type
import { TuseSinature } from "./hook/useSinature"

export default function QuotationSinature({ sinatureState, disabled = false }:
  {
    sinatureState: TuseSinature
    disabled: boolean
  }) {
  const {
    sinature, setSinature,
    onChangeManager, onChangeDirector, onChangeAttn
  } = sinatureState

  const { manager, director, attn } = sinature

  const sinatureList = [
    { sinature: manager, onChange: onChangeManager },
    { sinature: director, onChange: onChangeDirector },
    { sinature: attn, onChange: onChangeAttn },
  ]

  return (
    <div className={style.container}>
      {sinatureList.map((item, index) => {
        const { sinature, onChange } = item
        const { value, label } = sinature;

        return (
          <div key={index}>
            <span>{label}</span>
            <Input03 {...{
              stateValue: value,
              onChange: onChange,
              disabled,
              alwaysBaseline: true
            }} />
          </div>
        )
      })}
    </div>
  )


}










