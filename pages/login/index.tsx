import { useState } from "react"

import Image from "next/image"

// component
import Input02 from "components/global/gear/input/input02"


// logo
import logo from "public/image/logo/logoWithYear.svg"
import erpLogo from "public/image/logo/erpLogo.svg"
import imgArc from "public/image/blueArc.svg"
// img
import Imgbanner from "public/image/loginBanner.png"

// css
import scss from "./login.module.scss"






export default function Login() {

  const [acc, setAcc] = useState("")
  const [pw, setPw] = useState("")


  return (
    <div className={scss.login}>
      <div className={scss.top}>
        <Image src={logo} alt="logo" />
        <Image src={erpLogo} alt="erpLogo" />
        <Image src={imgArc} alt="" />
      </div>

      <Image className={scss.banner}
        src={Imgbanner} alt="banner" />

      <form className={scss.loginPanel}
        onSubmit={() => { alert("test") }}>


        <Input02 className={scss.input02}
          stateValue={acc}
          label="帳號"
          labelWidth="40px"
          gap="50px"
          placeholder="請輸入帳號"
          onChange={(e) => setAcc(e.target.value)}
          isInput={true}
        />
        <Input02 className={scss.input02}
          stateValue={pw}
          label="密碼"
          labelWidth="40px"
          gap="50px"
          placeholder="請輸入密碼"
          onChange={(e) => setPw(e.target.value)}
          isInput={true}
          inputType="password"
        />
        <button className={scss.btn}><span>登入</span></button>
      </form>

      {/* 左下角背景的1/4球 */}
      <div className={scss.xball}>
        <div>
          <div />
          <div />
        </div>
      </div>

      {/* 右下角背景的一條線 */}
      <div className={scss.bgLine} />

    </div>
  )
}




