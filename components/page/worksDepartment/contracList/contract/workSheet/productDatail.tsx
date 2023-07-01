
import { useMemo } from "react";

import { Control, Controller } from "react-hook-form";
import classNames from "classnames";
import _ from "lodash"


// gear
import InputSel, { TselectProps, TcheckProps, }
  from "components/global/gear/inputAndSel/inputSel";

import { OptionWithIcon01 } from "components/global/gear/select/optionWithIcon";
import { SingleValueWithIcon01 } from "components/global/gear/select/singleValueWithIcon";


import MyButton_v2 from "components/global/gear/button/myButton_v2";


import scss from './productDetail.module.scss'
// other
import { Toption } from "js/utils/options/options";
import { optionsCre_doorTrack_normal } from "js/utils/options/doorTrackOptions";
// fake
import { TfakeworkSheet } from "pages/worksDepartment/contractList/contract/workSheet";

// ============================================================================
const option_doorTrack_normal = optionsCre_doorTrack_normal()


// ============================================================================
export default function WorkSheetProductDetail(
  { control, fakeWorkSheet_ori, disabled, }:
    {
      control: Control<TfakeworkSheet, any>
      fakeWorkSheet_ori: TfakeworkSheet
      disabled: boolean
    }
) {


  return (
    <div className={scss.container}>

      <p>合約產品項目：</p>

      <div className={scss.left}>
        {configArr_left.map((item) => {
          const { key: pKey, label, list } = item
          return (
            <Item key={pKey}
              pKey={pKey}
              label={label}
              list={list}
              control={control}
              disabled={disabled}
            />
          )
        })}
      </div> {/* left */}



      <div className={scss.right}>
        {configArr_right.map((item) => {
          const { key: pKey, label, list } = item
          return (
            <Item key={pKey}
              pKey={pKey}
              label={label}
              list={list}
              control={control}
              disabled={disabled}
            />
          )
        })}
      </div> {/* right */}

    </div>
  )
}

// ==================================================================
// ==================================================================
// ==================================================================
// ==================================================================
// ==================================================================
// ==================================================================


const Item = (
  { pKey, label, list, control, disabled }:
    {
      pKey: string
      label: string
      list: Tconfig["list"]
      control: Control<TfakeworkSheet, any>
      disabled: boolean
    }
) => {


  return (
    <div className={scss.item}>
      <p className={scss.sutTitle}>
        {label}
        {pKey === "support" && <span>馬達荷重(max:500,min:600),馬力數:2Hp</span>}
      </p>
      <div className={scss.list}>
        {list.map((item) => {
          const { key: cKey, module,
            label, placeholder, className,
            options, checkBarPropsListCre,
          } = item
          return (
            <Controller key={cKey}
              // @ts-ignore
              name={`${pKey}.${cKey}`}
              control={control}
              render={({ field }) => {
                let selectProps: TselectProps | undefined = undefined
                let checkProps: TcheckProps | undefined = undefined

                const { value, onChange } = field

                if (module === "select") {
                  selectProps = {
                    value: value as string,
                    onChange,
                    options: options ?? [],
                    selClassNames: {
                      singleValue: (state) => { return scss.selSingleValue },
                      option: (state) => { return scss.selSingleValue }
                    },
                    arrowType: "black",
                  }
                  if (cKey === "doorTrackName") {
                    selectProps = {
                      ...selectProps,
                      customComponents: {
                        Option: (props) => OptionWithIcon01(props, {
                          showLabel: false,
                          className: scss.selSingleValue_custom,
                        }),
                        SingleValue: (props) => SingleValueWithIcon01(props, {
                          showLabel: false,
                          className: scss.selSingleValue_custom,
                        }),
                      }
                    }
                  }
                }

                if (module === "checkBar") {
                  const checkBarPropsList = checkBarPropsListCre!()
                  if (value === false && "false" in checkBarPropsList) {
                    checkBarPropsList["false"].value = true
                  }
                  if (value === true && "true" in checkBarPropsList) {
                    checkBarPropsList["true"].value = true
                  }
                  const objArr = Object.values(checkBarPropsList)
                  if (objArr[objArr.length - 3]) objArr[objArr.length - 3].style = { width: "45px" }
                  if (objArr[objArr.length - 2]) objArr[objArr.length - 2].style = { width: "100px" }
                  if (objArr[objArr.length - 1]) objArr[objArr.length - 1].style = { width: "80px" }
                  checkProps = {
                    propsList: {
                      ...checkBarPropsList,
                    },
                    isRadio: true,
                    onChange: (arr) => {
                      const keyArr = Object.keys(arr)
                      let value: string | boolean = ""
                      keyArr.forEach((key) => {
                        if (arr[key]) value = key
                      })
                      if (value === "false") value = false
                      if (value === "true") value = true
                      field.onChange(value)
                    }
                  }
                }

                return (
                  <InputSel className={classNames(
                    { [scss.inputSel_big]: cKey === "doorTrackName" },
                    className
                  )}
                    label={label}
                    selectProps={selectProps}
                    checkProps={checkProps}
                    captionColor="main" captionWidth={captionWidth}
                    disabled={disabled} showBaseline="always" />
                )
              }
              } />
          )
        })}
      </div>
    </div>
  )
}

