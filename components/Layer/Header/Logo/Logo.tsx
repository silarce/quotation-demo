import React from "react";

import style from "./logo.module.scss"

// logo
import logo from "public/Image/logo/logo01.svg"

export default function Logo() {

  return (
    <div className={style.container}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logo.src} alt="logo"
      />
      <div className={style.title}>
        <p>ERP</p>
        <p>管理系統</p>
      </div>
      <div className={style.redBlock} />
    </div>
  )
}



