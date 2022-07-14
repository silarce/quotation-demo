import Image from "next/image"

// css
import style from "./info.module.scss"

// img
import avatar from "public/image/avatar.png"
// icon
import logout from "public/image/icon/logout.svg"


export default function Info() {


  return (
    <div className={style.container}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={avatar.src} alt="頭像" className={style.avatar}
      />

      <div className={style.name}>
        <p>管理部</p>
        <p>王小明</p>
      </div>

      <div className={style.line} />

      <div className={style.logout}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logout.src} alt="登出"
        />
        <span>登出</span>
      </div>
    </div>
  )
}






