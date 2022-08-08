

import { SVGProps } from "react";

import style from "./svgIcons.module.scss"


// 將porps中的className取出，然後與本地css的className組合
const getClassName = (props: SVGProps<SVGSVGElement>) => {
  let { className, cursor } = props
  if (!className) className = ""
  // 如果有送auto特性進來，就設cursorAuto className
  cursor = cursor === "auto" ? style.cursorAuto : ""

  return className = `${style.svg} ${cursor} ${className}`
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
      <path d="M12.6364 12.6365L18.3636 18.3637" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconCopy(props: SVGProps<SVGSVGElement>) {
  const className = getClassName(props)
  return (
    <svg {...{ ...props, className }} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3.5" y="2.5" width="10" height="13" stroke="currentColor" />
      <path d="M13.5 8H17V19H9V15.6" stroke="currentColor" />
    </svg>
  )
}

export function IconDetail(props: SVGProps<SVGSVGElement>) {
  const className = getClassName(props)
  return (
    <svg {...{ ...props, className }} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6.5" y="4.5" width="7" height="4" stroke="currentColor" />
      <line x1="6" y1="14.5" x2="11" y2="14.5" stroke="currentColor" />
      <line x1="6" y1="11.5" x2="11" y2="11.5" stroke="currentColor" />
      <rect x="3.5" y="1.5" width="13" height="17" stroke="currentColor" />
    </svg>
  )
}

export function IconAddCircle(props: SVGProps<SVGSVGElement>) {
  let className = getClassName(props)
  className = `${className} ${style.addCircle}`
  return (
    <svg {...{ ...props, className }} width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M35 18C35 8.61116 27.3888 1 18 1C8.61116 1 1 8.61116 1 18C1 27.3888 8.61116 35 18 35C27.3888 35 35 27.3888 35 18Z" strokeMiterlimit="10" />
      <path d="M7.99023 17.7872H27.9625M17.9764 8V28" strokeWidth="2" />
    </svg>
  )
}

export function IconRemoveCircle(props: SVGProps<SVGSVGElement>) {
  let className = getClassName(props)
  className = `${className} ${style.addCircle}`
  return (
    <svg {...{ ...props, className }} width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M35 18C35 8.61116 27.3888 1 18 1C8.61116 1 1 8.61116 1 18C1 27.3888 8.61116 35 18 35C27.3888 35 35 27.3888 35 18Z" strokeMiterlimit="10" />
      <line x1="7.99023" y1="18" x2="27.9625" y2="18" strokeWidth="2" />
    </svg>
  )
}


















