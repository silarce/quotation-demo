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
import { TuseRemarkList } from "../hook/useRemarkList"
import { Tremark } from "fakeDatabase/domestic/quotation/fakeQuotationList"

// data
import { remarkOptions } from "fakeDatabase/domestic/quotation/fakeQuotRemarkList"


export default function RemarkList({ remarkListState, disabled }:
  {
    remarkListState: TuseRemarkList
    disabled: boolean
  }) {

  const { remarkList, setRemarkList,
    onChangeRemarkCreator, deleteRemark, addRemarks } = remarkListState

  // ====================================================
  const [selRemark, setSelRemark] = useState<Tremark[]>([])
  const toSelRemark = (remark: Tremark) => {
    const theIndex = selRemark.indexOf(remark)
    if (theIndex === -1) {
      selRemark.push(remark)
      setSelRemark([...selRemark])
    }
    if (theIndex > -1) {
      selRemark.splice(theIndex, 1)
      setSelRemark([...selRemark])
    }
  }
  // ====================================================
  // ModalListSelectorWithSearch
  const [showAdd, setShowAdd] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  const toShowAdd = () => setShowAdd(true)
  const onCancel = () => {
    setShowAdd(false)
    setSelRemark([])
    setSearchValue("")
  }
  const onConfirm = () => addRemarks(selRemark);
  const onSearch = (value: string) => {
    setSearchValue(value)
  }

  return (
    <div className={styleL.listContainer}>
      <p>備註</p>
      {remarkList.map((item, index) => {
        const { content } = item
        const onChange = onChangeRemarkCreator(index)
        return (
          <div key={index}>
            {disabled ?
              <span></span> :
              <IconRemoveCircle onClick={() => deleteRemark(index)} />}
            <span className={styleL.serialNumber}>{index + 1}</span>
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
          {remarkOptions.map((item, index) => {
            const { content } = item
            const isActive = (selRemark.includes(item))
            if (!content.includes(searchValue)) return null
            return (
              <CellWithBar className={styleL.cellWithBar} key={index}
                isActive={isActive}
              >
                <div className={styleL.row}
                  onClick={() => toSelRemark(item)}
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










