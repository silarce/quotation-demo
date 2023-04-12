import React from "react"
import classNames from "classnames"

import scss from "./subLayer.module.scss"

export default function SubLayer(
  { children, className, bodyClassName }:
    {
      children: React.ReactNode
      className?: string
      bodyClassName?: string
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
    </div>
  )
}