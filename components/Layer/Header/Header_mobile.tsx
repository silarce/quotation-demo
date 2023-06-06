

import Image from "next/image"

// logo
import logo from "public/image/logo/logo_header_mobile.png"
import iconMenu from "public/image/icon/menu02.svg"

// css
import scss from "./header_mobile.module.scss"


export default function Header_mobile() {

  return (
    <div className={scss.container}>
      <Image src={logo} alt="logo" />
      <Image className={scss.iconMenu}
        src={iconMenu} alt="menu" />
    </div>
  )
}







