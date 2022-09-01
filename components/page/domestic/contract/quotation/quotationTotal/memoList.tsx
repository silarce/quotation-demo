import { useState } from "react"

// global gear
import ModalListSelectorWithSearch from "components/global/gear/modal/modalListSelectorWithSearch"
import CellWithBar from "components/global/gear/cell/cellWithBar"
import Input03 from "components/global/gear/input/input03"

// icon
import { IconAddCircle, IconRemoveCircle } from "public/image/icon/svgComponent/svgIcons"


// css
import styleL from "./local.module.scss"

// type
import { TuseMemoList } from "../hook/useMemoList"
import { Tmemo } from "meta/fakeData/fakeQuotation"


export default function MemoList({ memoListState, disabled }:
  {
    memoListState: TuseMemoList
    disabled: boolean
  }) {

  const { memoList, setMemoList,
    onChangeMemoCreator, deleteMemo, addMemos } = memoListState
  const { list, options } = memoList

  // ====================================================
  const [selMemo, setSelMemo] = useState<Tmemo[]>([])
  const toSelMemo = (memo: Tmemo) => {
    const theIndex = selMemo.indexOf(memo)
    if (theIndex === -1) {
      selMemo.push(memo)
      setSelMemo([...selMemo])
    }
    if (theIndex > -1) {
      selMemo.splice(theIndex, 1)
      setSelMemo([...selMemo])
    }
  }
  // ====================================================
  // ModalListSelectorWithSearch
  const [showAdd, setShowAdd] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  const toShowAdd = () => setShowAdd(true)
  const onCancel = () => {
    setShowAdd(false)
    setSelMemo([])
    setSearchValue("")
  }
  const onConfirm = () => addMemos(selMemo);
  const onSearch = (value: string) => {
    setSearchValue(value)
  }

  return (
    <div className={styleL.listContainer}>
      <p>備註</p>
      {list.map((item, index) => {
        const { content } = item
        const onChange = onChangeMemoCreator(index)
        return (
          <div key={index}>
            {disabled ?
              <span></span> :
              <IconRemoveCircle onClick={() => deleteMemo(index)} />}
            <span>{index + 1}</span>
            <Input03 {...{
              stateValue: content,
              onChange,
              placeholder: "請輸入備註",
              showBaseline: "never",
              disabled
            }} />
          </div>
        )
      })}
      <div>
        {disabled ?
          <span></span> :
          <IconAddCircle onClick={toShowAdd} />}
      </div>
      {/*  */}
      <ModalListSelectorWithSearch {...{
        label: "請選擇備註",
        visible: showAdd,
        onCancel, onConfirm, onSearch,
      }}>
        <div className={styleL.addModalBody}>
          {options.map((item, index) => {
            const { content } = item
            const isActive = (selMemo.includes(item))
            if (!content.includes(searchValue)) return null
            return (
              <CellWithBar className={styleL.cellWithBar} key={index}
                isActive={isActive}
              >
                <div className={styleL.row}
                  onClick={() => toSelMemo(item)}
                >
                  <span>{content}</span>
                </div>
              </CellWithBar>
            )
          })}
        </div>
      </ModalListSelectorWithSearch >
    </div>
  )
}










