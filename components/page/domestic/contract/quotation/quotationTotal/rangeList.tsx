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
import { Trange } from "fakeDatabase/domestic/quotation/fakeQuotationList"
import { TuseRangeList } from "../hook/useRangeList"

// data
import { rangeOptions } from "fakeDatabase/domestic/quotation/fakeQuotRangeList"

export default function RangeList({ rangeListState, disabled }:
  {
    rangeListState: TuseRangeList
    disabled: boolean
  }) {

  const { rangeList, setRangeList,
    addRanges, onChangeRangeCreator, deleteRange, } = rangeListState

  // ====================================================
  const [selRange, setSelRange] = useState<Trange[]>([])
  const toSelRange = (range: Trange) => {
    const theIndex = selRange.indexOf(range)
    if (theIndex === -1) {
      selRange.push(range)
      setSelRange([...selRange])
    }
    if (theIndex > -1) {
      selRange.splice(theIndex, 1)
      setSelRange([...selRange])
    }
  }
  // ====================================================
  // ModalListSelectorWithSearch
  const [showAdd, setShowAdd] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  const toShowAdd = () => setShowAdd(true)
  const onCancel = () => {
    setShowAdd(false)
    setSelRange([])
    setSearchValue("")
  }
  const onConfirm = () => addRanges(selRange)
  const onSearch = (value: string) => {
    setSearchValue(value)
  }

  return (
    <div className={styleL.listContainer}>
      <p>報價範圍</p>
      {rangeList.map((item, index) => {
        const { content } = item
        const onChange = onChangeRangeCreator(index)
        return (
          <div key={index}>
            {disabled ?
              <span></span> :
              <IconRemoveCircle onClick={() => deleteRange(index)} />}
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
          {rangeOptions.map((item, index) => {
            const { content } = item
            const isActive = (selRange.includes(item))
            if (!content.includes(searchValue)) return null
            return (
              <CellWithBar className={styleL.cellWithBar} key={index}
                isActive={isActive}
              >
                <div className={styleL.row}
                  onClick={() => toSelRange(item)}
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










