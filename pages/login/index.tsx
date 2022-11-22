import {
  Dispatch, SetStateAction,
  useState
} from "react"

import Image from "next/image"

// component
import Input02 from "components/global/gear/input/input02"

// antd
import { Button } from 'antd';

// global gear
import myAlert from "components/global/gear/modal/simpleModal/alertModals"

// logo
import logo from "public/image/logo/logoWithYear.svg"
import erpLogo from "public/image/logo/erpLogo.svg"
import imgArc from "public/image/blueArc.svg"
// img
import Imgbanner from "public/image/loginBanner.png"

// api
import { apiLogin, apiLogout, apiAuthMe } from 'js/api/api_auth'

// css
import scss from "./login.module.scss"






export default function Login(
  { setIsLoged }:
    { setIsLoged: Dispatch<SetStateAction<boolean>> }
) {
  const [isLoading, setIsLoading] = useState(false)
  // const [account, setAccont] = useState("")
  // const [password, setPassword] = useState("")
  const [account, setAccont] = useState("admin")
  const [password, setPassword] = useState("1qaz#EDC5tgb")

  const reqLog = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true)
      await apiLogin({ account, password })
      setIsLoged(true)
    }
    catch { myAlert.err({ title: "帳號或密碼錯誤" }) }
    finally { setIsLoading(false) }
  }



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
          stateValue={account}
          label="帳號"
          labelWidth="40px"
          gap="50px"
          placeholder="請輸入帳號"
          onChange={(e) => setAccont(e.target.value)}
          isInput={true}
        />
        <Input02 className={scss.input02}
          stateValue={password}
          label="密碼"
          labelWidth="40px"
          gap="50px"
          placeholder="請輸入密碼"
          onChange={(e) => setPassword(e.target.value)}
          isInput={true}
          inputType="password"
        />
        {/* <button className={scss.btn}><span>登入</span></button> */}
        <Button className={scss.btn} loading={isLoading}
          onClick={reqLog}
        >
          登入
        </Button>
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