// ==================================================================
// ==================================================================
// ==================================================================
const captionWidth = "100px"


const fakeOption_material: Toption[] = [
  { value: "304#", label: "SST 304# (2B 霧面)" },
  { value: "305#", label: "SST 305# (2A 平面)" },
  { value: "306#", label: "SST 306# (3C 霧面)" },
]

const fakeOption_size: Toption[] = [
  { value: "5", label: '5"' },
  { value: "6", label: '6"' },
  { value: "7", label: '7"' },
  { value: "8", label: '8"' },
]

const fakeOption_thickness: Toption[] = [
  { value: "0.4", label: "0.4T" },
  { value: "0.6", label: "0.6T" },
  { value: "0.8", label: "0.8T" },
  { value: "1.0", label: "1.0T" },
  { value: "1.2", label: "1.2T" },
]

const fakeOption_reelBoxType: Toption[] = [
  { value: "rollBox", label: "捲箱" },
  { value: "Chassis", label: "機箱" },
  { value: "rollBoxAndChassis", label: "捲箱+機箱" },
]
const fakeOption_bearing: Toption[] = [
  { value: "6208", label: "6208#" },
  { value: "1251", label: "1251#" },
  { value: "356", label: "356#" },
]

const fakeOption_chain: Toption[] = [
  { value: "640", label: "640#" },
  { value: "580", label: "580#" },
  { value: "455", label: "455#" },
]

const fakeOption_horsepower: Toption[] = [
  { value: "0.25", label: "1/4HP" },
  { value: "0.5", label: "1/2HP" },
  { value: "1", label: "1HP" },
  { value: "1.5", label: "1 1/2HP" },
]

const fakeOption_manufacturer: Toption[] = [
  { value: "大同", label: "大同" },
  { value: "士林電機", label: "士林電機" },
  { value: "東元", label: "東元" },
]

const fakeOption_powerSupply: Toption[] = [
  { value: "單相", label: "單相" },
  { value: "三相", label: "三相" },
]

const fakeOption_voltage: Toption[] = [
  { value: "110V", label: "110V" },
  { value: "220V", label: "220V" },
]



// --------------------------------
const checkBarPropsList_boolean = (): TcheckProps["propsList"] => ({
  "false": { value: false, label: "無", },
  "true": { value: false, label: "有", },
})

const checkBarPropsListCre_surface = (): TcheckProps["propsList"] => ({
  "無": { value: false, label: "無", },
  "一般烤": { value: false, label: "一般烤", },
  "氟烤": { value: false, label: "氟烤", },
})
const checkBarPropsListCre_front = (): TcheckProps["propsList"] => ({
  "無": { value: false, label: "無", },
  "正雲白": { value: false, label: "正雲白", },
  "正乳白": { value: false, label: "正乳白", },
})

