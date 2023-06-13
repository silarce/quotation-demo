// 公司職等職稱
// 公司職等職稱
import { CSSProperties, useState, } from "react"

const _ = require("lodash")

// layer
import SubLayer from "components/Layer/SubLayer/SubLayer"

// component
import Table_annotation from "components/page/setting/momoList/table_annotation"

// glogal gear
import PageHeader02, { TpanelList, TsearchGroup } from "components/PageHeader/PageHeader02/PageHeader02"
// import LoadingCover01 from "components/global/gear/loadingCover/loadingCover01"
// import { setRootLoading } from "components/global/gear/loadingCover/rootLoadingCover"
import myAlert from "components/global/gear/modal/simpleModal/alertModals"
import CellWithBar from "components/global/gear/cell/cellWithBar"

import SelectBar from "components/global/gear/select/selectBar/selectBar"
import InputSel from "components/global/gear/inputAndSel/inputSel"


// icon
import { IconEdit, IconCopy, IconDelete01, IconCheck02 } from "public/image/icon/svgComponent/svgIcons"

// css
import style from "./memoList.module.scss"

// type
import { TannotationDto } from "js/api/dtoTypes"

import {
  optionsCreator_prodClass,
  optionsCreator_doorType,
  optionsCreator_doorForm,
  Toption
} from "js/utils/options/options"

const optionsProdClass = optionsCreator_prodClass({ haveEmpty: true })
const optionsDoorType = optionsCreator_doorType({ haveEmpty: true })
const optionsDoorForm = optionsCreator_doorForm({ haveEmpty: true })



// ==========================================================================
export default function MemoList() {
  // const [isReady, setIsReady] = useState(false)
  // const [isLoading, setIsLoading] = useState(false)
  // const [showAdd, setShowAdd] = useState(false)
  // ------------------------------------------------------------------------
  // const { classAnnotation, newClassAnno, clearAnno, } = useClassAnnotation()
  const hookPack = useClassAnnotation()
  const { classAnnotation, newClassAnno, clearAnno, } = hookPack

  const apiReq = () => { alert("test") }


  // ------------------------------------------------------------------------


  const searchTargetList: TsearchGroup["searchTargetList"] = [
    {
      placeholder: "選擇類別",
      options: optionsProdClass
    },
    {
      placeholder: "選擇門型",
      options: optionsDoorType
    },
    {
      placeholder: "選擇形式",
      options: optionsDoorForm
    },
    {
      placeholder: "請輸入搜尋內容"
    }
  ]

  const searchGroup = {
    searchTargetList,
    doSearch: () => { }
  }


  const panelList: TpanelList = [
    { searchGroup },
    {
      type: "addButton",
      label: "新增備註",
      onClick: newClassAnno,
    },
  ]
  // ------------------------------------------------------------------------
  return (
    <SubLayer className={style.container}>
      <PageHeader02
        tag="備註列表"
        panelList={panelList}
      />

      <div >
        <Table_annotation
          hookPack={hookPack}
          apiReq={apiReq}
        />
      </div>

    </SubLayer>
  )
}


// ===================================================================================

const emptyAnnotation = {
  id: undefined,
  category: undefined,
  doorModelName: undefined,
  type: undefined,
  description: "",
}


export class Class_annotation {
  constructor(
    { reRender,
      annotation = emptyAnnotation,
      source
    }: {
      reRender: () => void
      annotation?: {
        id: string | undefined
        category: string | undefined
        doorModelName: string | undefined
        type: string | undefined
        description: string
      }
      source: "new" | "edit"
    }
  ) {
    this._reRender = reRender
    this._annotation = annotation
  } // constructor

  private _reRender
  private _annotation

  get id() { return this._annotation.id }

  get category() { return this._annotation.category }
  set category(v) { this._annotation.category = v; this._reRender() }

  get doorModelName() { return this._annotation.doorModelName }
  set doorModelName(v) { this._annotation.doorModelName = v; this._reRender() }

  get type() { return this._annotation.type }
  set type(v) { this._annotation.type = v; this._reRender() }

  get description() { return this._annotation.description }
  set description(v) { this._annotation.description = v; this._reRender() }
}

const useClassAnnotation = () => {

  const [render, setRender] = useState(0)
  const reRender = () => { setRender(state => ++state) }
  const [classAnnotation, setClassAnnotation] = useState<Class_annotation>()

  const newClassAnno = () => {
    const theClass = new Class_annotation({ reRender, source: "new" })
    setClassAnnotation(theClass)
  }

  const editClassAnno = (annotation: TannotationDto) => {
    const theClass = new Class_annotation({ reRender, annotation, source: "edit" })
    setClassAnnotation(theClass)
  }

  const clearAnno = () => {
    setClassAnnotation(undefined)
  }

  return {
    classAnnotation,
    newClassAnno,
    editClassAnno,
    clearAnno,
  }

}

export type TuseClassAnnotation = typeof useClassAnnotation


// =========================================================================



