import {
  Dispatch, SetStateAction, ChangeEvent,
  useState, Fragment
} from "react"

// globalGear
import Select03 from "components/global/gear/select/select03"

// icon
import { IconSearch } from "public/image/icon/svgComponent/svgIcons"

// css
import style from "./searchBar.module.scss"

// type
import { Toption } from "components/global/gear/select/select03"


interface TsearchObj {
  [key: string]: string
}


interface TsearchTargetSel {
  stateValue: Toption
  options: Toption[]
  placeholder: string
  onChange: (option: Toption | null) => void
}

interface TsearchTargetInput {
  stateValue: string
  placeholder?: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  options?: undefined
}



export default function SearchBar({ setSearchObj, searchTargetList, doSearch }:
  {
    setSearchObj: Dispatch<SetStateAction<TsearchObj>>
    searchTargetList: (TsearchTargetSel | TsearchTargetInput)[]
    doSearch: () => void
  }) {

  return (
    <div className={style.container}>

      {searchTargetList.map((target, index) => {

        const { stateValue, options, placeholder, onChange, } = target
        if (options) return (
          <div className={style.selectBox} key={index}>
            <Select03
              className={style.select}
              stateValue={stateValue}
              options={options}
              placeholder={placeholder}
              onChange={onChange} />
          </div>
        )
        else return (
          <Fragment key={index}>
            <div className={style.pilar} />
            <label className={style.label}>
              <input type="text" autoComplete="off"
                placeholder={placeholder}
                value={stateValue}
                onChange={onChange}
              />
            </label>
          </Fragment>
        )
      })}
      <IconSearch className={style.iconSearch} onClick={doSearch} />
    </div>
  )
}


export type { TsearchObj }

// =========================================================






// const doorTypeOptions: Toption[] = [
//   { value: "", label: "不拘" },
//   { value: "SJ-30287", label: "SJ-30287" },
//   { value: "SJ-302", label: "SJ-302" },
//   { value: "門型一", label: "門型一" },
//   { value: "門型二", label: "門型二" },
//   { value: "門型三", label: "門型三" },
// ]
// const countryOptions: Toption[] = [
//   { value: "", label: "不拘" },
//   { value: "台北市", label: "台北市" },
//   { value: "新北市", label: "新北市" },
//   { value: "基隆縣", label: "基隆縣" },
//   { value: "桃園市", label: "桃園市" },
//   { value: "新竹縣", label: "新竹縣" },
//   { value: "新竹市", label: "新竹市" },
//   { value: "苗栗縣", label: "苗栗縣" },
//   { value: "台中市", label: "台中市" },
// ]


// ====================================================