const checkBarPropsListCre_bastType = (): TcheckProps["propsList"] => ({
  "無": { value: false, label: "無", },
  "鋁障感型": { value: false, label: "鋁障感型", },
  "止水型": { value: false, label: "止水型", },
})

const checkBarPropsListCre_chainType = (): TcheckProps["propsList"] => ({
  "單排": { value: false, label: "單排", },
  "雙排": { value: false, label: "雙排", },
})

const checkBarPropsListCre_lockBox = (): TcheckProps["propsList"] => ({
  "外露式": { value: false, label: "外露式", },
  "防盜式": { value: false, label: "防盜式", },
})

const checkBarPropsListCre_doorTrackType = (): TcheckProps["propsList"] => ({
  "直": { value: false, label: "直", },
  "彎": { value: false, label: "彎", },
})



type Tconfig = {
  readonly key: string
  readonly label: string
  readonly list: {
    readonly key: string
    readonly module: "select" | "checkBar"
    readonly label: string
    readonly placeholder: string | undefined
    readonly className: string | undefined
    readonly options: Toption[] | undefined
    readonly checkBarPropsListCre: (() => TcheckProps["propsList"]) | undefined
  }[]
}



const configArr_left: Tconfig[] = [
  {
    key: "reel",
    label: "捲軸",
    list: [
      {
        key: "size", module: "select",
        label: "尺寸", placeholder: undefined,
        className: undefined,
        options: fakeOption_size,
        checkBarPropsListCre: undefined,
      },
      {
        key: "hasConvex", module: "checkBar",
        label: "有無凸", placeholder: undefined,
        className: undefined,
        options: undefined,
        checkBarPropsListCre: checkBarPropsList_boolean
      },
    ]
  },
  {
    key: "reelBox",
    label: "捲箱",
    list: [
      {
        key: "material", module: "select",
        label: "材質", placeholder: undefined,
        className: undefined,
        options: fakeOption_material,
        checkBarPropsListCre: undefined,
      },
      {
        key: "thickness", module: "select",
        label: "厚度", placeholder: undefined,
        className: undefined,
        options: fakeOption_thickness,
        checkBarPropsListCre: undefined,
      },
      {
        key: "surface", module: "checkBar",
        label: "表面", placeholder: undefined,
        className: undefined,
        options: undefined,
        checkBarPropsListCre: checkBarPropsListCre_surface,
      },
      {
        key: "front", module: "checkBar",
        label: "正面", placeholder: undefined,
        className: undefined,
        options: undefined,
        checkBarPropsListCre: checkBarPropsListCre_front,
      },
      {
        key: "hasConvex", module: "checkBar",
        label: "有無凸", placeholder: undefined,
        className: undefined,
        options: undefined,
        checkBarPropsListCre: checkBarPropsList_boolean
      },
      {
        key: "type", module: "select",
        label: "捲相型式", placeholder: undefined,
        className: undefined,
        options: fakeOption_reelBoxType,
        checkBarPropsListCre: undefined,
      },
    ]
  },
  {
    key: "base",
    label: "底座",
    list: [
      {
        key: "material", module: "select",
        label: "材質", placeholder: undefined,
        className: undefined,
        options: fakeOption_material,
        checkBarPropsListCre: undefined,
      },
      {
        key: "angleMaterial", module: "select",
        label: "角鐵材質", placeholder: undefined,
        className: undefined,
        options: fakeOption_material,
        checkBarPropsListCre: undefined,
      },
      {
        key: "baseMaterial", module: "select",
        label: "底座板材質", placeholder: undefined,
        className: undefined,
        options: fakeOption_material,
        checkBarPropsListCre: undefined,
      },
      {
        key: "type", module: "checkBar",
        label: "型式", placeholder: undefined,
        className: undefined,
        options: undefined,
        checkBarPropsListCre: checkBarPropsListCre_bastType,
      },
      {
        key: "surface", module: "checkBar",
        label: "表面", placeholder: undefined,
        className: undefined,
        options: undefined,
        checkBarPropsListCre: checkBarPropsListCre_surface,
      }
    ]
  },
  {
    key: "support",
    label: "支版",
    list: [
      {
        key: "bearing", module: "select",
        label: "軸承", placeholder: undefined,
        className: undefined,
        options: fakeOption_bearing,
        checkBarPropsListCre: undefined,
      },
      {
        key: "chain", module: "select",
        label: "鏈條", placeholder: undefined,
        className: undefined,
        options: fakeOption_chain,
        checkBarPropsListCre: undefined,
      }
    ]
  }
]


