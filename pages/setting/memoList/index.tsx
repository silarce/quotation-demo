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
import { IconEdit, IconCopy, IconDelete01 } from "public/image/icon/svgComponent/svgIcons"

// css
import style from "./memoList.module.scss"
import TheadItem from "components/page/domestic/contract/quotation/quotationProduct/dndThead/theadItem"






export default function MemoList() {
  const [isReady, setIsReady] = useState(false)
  const [editable, setEditable] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  // ------------------------------------------------------------------------
  const [memoList, setMemoList] = useState<MemoClass[]>([])

  useEffect(() => {
    const theMemoList =
      fakeMomoListOri().map((memo, index) =>
        new MemoClass({
          memo,
          memoList,
          setMemoList,
          index
        })
      )
    setMemoList(theMemoList)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])




  // ------------------------------------------------------------------------
  const panelList: TpanelList = [
    {
      type: "inputSearch",
      placeholder: "請輸入搜尋內容",
      onClick: () => { }
    },
    {
      type: "addButton",
      label: "新增備註",
      onClick: () => { }
    }
  ]

  // ------------------------------------------------------------------------
  return (
    <div className={style.container}>
      <PageHeader02
        tag="備註列表"
        panelList={panelList}
      />


      <div className={style.mainContainer}>
        <div className={style.memoList}>

          {memoList.map((item, index) => {

            return (
              <CellWithBar key={index}>
                <div><IconEdit /></div>
                <div><IconCopy /></div>
                <div><IconDelete01 /></div>
                <div>1</div>



              </CellWithBar>
            )

          })}



        </div>


      </div>

    </div>
  )
}


// ==========================================================================

class MemoClass {
  memo: string
  rerender: () => void
  memoList: MemoClass[]
  index: number
  editable = false

  constructor(
    { memo,
      memoList,
      setMemoList,
      index
    }:
      {
        memo: string
        memoList: MemoClass[]
        setMemoList: Dispatch<SetStateAction<MemoClass[]>>
        index: number
      }
  ) {
    this.memo = memo
    this.memoList = memoList
    this.index = index
    this.rerender = () => {
      setMemoList(memoList => [...memoList])
    }
  }

  copy = () => {
    const copy = _.cloneDeep(this)
    this.memoList.unshift(copy)
    this.rerender()
  }

  changeEditable = (v: boolean) => {
    if (v === undefined)
      this.editable = !this.editable
    else this.editable = v
    this.rerender()
  }

  delete = () => {
    const deleteThis = () => {
      this.memoList.splice(this.index, 1)
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
    this.memo = value
    this.rerender()
  }
}



// ==========================================================================
const fakeMomoListOri = () => [
  "字串字串字串字串字串字串字串字串字串字串字串字串字串字串字串字串",
  "字串字串字串字串字串字串字串字串字串字串字串字串字串字串字串字串",
  "字串字串字串字串字串字串字串字串字串字串字串字串字串字串字串字串",
  "字串字串字串字串字串字串字串字串字串字串字串字串字串字串字串字串",
  "字串字串字串字串字串字串字串字串字串字串字串字串字串字串字串字串",
  "字串字串字串字串字串字串字串字串字串字串字串字串字串字串字串字串",
  "字串字串字串字串字串字串字串字串字串字串字串字串字串字串字串字串",
  "字串字串字串字串字串字串字串字串字串字串字串字串字串字串字串字串",
]







