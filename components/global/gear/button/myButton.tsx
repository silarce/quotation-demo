import classNames from "classnames"

// icon
import iconAdd from "public/image/icon/add.svg"
import iconDelete01 from "public/image/icon/delete01.svg"


import style from "./_button.module.scss"



export default function MyButton(
  { label, onClick, className, img, preImg, px }:
    {
      label: string
      onClick: () => void
      className?: string
      img?: string
      preImg?: keyof typeof preImgList
      px?: "px22" | "px44" | "px2227"
    }) {

  if (!img && preImg) {
    img = preImgList[preImg].src
  }

  return (
    <button className={classNames(style.button, px && style[px], className)}
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


