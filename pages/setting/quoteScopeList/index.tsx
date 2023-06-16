// 公司職等職稱
// 公司職等職稱
import { useState, } from "react"

const _ = require("lodash")

// layer
import SubLayer from "components/Layer/SubLayer/SubLayer"

// component
import Table_annotation from "components/page/setting/quoteScopeList/table_quoteScopes"

// glogal gear
import PageHeader02, { TpanelList, TsearchGroup } from "components/PageHeader/PageHeader02/PageHeader02"
// import LoadingCover01 from "components/global/gear/loadingCover/loadingCover01"
// import { setRootLoading } from "components/global/gear/loadingCover/rootLoadingCover"
import myAlert from "components/global/gear/modal/simpleModal/alertModals"

// css
import style from "./quoteScopeList.module.scss"

// type
import { TannotationDto } from "js/api/dtoTypes"
import { Tparams } from "js/api/dtoTypes"

import {
  optionsCreator_prodClass,
  optionsCreator_doorType,
  optionsCreator_doorForm,
  Toption
} from "js/utils/options/options"

const optionsProdClass = optionsCreator_prodClass({ haveEmpty: true })
const optionsDoorType = optionsCreator_doorType({ haveEmpty: true })
const optionsDoorForm = optionsCreator_doorForm({ haveEmpty: true })

type Tfilter = Partial<Pick<TannotationDto, "category" | "doorModelName" | "type" | "description">>

// ==========================================================================
export default function MemoList() {
  // const [isReady, setIsReady] = useState(false)
  // const [isLoading, setIsLoading] = useState(false)
  // const [showAdd, setShowAdd] = useState(false)
  // ------------------------------------------------------------------------
  // const { classAnnotation, newClassAnno, clearAnno, } = useClassAnnotation()



  const [filter, setFilter] = useState<Tfilter>({
    category: undefined,
    doorModelName: undefined,
    type: undefined,
    description: undefined,
  })


  const params: Tparams = {
    filter: {
      category: { "$eq": filter.category },
      doorModelName: { "$eq": filter.doorModelName },
      type: { "$eq": filter.type },
      description: { "$eq": filter.description },
    }
  }


  const hookPack = useClassAnnotation()
  const { newClassAnno, } = hookPack

  const apiReq = (method: "post" | "patch" | "delete") => {
    alert("test")
  }

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

  const doSearch: TsearchGroup["doSearch"] = (arr) => {
    const category = (arr[0] as Toption).value
    const doorModelName = (arr[1] as Toption).value
    const type = (arr[2] as Toption).value as Tfilter["type"]
    const description = arr[3] as string
    setFilter({ category, doorModelName, type, description, })
  }

  const searchGroup: TsearchGroup = {
    searchTargetList,
    doSearch
  }

  const panelList: TpanelList = [
    { searchGroup },
    {
      type: "addButton",
      label: "新增報價範圍",
      onClick: newClassAnno,
    },
  ]
  // ------------------------------------------------------------------------
  return (
    <SubLayer className={style.container}>
      <PageHeader02
        tag="報價範圍列表"
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
    this.source = source
  } // constructor

  private _reRender
  private _annotation
  source

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

  const copyClassAnno = (annotation: TannotationDto) => {
    const theClass = new Class_annotation({ reRender, annotation, source: "new" })
    setClassAnnotation(theClass)
  }

  const clearAnno = () => {
    setClassAnnotation(undefined)
  }

  return {
    classAnnotation,
    newClassAnno, editClassAnno, clearAnno, copyClassAnno,
  }

}

export type TuseClassAnnotation = typeof useClassAnnotation


// =========================================================================



