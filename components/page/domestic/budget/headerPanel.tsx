import { useState } from "react"
import dynamic from "next/dynamic"

// icon
import { IconSearch } from "public/image/icon/svgComponent/svgIcons"

// css
import style from "./headerPanel.module.scss"

// type
import { Toption } from "components/global/gear/select/select03"


// Select03有用到window.document
// ssr時會報錯，所以這樣處理
const Select03 = dynamic(
  () => import("components/global/gear/select/select03"),
  { ssr: false }
)


export default function HeaderPanel() {
  const [doorType, setDoorType] = useState(doorTypeOptions[0])
  const [country, setCountry] = useState(countryOptions[0])

  const onChangeDoor = (option: Toption | null) => {
    if (!option) return
    setDoorType(option)
  }
  const onChangeCountry = (option: Toption | null) => {
    if (!option) return
    setCountry(option)
  }

  const onSearch = () => {
    const doorValue = doorType.value
    const countryValue = country.value


    alert("onsearch")
  }

  return (
    <div className={style.container}>
      <div className={style.selectBox}>
        <Select03
          className={style.select}
          stateValue={doorType}
          options={doorTypeOptions}
          placeholder={"選擇門型"}
          onChange={onChangeDoor}
        />
      </div>
      <div className={style.selectBox}>
        <Select03
          className={style.select}
          stateValue={country}
          options={countryOptions}
          placeholder={"選擇城市"}
          onChange={onChangeCountry} />
      </div>

      <div className={style.pilar} />
      <label className={style.label}>
        <input type="text"
          placeholder="請輸入客戶名稱"
          autoComplete="off"
        />
      </label>
      <div className={style.pilar} />
      <label className={style.label}>
        <input type="text"
          placeholder="請輸入工程名稱"
          autoComplete="off"
        />
      </label>
      <IconSearch className={style.iconSearch} onClick={onSearch} />

    </div>
  )
}

// =========================================================


const doorTypeOptions: Toption[] = [
  { value: "", label: "不拘" },
  { value: "SJ-30287", label: "SJ-30287" },
  { value: "SJ-302", label: "SJ-302" },
  { value: "門型一", label: "門型一" },
  { value: "門型二", label: "門型二" },
  { value: "門型三", label: "門型三" },
]
const countryOptions: Toption[] = [
  { value: "", label: "不拘" },
  { value: "台北市", label: "台北市" },
  { value: "新北市", label: "新北市" },
  { value: "基隆縣", label: "基隆縣" },
  { value: "桃園市", label: "桃園市" },
  { value: "新竹縣", label: "新竹縣" },
  { value: "新竹市", label: "新竹市" },
  { value: "苗栗縣", label: "苗栗縣" },
  { value: "台中市", label: "台中市" },
]