const configArr_right: Tconfig[] = [
  {
    key: "doorPiece",
    label: "門片",
    list: [
      {
        key: "material", module: "select",
        label: "材質", placeholder: undefined,
        className: undefined,
        options: fakeOption_material,
        checkBarPropsListCre: undefined,
      },
      {
        key: "surface", module: "checkBar",
        label: "表面", placeholder: undefined,
        className: undefined,
        options: undefined,
        checkBarPropsListCre: checkBarPropsListCre_surface,
      },
    ]
  },
  {
    key: "motor",
    label: "電動機",
    list: [
      {
        key: "horsepower", module: "select",
        label: "馬力數", placeholder: undefined,
        className: undefined,
        options: fakeOption_horsepower,
        checkBarPropsListCre: undefined,
      },
      {
        key: "manufacturer", module: "select",
        label: "廠商", placeholder: undefined,
        className: undefined,
        options: fakeOption_manufacturer,
        checkBarPropsListCre: undefined,
      },
      {
        key: "powerSupply", module: "select",
        label: "電供", placeholder: undefined,
        className: undefined,
        options: fakeOption_powerSupply,
        checkBarPropsListCre: undefined,
      },
      {
        key: "voltage", module: "select",
        label: "電壓", placeholder: undefined,
        className: undefined,
        options: fakeOption_voltage,
        checkBarPropsListCre: undefined,
      },
      {
        key: "support", module: "checkBar",
        label: "支撐架", placeholder: undefined,
        className: undefined,
        options: undefined,
        checkBarPropsListCre: checkBarPropsList_boolean
      },
      {
        key: "chainType", module: "checkBar",
        label: "鏈條型式", placeholder: undefined,
        className: undefined,
        options: undefined,
        checkBarPropsListCre: checkBarPropsListCre_chainType,
      },
      {
        key: "lockBox", module: "checkBar",
        label: "鎖盒", placeholder: undefined,
        className: undefined,
        options: undefined,
        checkBarPropsListCre: checkBarPropsListCre_lockBox,
      },
    ]
  },
  {
    key: "doorTrack",
    label: "門軌",
    list: [
      {
        key: "material", module: "select",
        label: "材質", placeholder: undefined,
        className: undefined,
        options: fakeOption_material,
        checkBarPropsListCre: undefined,
      },
      {
        key: "thickness", module: "select",
        label: "厚度", placeholder: undefined,
        className: undefined,
        options: fakeOption_thickness,
        checkBarPropsListCre: undefined,
      },
      {
        key: "surface", module: "checkBar",
        label: "表面", placeholder: undefined,
        className: undefined,
        options: undefined,
        checkBarPropsListCre: checkBarPropsListCre_surface,
      },
      {
        key: "silencer", module: "checkBar",
        label: "消音條", placeholder: undefined,
        className: undefined,
        options: undefined,
        checkBarPropsListCre: checkBarPropsList_boolean
      },
      {
        key: "doorTrackType", module: "checkBar",
        label: "型式", placeholder: undefined,
        className: undefined,
        options: undefined,
        checkBarPropsListCre: checkBarPropsListCre_doorTrackType,
      },
      {
        key: "doorTrackName", module: "select",
        label: "型式", placeholder: undefined,
        className: undefined,
        options: option_doorTrack_normal,
        checkBarPropsListCre: undefined,
      }



    ]
  }

]
