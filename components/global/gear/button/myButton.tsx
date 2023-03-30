
import iconAdd from "public/image/icon/add.svg"
import iconDelete01 from "public/image/icon/delete01.svg"


import style from "./_button.module.scss"



export default function MyButton(
  { label, onClick, className, img, preImg }:
    {
      label: string
      onClick: () => void
      className?: string
      img?: string
      preImg?: keyof typeof preImgList
    }) {

  if (!img && preImg) {
    img = preImgList[preImg]
  }



  return (
    <button className={`${style.button} ${className || ""}`}
      onClick={onClick}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {img && <img src={img} alt="" />}
      <span >{label}</span>
    </button>
  )
}

// ======================================================

const preImgList = {
  add: iconAdd,
  delete: iconDelete01
}








