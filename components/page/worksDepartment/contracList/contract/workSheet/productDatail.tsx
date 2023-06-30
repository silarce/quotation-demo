
import { useMemo } from "react";

import { Control, Controller } from "react-hook-form";
import classNames from "classnames";
import _ from "lodash"


// gear
import InputSel, {
  TinputProps,
  TselectProps,
  TtextareaProps,
  TdatePickerProps,
  TtimePickerProps,
  TcheckProps,
} from "components/global/gear/inputAndSel/inputSel";
import MyButton_v2 from "components/global/gear/button/myButton_v2";


import scss from './productDetail.module.scss'
// other
import { Toption } from "js/utils/options/options";
// fake
import { TfakeworkSheet } from "pages/worksDepartment/contractList/contract/workSheet";





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
            <div key={pKey}>
              <p className={scss.sutTitle}>{label}</p>
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
                          }
                        }

                        if (module === "chectBar") {
                          const checkBarPropsList = checkBarPropsListCre()
                          if (value === false && "no" in checkBarPropsList) {
                            checkBarPropsList["no"].value = true
                          }
                          if (value === true && "yes" in checkBarPropsList) {
                            checkBarPropsList["yes"].value = true
                          }
                          checkProps = {
                            propsList: {
                              ...checkBarPropsList
                            },
                            isRadio: true
                          }
                        }

                        return (
                          <InputSel className={classNames(scss.inputSel, className)}
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

        })}










      </div> {/* left */}



      <div className={scss.right}>

        <div className={scss.list}>
          {configArr_Foo.map((item) => {
            const { key, label, className, placeholder } = item
            return (
              <Controller key={key} name={key} control={control}
                render={({ field }) => {

                  return (
                    <InputSel className={classNames(scss.inputSel, className)}
                      label={label}
                      inputProps={field}
                      captionColor="main" captionWidth={captionWidth}
                      disabled={disabled} showBaseline="always" />
                  )
                }
                } />
            )
          })}

        </div>

      </div> {/* right */}




    </div>
  )
}





// ==================================================================
const captionWidth = "100px"




const configArr_Foo = [
  {
    key: "itemName", label: "項目",
    placeholder: undefined,
    className: undefined,
  },
  {
    key: "doorType", label: "門型",
    placeholder: undefined,
    className: undefined,
  },
  {
    key: "length", label: "全寬(L)",
    placeholder: "請輸入全寬",
    className: undefined,
  },

  // {key: "typhoonProtection", label: "防颱", className: undefined, },
] as const



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

const checkBarPropsList_boolean = () => ({
  "no": { value: false, label: "無" },
  "yes": { value: false, label: "有" },
})

const checkBarPropsListCre_surface = () => ({
  "none": { value: false, label: "無" },
  "cloudWhite": { value: false, label: "正雲白" },
  "milkWhite": { value: false, label: "正乳白" },
})





const configArr_left = [
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
        key: "hasConvex", module: "chectBar",
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
        key: "surface", module: "chectBar",
        label: "表面", placeholder: undefined,
        className: undefined,
        options: undefined,
        checkBarPropsListCre: checkBarPropsListCre_surface,
      },

    ]
  }



] as const



