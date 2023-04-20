// 公司職等職稱
// 公司職等職稱
import { useState, } from "react"

const _ = require("lodash")

// glogal gear
import PageHeader02, { TpanelList } from "components/PageHeader/PageHeader02/PageHeader02"
// import LoadingCover01 from "components/global/gear/loadingCover/loadingCover01"
// import { setRootLoading } from "components/global/gear/loadingCover/rootLoadingCover"
import myAlert from "components/global/gear/modal/simpleModal/alertModals"
import CellWithBar from "components/global/gear/cell/cellWithBar"

import SelectBar from "components/global/gear/select/selectBar/selectBar"
import InputSel from "components/global/gear/inputAndSel/inputSel"


// icon
import { IconEdit, IconCopy, IconDelete01, IconCheck02 } from "public/image/icon/svgComponent/svgIcons"

// css
import style from "./quoteRangeList.module.scss"


// fake
import { fakeApi_quoteRange } from "fakeDatabase/fakeAPI/fakeQuoteRangeApi"
import {
  optionsCreator_prodClass,
  optionsCreator_doorType,
  // optionsCreator_doorForm,
  Toption
} from "fakeDatabase/options/options"
const optionsProdClass = optionsCreator_prodClass({ haveEmpty: true })
const optionsDoorType = optionsCreator_doorType({ haveEmpty: true })
// const optionsDoorForm = optionsCreator_doorForm()



// ==========================================================================
export default function MemoList() {
  // const [isReady, setIsReady] = useState(false)
  // const [isLoading, setIsLoading] = useState(false)
  // const [showAdd, setShowAdd] = useState(false)
  // ------------------------------------------------------------------------
  const [fakeMemoArrState, setFakeMemoArrState] = useState({ wrapper: fakeApi_quoteRange })
  const reRender = () => {
    setFakeMemoArrState(state => ({ ...state }))
  }
  const memoFakeApi = fakeMemoArrState.wrapper

  // ------------------------------------------------------------------------
  const [editableId, setEditableId] = useState(-1)
  const [tempMemo, setTempMemo] = useState("")

  // ------------------------------------------------------------------------
  const [prodClass, setProdClass] = useState("")
  const [doorType, setDoorType] = useState("")
  const [searchValue, setSearchValue] = useState("")
  const toSearch = (v: string) => setSearchValue(v)


  const selectPropsArr = [
    {
      selectProps: {
        value: prodClass,
        options: optionsProdClass,
        onChange: (option: Toption | null) => {
          if (typeof option?.value === "string")
            setProdClass(option?.value)
        },
      },
      placeholder: "選擇類別",
      boxStyle: { width: "200px" }
    },
    {
      selectProps: {
        value: doorType,
        options: optionsDoorType,
        onChange: (option: Toption | null) => {
          if (typeof option?.value === "string")
            setDoorType(option?.value)
        },
      },
      placeholder: "選擇門型",
      boxStyle: { width: "145px" }
    },
  ]
  const filter = {
    prodClass: [prodClass],
    doorType: [doorType],
    content: searchValue
  }

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
        memoFakeApi.post({
          prodClass: ["防火防煙捲門系列"],
          doorType: ["SJ-302"],
          content: "",
        })
        reRender()
      }
    },
  ]
  // ------------------------------------------------------------------------
  return (
    <div className={style.container}>
      <PageHeader02
        tag="報價範圍列表"
        panelList={panelList} />

      <div className={style.mainContainer}>
        <div>
          <SelectBar selectPropsArr={selectPropsArr} />
        </div>
        <div className={style.quoteRangeList}>
          {memoFakeApi.get(filter).reverse().map((item, index) => {
            const { id, prodClass, doorType, content, } = item
            const idEditable = editableId === id
            const theContent = idEditable ? tempMemo : content
            const toEdit = () => {
              setEditableId(id)
              setTempMemo(content)
            }
            const confirmEdit = () => {
              setEditableId(-1)
              memoFakeApi.put(
                id,
                { prodClass, doorType, content: tempMemo, }
              )
              // item.content = tempMemo;
              reRender()
              setTempMemo("")
            }
            const onChange = (v: string) => {
              setTempMemo(v)
            }
            const onCopy = () => {
              memoFakeApi.post({ prodClass, doorType, content })
              reRender()
            }
            const onDelete = () => {
              const delFun = () => {
                memoFakeApi.delete(id)
                reRender()
              }
              myAlert.confirm({
                title: "確定刪除這個報價範圍?",
                props: {
                  onOk: delFun,
                }
              })
            }

            return (
              <CellWithBar className={style.row} key={index}
                isActive={idEditable}              >
                <div className={style.index}><span>{index + 1}</span></div>
                <div className={style.input}>
                  <InputSel className={style.input03}
                    label=""
                    gap="0"
                    disabled={!idEditable}
                    textareaProps={{
                      value: theContent,
                      onChange: onChange,
                    }}
                  />
                </div>
                <div className={style.icon}>
                  {idEditable
                    ? <IconCheck02 onClick={confirmEdit} />
                    : <IconEdit onClick={toEdit} />}
                </div>
                <div className={style.icon}>
                  <IconCopy onClick={onCopy} />
                </div>
                <div className={style.icon}>
                  <IconDelete01 onClick={onDelete} />
                </div>
              </CellWithBar>
            )
          })}
        </div>
      </div>
    </div>
  )
}

