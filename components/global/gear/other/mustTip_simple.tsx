import classNames from "classnames"
import Image from "next/image"


// icon
import iconMust from "public/image/icon/asterisk.svg"

import scss from "./mustTip_simple.module.scss"


export default function MustTip_simple(
  { className }:
    { className?: string }
) {
  return (
    <div className={classNames(scss.mustTip, className)}>
      <Image src={iconMust} alt="必填" />
    </div>
  )

}

