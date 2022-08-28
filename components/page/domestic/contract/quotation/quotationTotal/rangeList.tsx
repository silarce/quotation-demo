import { useState } from "react"

// global gear
import ModalListSelectorWithSearch from "components/global/gear/modal/modalListSelectorWithSearch"
import CellWithBar from "components/global/gear/cell/cellWithBar"
import { ModalInfo02 } from "components/global/gear/modal/simpleModal/alertModals"

// icon
import { IconAddCircle, IconRemoveCircle } from "public/image/icon/svgComponent/svgIcons"


// css
import styleL from "./local.module.scss"

// type
import { TuseRangeList } from "../hook/useRangeList"
import { Trange } from "meta/fakeData/fakeQuotation"


export default function RangeList({ rangeListState }:
  { rangeListState: TuseRangeList }) {

  const { rangeList, setRangeList, deleteRange, } = rangeListState
  const { list, options } = rangeList

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
  const onConfirm = () => {
    if (!selRange[0]) return ModalInfo02({ title: "請選擇備註" })
    rangeList.list = rangeList.list.concat([...selRange])
    setRangeList({ ...rangeList })
  }
  const onSearch = (value: string) => {
    setSearchValue(value)
  }

  return (
    <div className={styleL.listContainer}>
      <p>報價範圍</p>
      {list.map((item, index) => {
        const { content } = item
        return (
          <div key={index}>
            <IconRemoveCircle onClick={() => deleteRange(index)} />
            <span>{index + 1}</span>
            <span>{content}</span>
          </div>
        )
      })}
      <div>
        <IconAddCircle onClick={toShowAdd} />
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










