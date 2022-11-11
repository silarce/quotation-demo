// 公司職等職稱
// 公司職等職稱
import {
  ChangeEvent, Dispatch, SetStateAction, MouseEvent,
  useState, useEffect,
} from "react"

const _ = require("lodash")



// glogal gear
import PageHeader02, { TpanelList } from "components/PageHeader/pageHeader02"
// import InputModal from "components/global/gear/modal/simpleModal/inputModal"
// import myAlert from "components/global/gear/modal/simpleModal/alertModals"
import LoadingCover01 from "components/global/gear/loadingCover/loadingCover01"
import { setRootLoading } from "components/global/gear/loadingCover/rootLoadingCover"
import myAlert from "components/global/gear/modal/simpleModal/alertModals"
import CellWithBar from "components/global/gear/cell/cellWithBar"
import Input02 from "components/global/gear/input/input02"

// icon
import { IconEdit, IconCopy, IconDelete01, IconCheck02 } from "public/image/icon/svgComponent/svgIcons"

// css
import style from "./quoteRangeList.module.scss"


type TquoteRangeState = {
  list: QuoteRangeClass[]
}
// ==========================================================================
export default function QuoteRangeList() {
  const [isReady, setIsReady] = useState(false)
  const [editable, setEditable] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  // ------------------------------------------------------------------------
  const [quoteRangeState, setQuoteRangeState] = useState<TquoteRangeState>({ list: [] })

  useEffect(() => {
    if (quoteRangeState.list.length !== 0) return
    fakeQuoteRangeListOri().forEach((quoteRange, index) => {
      const newQuoteRange = new QuoteRangeClass({
        quoteRange,
        quoteRangeList: quoteRangeState.list,
        setQuoteRangeState: setQuoteRangeState,
      })
      quoteRangeState.list.push(newQuoteRange)
    })
    setQuoteRangeState({ ...quoteRangeState })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  // ------------------------------------------------------------------------
  const [searchValue, setSearchValue] = useState("")
  const toSearch = (v: string) => setSearchValue(v)
  // ------------------------------------------------------------------------
  const panelList: TpanelList = [
    {
      type: "inputSearch",
      placeholder: "請輸入搜尋內容",
      onClick: toSearch
    },
    {
      type: "addButton",
      label: "新增報價範圍",
      onClick: () => {
        const newQuoteRange = new QuoteRangeClass({
          quoteRange: "",
          quoteRangeList: quoteRangeState.list,
          setQuoteRangeState: setQuoteRangeState,
        })
        quoteRangeState.list.unshift(newQuoteRange)
        setSearchValue("")
        setQuoteRangeState({ ...quoteRangeState })
      }
    }
  ]
  // ------------------------------------------------------------------------
  return (
    <div className={style.container}>
      <PageHeader02
        tag="報價範圍列表"
        panelList={panelList}
      />


      <div className={style.mainContainer}>
        <div className={style.quoteRangeList}>

          {quoteRangeState.list.map((item, index) => {
            const {
              quoteRange, editable,
              copy, changeEditable, deleteThis, onChange
            } = item

            // 與搜尋功能
            const regex = new RegExp(searchValue)
            if (!regex.test(quoteRange)) return null

            return (
              <CellWithBar className={style.row} key={index}
                isActive={editable}
              >

                <div className={style.index}><span>1</span></div>

                <div className={style.input}>
                  <Input02 className={style.input03}
                    stateValue={quoteRange}
                    onChange={onChange}
                    label=""
                    labelWidth="0"
                    gap="0"
                    disabled={!editable}
                  />
                </div>

                <div className={style.icon}>
                  {editable
                    ? <IconCheck02 onClick={() => changeEditable()} />
                    : <IconEdit onClick={() => changeEditable()} />}
                </div>
                <div className={style.icon}>
                  <IconCopy onClick={() => copy()} />
                </div>
                <div className={style.icon}>
                  <IconDelete01 onClick={() => deleteThis()} />
                </div>

              </CellWithBar>
            )

          })}



        </div>


      </div>

    </div>
  )
}


// ==========================================================================

class QuoteRangeClass {
  quoteRange: string
  setQuoteRangeState: Dispatch<SetStateAction<TquoteRangeState>>
  rerender: () => void
  quoteRangeList: QuoteRangeClass[] = []
  editable = false

  constructor(
    { quoteRange,
      quoteRangeList,
      setQuoteRangeState,
    }:
      {
        quoteRange: string
        quoteRangeList: QuoteRangeClass[]
        setQuoteRangeState: Dispatch<SetStateAction<TquoteRangeState>>
      }
  ) {
    this.quoteRange = quoteRange
    this.quoteRangeList = quoteRangeList
    this.setQuoteRangeState = setQuoteRangeState
    this.rerender = () => {
      setQuoteRangeState(state => ({ ...state }))
    }
  }

  copy = () => {
    const copy = new QuoteRangeClass({
      quoteRange: this.quoteRange,
      quoteRangeList: this.quoteRangeList,
      setQuoteRangeState: this.setQuoteRangeState,
    })
    this.quoteRangeList.unshift(copy)
    this.rerender()
  }

  changeEditable = (v?: boolean) => {
    this.quoteRangeList.forEach((other, index, arr) => {
      if (other === this) return
      other.editable = false
    })
    if (v === undefined)
      this.editable = !this.editable
    else this.editable = v
    this.rerender()
  }

  deleteThis = () => {
    const deleteThis = () => {
      const index = this.quoteRangeList.findIndex((item) => item === this)
      this.quoteRangeList.splice(index, 1)
      this.rerender()
    }
    myAlert.confirm({
      title: "確定刪除這個備註?",
      props: {
        onOk: deleteThis,
      }
    })
  }

  onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (!this.editable) return
    const value = e.target.value
    this.quoteRange = value
    this.rerender()
  }
}



// ==========================================================================
const fakeQuoteRangeListOri = () => [
  "電動捲門及大門使用三久捲門電動機及本公司規格配件。",
  "鐵件按裝前塗防銹漆壹次不包含外部油漆。",
  "電源及全部電氣配管配線不在估價之内(由電氣工程施工)。",
  "電動捲門及大門使用三久捲門電動機及本公司規格配件。",
  "電動捲門及大門使用三久捲門電動機及本公司規格配件。",
  "電動捲門及大門使用三久捲門電動機及本公司規格配件。",
  "電動捲門及大門使用三久捲門電動機及本公司規格配件。",
  "電動捲門及大門使用三久捲門電動機及本公司規格配件。",
  "電動捲門及大門使用三久捲門電動機及本公司規格配件。",
  "電動捲門及大門使用三久捲門電動機及本公司規格配件。",
  "電動捲門及大門使用三久捲門電動機及本公司規格配件。",
  "電動捲門及大門使用三久捲門電動機及本公司規格配件。",
  "電動捲門及大門使用三久捲門電動機及本公司規格配件。",
  "電動捲門及大門使用三久捲門電動機及本公司規格配件。",
  "電動捲門及大門使用三久捲門電動機及本公司規格配件。",
]







