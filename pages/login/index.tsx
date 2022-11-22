import Image from "next/image"

// logo
import logo from "public/image/logo/logoWithYear.svg"
import erpLogo from "public/image/logo/erpLogo.svg"
import imgArc from "public/image/blueArc.svg"


// css
import scss from "./login.module.scss"






export default function Login() {



  return (
    <div>
      <div className={scss.top}>
        {/* <Image src={logo} alt="logo" />
        <Image src={erpLogo} alt="erpLogo" />
        <Image src={imgArc} alt="" /> */}
      </div>


    </div>
  )
}




