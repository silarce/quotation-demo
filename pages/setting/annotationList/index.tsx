import { useState, useEffect } from "react"
import classNames from "classnames"
import _ from "lodash"

// layer
import SubLayer from "components/Layer/SubLayer/SubLayer"
import LoadingCover01 from "components/global/gear/loadingCover/loadingCover01"

// component
import Table_annotation from "components/page/setting/annotationList/table_annotation"

// glogal gear
import PageHeader02, { TpanelList, TsearchGroup } from "components/PageHeader/PageHeader02/PageHeader02"
import myAlert from "components/global/gear/modal/simpleModal/alertModals"

// css
import scss from "./annotationList.module.scss"

// api
import {
  useGetAnnotation,
  apiPostAnnotation, apiPatchAnnotation, apiDeleteAnnotation,
} from "js/api/api_workSheet"

// type
import { TannotationDto } from "js/api/dtoTypes"
import { Tparams } from "js/api/dtoTypes"

// other
import {
  Toption,
  optionsCreator_category,
  optionsCreator_doorModel,
  optionsCreator_doorForm
} from "js/utils/options/productOptions"

// ==========================================================================
const optionsCategory = optionsCreator_category({ haveEmpty: true })
const optionsDoorModel = optionsCreator_doorModel({ haveEmpty: true })
const optionsDoorForm = optionsCreator_doorForm({ haveEmpty: true })

type Tfilter = Partial<Pick<TannotationDto, "category" | "doorModelName" | "type" | "description">>

// ==========================================================================
export default function MemoList() {
  const [isLoading, setIsLoading] = useState(false)
  // ------------------------------------------------------------------------
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
  const {
    annotationArr,
    update_anno,
  } = useGetAnnotation(params)

  useEffect(() => {
    update_anno()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const hookPack = useClassAnnotation()
  const { classAnnotation, newClassAnno, clearAnno } = hookPack

  const apiReq = async (method: "post" | "patch" | "delete", delId?: string) => {

    let id: undefined | string = undefined
    let body: undefined | Parameters<typeof apiPostAnnotation>[0]["body"] = undefined

    if (method !== "delete") {
      if (!classAnnotation) return
      let { id: classId, apiBody, } = classAnnotation
      const { category, doorModelName, type, description, } = apiBody
      if (!category) return myAlert.warning({ title: "請選擇類型" })
      if (!doorModelName) return myAlert.warning({ title: "請選擇門型" })
      if (!type) return myAlert.warning({ title: "請選擇形式" })
      id = classId
      body = { category, doorModelName, type, description, }
    }

    try {
      setIsLoading(true)

      const apiReq = (() => {
        if (method === "post") return () => apiPostAnnotation({ body: body! })
        if (method === "patch") return () => apiPatchAnnotation({ body: body!, id: id! })
        if (method === "delete") return () => apiDeleteAnnotation({ id: delId! })
      })()
      await apiReq?.()
      await update_anno()
      clearAnno()
    }
    catch (err) {
      myAlert.err({ title: "上傳失敗" })
    }
    setIsLoading(false)
  }

  // ------------------------------------------------------------------------


  const searchTargetList: TsearchGroup["searchTargetList"] = [
    {
      placeholder: "選擇類別",
      options: optionsCategory
    },
    {
      placeholder: "選擇門型",
      options: optionsDoorModel
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
      label: "新增備註",
      onClick: newClassAnno,
    },
  ]
  // ------------------------------------------------------------------------
  return (
    <SubLayer className={scss.container} bodyClassName={classNames(scss.subLayer, scss.plus)}>
      <PageHeader02
        tag="備註列表"
        panelList={panelList}
      />
      <Table_annotation
        annotationArr={annotationArr}
        hookPack={hookPack}
        apiReq={apiReq}
      />
      <LoadingCover01 isLoading={isLoading} />
    </SubLayer>
  )
}
// ==========================================================================
const emptyAnnotationCre = () => ({
  id: undefined,
  category: undefined,
  doorModelName: undefined,
  type: undefined,
  description: "",
})

export class Class_annotation {
  constructor(
    { reRender,
      annotation = emptyAnnotationCre(),
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

  get apiBody() {
    return {
      category: this.category ?? "",
      doorModelName: this.doorModelName ?? "",
      type: this.type as "normal" | "anti-typhoon" | "",
      description: this.description ?? "",
    }
  }
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
    const copy = _.cloneDeep(annotation)
    const theClass = new Class_annotation({ reRender, annotation:copy, source: "edit" })
    setClassAnnotation(theClass)
  }

  const copyClassAnno = (annotation: TannotationDto) => {
    const copy = _.cloneDeep(annotation)
    const theClass = new Class_annotation({ reRender, annotation: copy, source: "new" })
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

