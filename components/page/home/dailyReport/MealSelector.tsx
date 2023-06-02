import { useState, useEffect } from "react"
import _ from "lodash"


// gear
import ModalListSelectorWithSearch from "components/global/gear/modal/modalListSelectorWithSearch"
import CellWithBar from "components/global/gear/cell/cellWithBar"

import scss from "./mealSelector.module.scss"


import { TdailyReportItemDto } from "js/api/dtoTypes"

type Tmeal = "breakfast" | "lunch" | "dinner"


export default function MealSelector(
  { visible,
    onConfirm,
    onCancel,
    // label,
    // tip,
  }:
    {
      visible: boolean
      onConfirm: (v: TdailyReportItemDto["meals"][number] | undefined) => void
      onCancel: () => void
      label?: string
      tip?: string
    }
) {


  const [meal, setMeal] = useState<Tmeal>()

  useEffect(() => {
    if (!visible) setMeal(undefined)
  }, [visible])


  const onSearch = (v: string) => {

  }


  return (
    <ModalListSelectorWithSearch
      className={scss.antdModal}
      label={"選擇餐費"}
      visible={visible}
      onConfirm={() => onConfirm(meal)}
      onCancel={onCancel}
      onSearch={onSearch}
      width="800px"
    // tip={tip}
    >
      <div className={scss.body}>

        {mealArr.map((data, index) => {
          const { value, label } = data

          const onClick = () => {
            setMeal(value)
          };

          const isActive = value === meal
          // if (searchValue) {
          //   const regex = new RegExp(searchValue, 'i');
          //   if (
          //     !idNumber.match(regex) &&
          //     !chName.match(regex) &&
          //     !job.match(regex) &&
          //     !`${grade}`.match(regex)
          //   ) {
          //     return null;
          //   }
          // }


          return (
            <CellWithBar key={index} className={scss.row}
              isActive={isActive}
              onClick={onClick}
            >
              <span>{label}</span>
            </CellWithBar>
          )
        })}

      </div>
    </ModalListSelectorWithSearch >
  )
}


const mealArr = [
  { value: "breakfast", label: "早餐" },
  { value: "lunch", label: "午餐" },
  { value: "dinner", label: "晚餐" },
] as const




