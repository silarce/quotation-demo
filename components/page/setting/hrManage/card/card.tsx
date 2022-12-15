import React from "react"

// gear
import AddButton from "components/global/gear/button/addButton"

// icon
import { IconRemoveCircle } from "public/image/icon/svgComponent/svgIcons"


// css
import scss from "./card.module.scss"







export default function Card(
  {
    label, addLabel, noDataTip, dataArr, showAdd, removeData, CustomItem }:
    {
      label: string
      addLabel: string
      noDataTip: string
      dataArr: (string | any)[]
      showAdd: () => void
      removeData: (index: number) => void
      CustomItem: React.ComponentType<any>
    }
) {

  return (
    <div className={scss.card}>
      <div className={scss.top}>
        <span>{label}</span>
        <AddButton className={scss.addBtn}
          label={addLabel} onClick={() => showAdd()} />
      </div>

      <div className={scss.main}>
        {dataArr.length === 0 &&
          <span className={scss.noDataTip}>{noDataTip}</span>
        }

        {dataArr.map((item, index) => {
          return (
            <div className={scss.tag} key={index}>
              <div className={scss.content}>
                {typeof item === "string" ? item : <CustomItem data={item} />}
              </div>
              <IconRemoveCircle onClick={() => { removeData(index) }} />
            </div>
          )
        })}
      </div>


    </div>
  )

}



