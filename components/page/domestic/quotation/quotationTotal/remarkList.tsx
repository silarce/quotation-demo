import { useState } from "react"

// global gear
import ModalListSelectorWithSearch from "components/global/gear/modal/modalListSelectorWithSearch"
import CellWithBar from "components/global/gear/cell/cellWithBar"
import Input03 from "components/global/gear/input/input03"
import myAlert from "components/global/gear/modal/simpleModal/alertModals"

// icon
import { IconAddCircle, IconRemoveCircle } from "public/image/icon/svgComponent/svgIcons"

// css
import styleL from "./local.module.scss"


export default function RemarkList(
  {
    stringObj,
    alternateArr,
    searchAlternate,
    label,
    disabled }:
    {
      stringObj: {
        stringArr: string[]
        editString: (index: number, v: string) => void
        addString: (v: string | string[]) => void
        delString: (index: number) => void
      }
      alternateArr: string[]
      searchAlternate: (v: string) => void
      label: string
      disabled: boolean
    }) {

  const {
    stringArr,
    editString,
    addString,
    delString,
  } = stringObj


  // ====================================================
  const [selRemark, setSelRemark] = useState<string[]>([])
  const toSelRemark = (remark: string) => {
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

  const toShowAdd = () => setShowAdd(true)
  const onCancel = () => {
    setShowAdd(false)
    setSelRemark([])
    searchAlternate("")
  }

  const onConfirm = () => {
    if (!selRemark[0]) return myAlert.info({ title: "請選擇"+label })
    addString(selRemark);
  }

  return (
    <div className={styleL.listContainer}>
      <p>{label}</p>
      {stringArr.map((memo, index) => {
        return (
          <div key={index}>
            {disabled ?
              <span></span> :
              <IconRemoveCircle onClick={() => delString(index)} />}
            <span className={styleL.serialNumber}>{index + 1}</span>
            <Input03 {...{
              stateValue: memo,
              onChange: (e) => editString(index, e.target.value),
              placeholder: "請輸入"+label,
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
      <ModalListSelectorWithSearch
        label={`請選擇${label}`}
        visible={showAdd}
        onCancel={onCancel}
        onConfirm={onConfirm}
        onSearch={searchAlternate}
      >
        <div className={styleL.addModalBody}>
          {alternateArr.map((item, index) => {
            const content = item
            const isActive = (selRemark.includes(item))
            return (
              <CellWithBar className={styleL.cellWithBar} key={index}
                isActive={isActive}
              >
                <div className={styleL.row}
                  onClick={() => toSelRemark(item)}>
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










