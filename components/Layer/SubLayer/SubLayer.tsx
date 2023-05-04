import React from "react"
import classNames from "classnames"

import scss from "./subLayer.module.scss"



/**
 * 基本上children只收兩個ReactNode
 * 
 * 第三個以後會放在第二個children下面(不是裡面)
 * 
 * 第三個以後基本上是用來放position:absolute的元件(通常是Modal)
 */
export default function SubLayer(
  { children, className, bodyClassName,containerChildren }:
    {
      children: React.ReactNode
      className?: string
      bodyClassName?: string
      containerChildren?: React.ReactNode
    }
) {
  const childredArr = React.Children.toArray(children)
  return (
    <div className={classNames(scss.container, className)}>
      {childredArr[0]}
      <div className={classNames(scss.body, bodyClassName)}>
        {childredArr[1]}
        {/*把剩下的childredArr的item放進來*/}
        {childredArr.slice(2)}
      </div>
      {containerChildren}
    </div>
  )
}