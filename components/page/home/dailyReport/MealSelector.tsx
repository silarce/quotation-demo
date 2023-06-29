import { useState, useEffect, useContext } from "react"
import _ from "lodash"


// gear
import ModalListSelectorWithSearch from "components/global/gear/modal/modalListSelectorWithSearch"
import CellWithBar from "components/global/gear/cell/cellWithBar"

import scss from "./mealSelector.module.scss"


import { TdailyReportItemDto } from "js/api/dtoTypes"

// other
import { AppContext } from "pages/_app"


type Tmeal = "breakfast" | "lunch" | "dinner"


export default function MealSelector(
  { visible,
    onConfirm,
    onCancel,
    isYesterdaySamePrevDate
    // label,
    // tip,
  }:
    {
      visible: boolean
      onConfirm: (v: TdailyReportItemDto["meals"]) => void
      onCancel: () => void
      label?: string
      tip?: string
      isYesterdaySamePrevDate: boolean
    }
) {
  const { rwd1023 } = useContext(AppContext)

  const [mealArr, setMealArr] = useState<Tmeal[]>([])

  useEffect(() => {
    if (!visible) setMealArr([])
  }, [visible])


  const onClick = (v: TdailyReportItemDto["meals"][number]) => {
    const copyArr = [...mealArr]
    const theIndex = mealArr.findIndex((theMeal) => theMeal === v)
    if (theIndex > -1) copyArr.splice(theIndex, 1)
    else copyArr.push(v)
    setMealArr(copyArr)
  }

  const onSearch = (v: string) => {

  }

  return (
    <ModalListSelectorWithSearch
      className={scss.antdModal_meals}
      label={"選擇餐費"}
      visible={visible}
      onConfirm={() => onConfirm(mealArr)}
      onCancel={onCancel}
      onSearch={onSearch}
      width={rwd1023 ? "80vw" : "500px"}
      noSearch={true}
    // tip={tip}
    >
      <div className={scss.body}>

        {mealArrOption.map((data, index) => {
          const { value, label } = data

          if (!isYesterdaySamePrevDate && value === "breakfast") return null

          const isActive = mealArr.some(meal => meal === value)
          return (
            <CellWithBar key={index} className={scss.row}
              isActive={isActive}
              onClick={() => onClick(data.value)}
            >
              <span>{label}</span>
            </CellWithBar>
          )
        })}

      </div>
    </ModalListSelectorWithSearch >
  )
}


const mealArrOption = [
  { value: "breakfast", label: "早餐" },
  { value: "lunch", label: "午餐" },
  { value: "dinner", label: "晚餐" },
] as const
