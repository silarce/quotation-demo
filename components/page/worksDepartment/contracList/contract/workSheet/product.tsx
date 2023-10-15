
import { useMemo } from "react";

import { Control, Controller } from "react-hook-form";
import classNames from "classnames";

// gear
import InputSel from "components/global/gear/inputAndSel/inputSel";
import MyButton_v2 from "components/global/gear/button/myButton_v2";


import scss from './product.module.scss'

// fake
import { TfakeworkSheet } from "pages/worksDepartment/contractList/contract/workSheet";





export default function WorkSheetProduct(
  { control, fakeWorkSheet_ori, disabled, }:
    {
      control: Control<TfakeworkSheet, any>
      fakeWorkSheet_ori: TfakeworkSheet
      disabled: boolean
    }
) {





  return (
    <div className={scss.container}>
      <div className={scss.left}>
        <p>合約產品項目：</p>
        <div className={scss.list}>
          {configArr.map((item) => {
            const { key, label, className } = item
            return (
              <InputSel key={key} className={classNames(scss.inputSel, className)}
                label={label}
                inputProps={{
                  value: fakeWorkSheet_ori[key],
                }}
                captionColor="main" captionWidth={captionWidth}
                disabled={true} showBaseline="always" />
            )
          })}
          <InputSel className={classNames(scss.inputSel)}
            label={"防颱"}
            width="fit-content"
            checkProps={{
              propsList: { typhoonProtection: { value: fakeWorkSheet_ori["typhoonProtection"] } },
              toAside: "left"
            }}
            captionColor="main" captionWidth={captionWidth}
            disabled={disabled} showBaseline="always" />
        </div>
      </div> {/* left */}

      <hr />

      <div className={scss.right}>
        <p>調整過後項目：</p>
        <div className={scss.list}>
          {configArr.map((item) => {
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
          <InputSel className={classNames(scss.inputSel)}
            label={"防颱"}
            width="fit-content"
            checkProps={{
              propsList: { typhoonProtection: { value: true } },
              toAside: "left"
            }}
            captionColor="main" captionWidth={captionWidth}
            disabled={disabled} showBaseline="always" />
        </div>


      </div> {/* right */}


      <div className={scss.btn}>
        <MyButton_v2 label="計算" preImg="upload" onClick={()=>alert("test")} />
      </div>

    </div>
  )
}





// ==================================================================
const captionWidth = "100px"



const configArr = [
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
  {
    key: "height", label: "淨高(h)",
    placeholder: "請輸入淨高",
    className: undefined,
  },
  {
    key: "thickness", label: "捲箱高(B)",
    placeholder: "請輸入捲箱高",
    className: undefined,
  },
  {
    key: "quantity", label: "數量",
    placeholder: undefined,
    className: undefined,
  },
  {
    key: "material", label: "材質",
    placeholder: undefined,
    className: undefined,
  },
  // {key: "typhoonProtection", label: "防颱", className: undefined, },
] as const


