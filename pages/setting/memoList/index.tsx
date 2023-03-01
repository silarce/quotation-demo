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
import SelectBar, { TselectProps } from "components/global/gear/select/selectBar/selectBar"


// icon
import { IconEdit, IconCopy, IconDelete01, IconCheck02 } from "public/image/icon/svgComponent/svgIcons"

// css
import style from "./memoList.module.scss"


// fake
import {
  optionsCreator_prodClass,
  optionsCreator_doorType,
  optionsCreator_doorForm,
  Toption
} from "fakeDatabase/options/options"
const optionsProdClass = optionsCreator_prodClass()
const optionsDoorType = optionsCreator_doorType()
const optionsDoorForm = optionsCreator_doorForm()

type TmemoState = {
  list: MemoClass[]
}

// ==========================================================================
export default function MemoList() {
  const [isReady, setIsReady] = useState(false)
  const [editable, setEditable] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  // ------------------------------------------------------------------------
  const [memoState, setMemoState] = useState<TmemoState>({ list: [] })

  useEffect(() => {
    if (memoState.list.length !== 0) return
    fakeMomoListOri().forEach((memo, index) => {
      const newMemo = new MemoClass({
        memo,
        memoList: memoState.list,
        setMemoState: setMemoState,
      })
      memoState.list.push(newMemo)
    })
    setMemoState({ ...memoState })
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
      label: "新增備註",
      onClick: () => {
        const newMemo = new MemoClass({
          memo: "",
          memoList: memoState.list,
          setMemoState: setMemoState,
        })
        memoState.list.unshift(newMemo)
        setSearchValue("")
        setMemoState({ ...memoState })
      }
    },
  ]
  // ------------------------------------------------------------------------
  const [prodClass, setProdClass] = useState<TselectProps["value"]>(null)
  const [doorType, setDoorType] = useState<TselectProps["value"]>(null)
  const [doorForm, setDoorForm] = useState<TselectProps["value"]>(null)

  const selectPropsArr: TselectProps[] = [
    {
      value: prodClass,
      options: optionsProdClass,
      onChange: (option: Toption | null) => { setProdClass(option?.value) },
      placeholder: "選擇類別",
      boxStyle: { width: "200px" }
    },
    {
      value: doorType,
      options: optionsDoorType,
      onChange: (option: Toption | null) => { setDoorType(option?.value) },
      placeholder: "選擇門型",
      boxStyle: { width: "145px" }
    },
    {
      value: doorForm,
      options: optionsDoorForm,
      onChange: (option: Toption | null) => { setDoorForm(option?.value) },
      placeholder: "選擇形式",
      boxStyle: { width: "145px" }
    },
  ]

  // ------------------------------------------------------------------------
  return (
    <div className={style.container}>
      <PageHeader02
        tag="備註列表"
        panelList={panelList}
      />

      <div className={style.mainContainer}>
        <div>
          <SelectBar selectPropsArr={selectPropsArr} />
        </div>
        <div className={style.memoList}>
          {memoState.list.map((item, index) => {
            const {
              memo, editable,
              copy, changeEditable, deleteThis, onChange
            } = item

            // 與搜尋功能
            const regex = new RegExp(searchValue)
            if (!regex.test(memo)) return null

            return (
              <CellWithBar className={style.row} key={index}
                isActive={editable}
              >
                <div className={style.index}><span>{index + 1}</span></div>
                <div className={style.input}>
                  <Input02 className={style.input03}
                    stateValue={memo}
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

class MemoClass {
  memo: string
  setMemoState: Dispatch<SetStateAction<TmemoState>>
  rerender: () => void
  memoList: MemoClass[] = []
  editable = false

  constructor(
    { memo,
      memoList,
      setMemoState,
    }:
      {
        memo: string
        memoList: MemoClass[]
        setMemoState: Dispatch<SetStateAction<TmemoState>>
      }
  ) {
    this.memo = memo
    this.memoList = memoList
    this.setMemoState = setMemoState
    this.rerender = () => {
      setMemoState(state => ({ ...state }))
    }
  }

  copy = () => {
    const copy = new MemoClass({
      memo: this.memo,
      memoList: this.memoList,
      setMemoState: this.setMemoState,
    })
    this.memoList.unshift(copy)
    this.rerender()
  }

  changeEditable = (v?: boolean) => {
    this.memoList.forEach((other, index, arr) => {
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
      const index = this.memoList.findIndex((item) => item === this)
      this.memoList.splice(index, 1)
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
  "防颱型捲門含防颱底座鎖固*1個、檔輪、鋁合金障感器及遙控器(1:2),捲箱2面0.8t。",
  "抗風壓結構計算技師簽證費用、材料檢驗費用、防颱中柱、高空作業自動防火連動操作裝置、前遮板、矽利康、懸吊系統、門框補強立柱、收邊料,單價另計。",
  "很長的備註很長的備註很長的備註很長的備註很長的備註很長的備註很長的備註很長的備註很長的備註很長的備註很長的備註很長的備註很長的備註很長的備註很長的備註很長的備註很長的備註很長的備註很長的備註很長的備註很長的備註很長的備註很長的備註",
  "防颱型捲門含防颱底座鎖固*1個、檔輪、鋁合金障感器及遙控器(1:2),捲箱2面0.8t。",
  "防颱型捲門含防颱底座鎖固*1個、檔輪、鋁合金障感器及遙控器(1:2),捲箱2面0.8t。",
  "防颱型捲門含防颱底座鎖固*1個、檔輪、鋁合金障感器及遙控器(1:2),捲箱2面0.8t。",
  "防颱型捲門含防颱底座鎖固*1個、檔輪、鋁合金障感器及遙控器(1:2),捲箱2面0.8t。",
  "防颱型捲門含防颱底座鎖固*1個、檔輪、鋁合金障感器及遙控器(1:2),捲箱2面0.8t。",
  "防颱型捲門含防颱底座鎖固*1個、檔輪、鋁合金障感器及遙控器(1:2),捲箱2面0.8t。",
  "防颱型捲門含防颱底座鎖固*1個、檔輪、鋁合金障感器及遙控器(1:2),捲箱2面0.8t。",
  "防颱型捲門含防颱底座鎖固*1個、檔輪、鋁合金障感器及遙控器(1:2),捲箱2面0.8t。",
  "防颱型捲門含防颱底座鎖固*1個、檔輪、鋁合金障感器及遙控器(1:2),捲箱2面0.8t。",
  "防颱型捲門含防颱底座鎖固*1個、檔輪、鋁合金障感器及遙控器(1:2),捲箱2面0.8t。",
  "防颱型捲門含防颱底座鎖固*1個、檔輪、鋁合金障感器及遙控器(1:2),捲箱2面0.8t。",
  "防颱型捲門含防颱底座鎖固*1個、檔輪、鋁合金障感器及遙控器(1:2),捲箱2面0.8t。",
  "防颱型捲門含防颱底座鎖固*1個、檔輪、鋁合金障感器及遙控器(1:2),捲箱2面0.8t。",
]







