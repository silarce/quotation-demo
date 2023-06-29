import classNames from "classnames"

import Image from "next/image"



import scss from "./card.module.scss"

export default function WorkSheetCard(
  { isActive }:
    { isActive?: boolean }
) {


  return (
    <div className={classNames(scss.card, { [scss.active]: isActive })}>
      <div className={scss.left}>
        <span>D-SD1-1</span>
        <span>SJ-302</span>
        <span>數量 : 12樘</span>
      </div>
      <div className={scss.right}>
        {/* <Image src={ } alt="" /> */}
      </div>
    </div>
  )

}




