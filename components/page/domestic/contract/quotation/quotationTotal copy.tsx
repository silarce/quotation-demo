import { useState } from "react"

// global gear
import ModalListSelectorWithSearch from "components/global/gear/modal/modalListSelectorWithSearch"
import CellWithBar from "components/global/gear/cell/cellWithBar"
// icon
import { IconAddCircle, IconRemoveCircle } from "public/image/icon/svgComponent/svgIcons"


// css
import style from "./quotationTotal.module.scss"

// type
import { TuseMemoList } from "./hook/useMemoList"
import { Tmemo } from "meta/fakeData/fakeQuotation"



export default function QuotationTotal({ memoListState }:
  { memoListState: TuseMemoList }) {

  const { memoList, setMemoList, addMemo, deleteMemo, } = memoListState
  const { list, options } = memoList


  // ====================================================
  const [selMemo, setSelMemo] = useState<Tmemo>()
  const toSelMemo = (memo: Tmemo) => {
    setSelMemo(memo)
  }
  // ====================================================
  // ModalListSelectorWithSearch
  const [showAdd, setShowAdd] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  const toShowAdd = () => setShowAdd(true)
  const onCancel = () => setShowAdd(false)
  const onConfirm = () => {
    if (!selMemo) return
    memoList.list.push(selMemo)
    setMemoList({ ...memoList })
  }
  const onSearch = (value: string) => {
    setSearchValue(value)
  }
  // ====================================================
  return (
    <div className={style.container}>
      {/* ========================================== */}
      <div className={style.memo}>
        {list.map((item, index) => {
          const { content } = item
          return (
            <div key={index}>
              <IconRemoveCircle onClick={() => deleteMemo(index)} />
              <span>{index + 1}</span>
              <span>{content}</span>
            </div>
          )
        })}
        <div>
          <IconAddCircle onClick={toShowAdd} />
        </div>
      </div> {/* memo */}
      {/* ========================================== */}

      <div className={style.layer01}>
        <div className={style.range}>
          range
        </div>


        <div className={style.total}>

        </div>
      </div>
      {/* ============================================= */}
      <ModalListSelectorWithSearch {...{
        label: "請選擇備註",
        visible: showAdd,
        onCancel, onConfirm, onSearch,
      }}>
        <div className={style.addModalBody}>

          {options.map((item, index) => {
            const { content } = item
            const isActive = (selMemo === item)

            if (!content.includes(searchValue)) return null

            return (
              <CellWithBar className={style.cellWithBar} key={index}
                isActive={isActive}
              >
                <div className={style.row}
                  onClick={() => toSelMemo(item)}
                >
                  <span>{content}</span>
                </div>
              </CellWithBar>
            )
          })}

        </div>
      </ModalListSelectorWithSearch >

    </div >
  )
}