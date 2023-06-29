// 報價單
import React, {
  Dispatch, SetStateAction, FocusEvent,
  useState, useRef
} from "react"
import moment from "moment"


// global gear
import InputSel from "components/global/gear/inputAndSel/inputSel"


// option
import { optionsCreator_quotationState, Toption } from "js/utils/options/options"
const optionQuotationState = optionsCreator_quotationState()

// css
import scss from "./quotationStateSel.module.scss"



type TquotationStateHistory = {
  state_from: string,
  state_to: string,
  isoString: string,
}


// =====================================================================
// 報價/歷史狀態狀態
export default function QuotationStateSel(
  { quotationState, setQuotationState, history }:
    {
      quotationState: Toption
      setQuotationState: Dispatch<SetStateAction<Toption>>
      history: TquotationStateHistory[]
    }
) {
  // -------------------------------------------------------------------------
  // 報價狀態
  const [isFocus, setIsFocus] = useState("")
  const [selIsOpen, setSelIsOpen] = useState<boolean | undefined>(undefined)

  const onChange = (option: Toption | null) => {
    setQuotationState(option!)
    setIsFocus("")
    setSelIsOpen(undefined)
  }
  const onFocus = (e?: FocusEvent<HTMLInputElement>) => {
    setIsFocus(scss.isFocus)
  }
  const onBlur = () => {
    setIsFocus("")
    setSelIsOpen(undefined)
  }
  // --------------------------------------------------------------
  // 歷史狀態
  const [showHistory, setShowHistory] = useState("")
  const historyRef = useRef<HTMLDivElement>(null!)
  const historyListRef = useRef<HTMLDivElement>(null!)
  const selRef = useRef<HTMLDivElement>(null!)

  const closeHistoryList = (e: MouseEvent) => {
    // 為了讓使用者可以反白歷史紀錄，不會點了顯次出來的menu就關掉，弄了這兩行判斷
    if (historyRef.current.contains(e.target as Node)) return
    if (historyListRef.current.contains(e.target as Node)) return
    setShowHistory("")
    document.removeEventListener('mousedown', closeHistoryList)
  }
  
  const openHistoryList = () => {
    setShowHistory(scss.isShow)
    // 設定事件，點擊畫面就關掉
    document.addEventListener('mousedown', closeHistoryList)
  }
  // --------------------------------------------------------------
  return (
    <div className={scss.quotationState}>
      <div className={`${scss.sel} ${isFocus}`}
        onClick={() => selRef.current.focus()}
      >
        <span>報價狀態 : </span>

        <InputSel
          className={scss.select03}
          showBaseline="invisible"
          selectProps={{
            value: quotationState,
            options: optionQuotationState,
            onChange: onChange,
            selClassNames: {
              menu: () => scss.selMenu,
              menuList: () => scss.selMenuList,
              option: () => scss.selOption,
            },
            onFocus,
            onBlur,
            selectRef: selRef,
            openMenuOnFocus: true,
            fontSize: "16px",
            arrowType: "black",
          }}
        />
      </div>

      <div className={scss.history} ref={historyRef}
        onClick={openHistoryList}>
        <span>
          歷史狀態
        </span>
      </div>

      <div className={`${scss.historyList} ${showHistory}`} ref={historyListRef}>

        {history.map((item, index, arr) => {
          const { state_from, state_to, isoString } = item
          const mDate = moment(isoString)
          const dateString = mDate.format("YYYY-MM-DD")
          const timeString = mDate.format("HH:mm:ss")

          return (
            <>
              <div className={scss.item}>
                <div><span>{`${state_from} > ${state_to}`}</span></div>
                <div>
                  <span>{dateString}</span>
                  <span>{timeString}</span>
                </div>
              </div>
              {!(arr.length - 1 === index) && <hr />}
            </>
          )
        })}
      </div>

    </div >
  )
}
