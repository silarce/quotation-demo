

import { useState } from "react"
import Image from "next/image"


// gear
import InputSel from "components/global/gear/inputAndSel/inputSel"

// css
import scss from "./dailyReportTablePanel_mobile.module.scss"

// icon
import iconCross from "public/image/icon/cross_thin.svg"
import iconSearch from "public/image/icon/search.svg"

// ============================================================================
// type
import { TdoSearch } from "components/global/gear/HOC/searchBar/searchBar"
import { Toption } from "js/utils/options/options"
// ============================================================================

const reportedAtOptions = [
  { label: "全部", value: "全部" },
  { label: "未檢視", value: "未檢視" },
  { label: "已檢視", value: "已檢視" },
]

export default function DailyReportTablePanel_mobile(
  { onSearch, onCancel }:
    {
      onSearch: TdoSearch
      onCancel: () => void
    }
) {

  const [isUserReviewed, setIsUserReviewed] = useState<Toption>(reportedAtOptions[0])

  const [date, setDate] = useState("")

  const doSearch = () => {
    onSearch([isUserReviewed, date])
  }



  return (
    <div className={scss.container}>
      <Image className={scss.iconClose} onClick={onCancel}
        src={iconCross} alt="close" />
      <InputSel
        className={scss.sel}
        width={"104px"}
        selectProps={{
          value: isUserReviewed,
          options: reportedAtOptions,
          onChange: (v) => { setIsUserReviewed(v!) },
          arrowType: "black"
        }}
      />

      <div className={scss.inputWrapper}>
        <label className={scss.label}>
          <input type="text" autoComplete="off"
            placeholder={"請輸入日期"}
            value={date}
            onChange={(e) => {
              setDate(e.target.value)
            }}
          />
        </label>
        <Image src={iconSearch} alt="search" onClick={doSearch} />
      </div>
    </div>
  )




}


