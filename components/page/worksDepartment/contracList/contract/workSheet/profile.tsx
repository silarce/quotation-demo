import { Control, Controller } from "react-hook-form";
import classNames from "classnames";

import InputSel from "components/global/gear/inputAndSel/inputSel"


import scss from "./profile.module.scss"

// fake
import { TfakeworkSheet } from "pages/worksDepartment/contractList/contract/workSheet";



export default function WorkSheetProfile(
  { control, disabled }:
    {
      control: Control<TfakeworkSheet, any>
      disabled: boolean
    }
) {

  return (
    <div className={scss.profile}>

      <div className={scss.left}>
        <div className={scss.top}>
          <Controller name="projectDesc" control={control}
            render={({ field }) =>
              <InputSel className={scss.inputSel} label="工程名稱"
                inputProps={field}
                captionColor="main" disabled={disabled} showBaseline="auto" />
            } />
          <Controller name="projectName" control={control}
            render={({ field }) =>
              <InputSel className={scss.inputSel} label="工程內容"
                inputProps={field}
                captionColor="main" disabled={disabled} showBaseline="auto" />
            } />
        </div>

        <hr />
        {/* 工程地點之後要改成下拉式選單 */}
        <div className={scss.bottom}>
          {configArr_left.map((item) => {
            const { key, label, className } = item
            return (
              <Controller key={key} name={key} control={control}
                render={({ field }) =>
                  <InputSel className={classNames(scss.inputSel, className)} label={label}
                    inputProps={field}
                    captionColor="main" disabled={disabled} showBaseline="auto" />
                } />
            )
          })}
        </div>
      </div>

      <div className={scss.right}>
        {configArr_right.map((item) => {
          const { key, label, className } = item
          return (
            <Controller key={key} name={key} control={control}
              render={({ field }) =>
                <InputSel className={classNames(scss.inputSel, className)} label={label}
                  inputProps={field}
                  captionWidth="80px" captionColor="main"
                  disabled={disabled} showBaseline="auto" />
              } />
          )
        })}
      </div>

    </div>
  )

}


// ==============================================================



const configArr_left = [
  {
    key: "constructionSiteNumber",
    label: "工地電話",
    className: undefined
  },
  {
    key: "projectPrincipal",
    label: "工程負責人",
    className: undefined
  },
  {
    key: "constructionSiteFax",
    label: "工地號碼",
    className: undefined
  },
  {
    key: "projectPrincipalPhone",
    label: "負責人電話",
    className: undefined
  },
  {
    key: "projectAddress",
    label: "工程地點",
    className: "col-span-2"
  },
] as const


const configArr_right = [
  { key: "projectNumber", label: "工程編號", className: undefined },
  { key: "contractor", label: "承包商", className: undefined },
  { key: "principal", label: "負責人", className: undefined },
  { key: "companyPhone", label: "公司電話", className: undefined },
  { key: "companyFax", label: "公司傳真", className: undefined },
] as const



