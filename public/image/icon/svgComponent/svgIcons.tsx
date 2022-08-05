

import { SVGProps } from "react";

import style from "./svgIcons.module.scss"


// 將porps中的className取出，然後與本地css的className組合
const getClassName = (props: SVGProps<SVGSVGElement>) => {
  let { className, cursor } = props
  if (!className) className = ""
  cursor = cursor === "auto" ? style.cursorAuto : ""
  return className = `${style.svg} ${className} ${cursor}`
}



export function Icondelete01(props: SVGProps<SVGSVGElement>) {
  const className = getClassName(props)
  return (
    <svg {...{ ...props, className }} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.71091 4.82351L4.5998 18H15.2665L16.1554 4.82351" stroke="currentColor" />
      <path d="M8.15571 7.64708V15.1765" stroke="currentColor" />
      <path d="M11.7109 7.64708V15.1765" stroke="currentColor" />
      <path d="M0.866638 5.2L19 5.2" stroke="currentColor" />
      <path d="M7.26665 2L12.6 2" stroke="currentColor" />
    </svg>
  )
}

export function IconEdit(props: SVGProps<SVGSVGElement>) {
  const className = getClassName(props)
  return (
    <svg {...{ ...props, className }} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.125 12.0955V14.7518H5.78125L13.6154 6.9176L10.9592 4.26135L3.125 12.0955ZM15.6696 4.86344C15.9458 4.58719 15.9458 4.14094 15.6696 3.86469L14.0121 2.20719C13.7358 1.93094 13.2896 1.93094 13.0133 2.20719L11.7171 3.50344L14.3733 6.15969L15.6696 4.86344Z" fill="currentColor" />
      <path d="M3 17.377H17" stroke="currentColor" />
    </svg>

  )
}

export function IconSearch(props: SVGProps<SVGSVGElement>) {
  const className = getClassName(props)
  return (
    <svg {...{ ...props, className }} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.13636 14.2727C11.5254 14.2727 14.2727 11.5254 14.2727 8.13636C14.2727 4.74734 11.5254 2 8.13636 2C4.74734 2 2 4.74734 2 8.13636C2 11.5254 4.74734 14.2727 8.13636 14.2727Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      {/* <path d="M8.13636 14.2727C11.5254 14.2727 14.2727 11.5254 14.2727 8.13636C14.2727 4.74734 11.5254 2 8.13636 2C4.74734 2 2 4.74734 2 8.13636C2 11.5254 4.74734 14.2727 8.13636 14.2727Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" /> */}
      <path d="M12.6364 12.6365L18.3636 18.3637" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      {/* <path d="M12.6364 12.6365L18.3636 18.3637" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" /> */}
    </svg>


  )
}