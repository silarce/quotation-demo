import { useState, createContext } from "react"
import classNames from "classnames"
import _ from "lodash"
import Image from "next/image"

// gear
import CellWithBar from "components/global/gear/cell/cellWithBar"
import InputSel from "components/global/gear/inputAndSel/inputSel"
import myAlert from "components/global/gear/modal/simpleModal/alertModals"

// css
import scss from "./table_annotation.module.scss"

// options
import { optionsCreator_category, optionsCreator_doorModel, optionsCreator_doorForm } from "js/utils/options/productOptions"

// icon
import { IconEdit, IconCopy, IconDelete01 } from "public/image/icon/svgComponent/svgIcons"
import iconCheck from "public/image/icon/check02.svg"
import iconCross from "public/image/icon/cross_thin.svg"

// type
import { TannotationDto, TcreateAnnotationDto } from "js/api/dtoTypes"
import { Toption } from "js/utils/options/options"
import { Class_annotation } from "pages/setting/annotationList"
import { TuseClassAnnotation } from "pages/setting/annotationList"

// =======================================================================
const optionArr_category = optionsCreator_category()
const optionArr_doorModel = optionsCreator_doorModel()
const optionArr_doorForm = optionsCreator_doorForm()

// =======================================================================
export default function Table_annotation(
  {
    annotationArr,
    hookPack,
    apiReq,
  }:
    {
      annotationArr: TannotationDto[] | undefined
      hookPack: ReturnType<TuseClassAnnotation>
      apiReq: (method: "post" | "patch" | "delete", delId?: string) => void
    }
) {

  const { classAnnotation, clearAnno, editClassAnno, copyClassAnno } = hookPack

  return (
    <div className={scss.table}>
      <Thead />
      <div className={scss.tbodyWrapper}>
        {classAnnotation?.source === "new" &&
          <EditRow className={scss.editRow_add}
            classAnnotation={classAnnotation}
            cancel={clearAnno}
            confirm={() => apiReq("post")}
          />
        }
        <BodyRowGroup annotationArr={annotationArr}
          editClassAnno={editClassAnno}
          classAnnotation={classAnnotation}
          clearAnno={clearAnno}
          apiReq={apiReq}
          copyClassAnno={copyClassAnno}
        />
      </div>
    </div>
  )
}

// ===========================================================================
const Thead = () => {
  return (
    <div className={classNames(scss.row, scss.thead)}>
      {headKeyArr.map(key => {
        const { label, className } = config[key]
        return (
          <div key={key} className={classNames(className)}>
            <span>{label}</span>
          </div>
        )
      })}
    </div>
  )
}

const EditRow = (
  { classAnnotation, cancel, confirm, className }:
    {
      classAnnotation?: Class_annotation
      cancel: () => void
      confirm: () => void
      className?: string
    }
) => {


  if (!classAnnotation) return null
  return (
    <CellWithBar isActive={true} className={classNames(scss.row, scss.editRow, className)}>
      {addKeyArr.map(key => {
        const { className, optionArr } = config[key]
        return (
          <div key={key} className={classNames(className)}>
            {(() => {
              if (optionArr) return (
                <InputSel
                  selectProps={{
                    value: classAnnotation[key],
                    options: optionArr,
                    onChange: (option) => { classAnnotation[key] = option!.value },
                    arrowType: "black",
                    fontSize: "16px"
                  }}
                />
              )
              return (
                <InputSel
                  textareaProps={{
                    value: classAnnotation[key] ?? "",
                    onChange: (v) => { classAnnotation[key] = v },
                    className: scss.inputSel_textarea
                  }}
                />
              )
            })()}

          </div>
        )
      })}
      <Image className={config.confirm.className} src={iconCheck} alt="確認"
        onClick={confirm}
      />
      <Image className={config.cancel.className} src={iconCross} alt="取消"
        onClick={cancel}
      />
    </CellWithBar>
  )
}

const BodyRowGroup = (
  {
    annotationArr,
    editClassAnno,
    classAnnotation,
    clearAnno,
    apiReq,
    copyClassAnno,
  }:
    {
      annotationArr: TannotationDto[] | undefined
      editClassAnno: (annotation: TannotationDto) => void
      classAnnotation: Class_annotation | undefined
      clearAnno: () => void
      apiReq: (method: "post" | "patch" | "delete", delId?: string) => void
      copyClassAnno: (annotation: TannotationDto) => void
    }
) => {
  const annotaionLookup = _.groupBy(annotationArr, "category")
  const keyArr = Object.keys(annotaionLookup)
  return (
    <div className={scss.tbody}>
      {keyArr.map((annKey) => {
        const arr = annotaionLookup[annKey]
        return (
          <div className={scss.bodyRowGroup} key={annKey}>
            <div className={classNames(scss.row, scss.rowTitle)}><span>{annKey}</span></div>
            {arr.map((ann,) => {
              const { id, doorModelName, type, description, } = ann

              if (classAnnotation?.id === id && classAnnotation.source === "edit") return (
                <EditRow classAnnotation={classAnnotation}
                  cancel={clearAnno}
                  confirm={() => apiReq("patch")}
                />
              )

              return (
                <CellWithBar key={id} className={classNames(scss.row, scss.item)}>
                  <div className={config["category"].className}></div>
                  <div className={config["doorModelName"].className}><span>{doorModelName}</span></div>
                  <div className={config["type"].className}><span>{typeLookup[type]}</span></div>
                  <div className={config["description"].className}><span>{description}</span></div>
                  <div className={config["edit"].className}
                    onClick={() => editClassAnno(ann)}
                  ><IconEdit /></div>
                  <div className={config["copy"].className}
                    onClick={() => copyClassAnno(ann)}
                  ><IconCopy /></div>
                  <div className={config["del"].className}
                    onClick={() => myAlert.confirm({
                      title: "確定刪除備註?",
                      content: description,
                      props: {
                        onOk: () => apiReq("delete", id)
                      }
                    })}
                  ><IconDelete01 /></div>
                </CellWithBar>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

// ===========================================================================

type Tconfig = {
  readonly [key: string]: {
    readonly label?: string
    readonly className?: string
    readonly optionArr?: Toption[]
  }
}

const config: Tconfig = {
  category: {
    label: "類別",
    className: "w-[156px] flex-none",
    optionArr: optionArr_category,
  },
  doorModelName: {
    label: "門型",
    className: "w-[86px] flex-none",
    optionArr: optionArr_doorModel,
  },
  type: {
    label: "形式",
    className: "w-[64px] flex-none",
    optionArr: optionArr_doorForm,
  },
  description: {
    label: "內容",
    className: "w-auto flex-auto",
  },
  edit: {
    className: "w-[20px] flex-none",
  },
  copy: {
    className: "w-[20px] flex-none",
  },
  del: {
    className: "w-[20px] flex-none",
  },
  confirm: {
    className: "w-[20px] flex-none",
  },
  cancel: {
    className: "w-[20px] flex-none",
  },
}

const headKeyArr = [
  "category", "doorModelName", "type", "description",
] as const

const bodyKeyArr = [
  "category", "doorModelName", "type", "description",
  "edit", "copy", "del"
] as const

const addKeyArr = [
  "category", "doorModelName", "type", "description",
] as const


// =============================================================================
const typeLookup = {
  "normal": "一般",
  "anti-typhoon": "防颱"
} as const

// =============================================================================



