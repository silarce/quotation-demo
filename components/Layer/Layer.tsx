import React, { createContext } from "react";

import style from "./layer.module.scss"

// components
import Header from "./Header/Header"
import SideNav from "./SideNav/SideNav";

// type
import { TuserDto } from "js/api/dtoTypes";

type TlayerCtx = {
  reqLogout: () => void
  userInfo: TuserDto
}

export const LayerCtx = createContext<TlayerCtx>(null!)

// ======================================================================
export default function Layer(
  { children, reqLogout, userInfo }:
    {
      children: React.ReactNode
      reqLogout: () => void
      userInfo: TuserDto
    }) {

  return (
    <div className={style.container}>
      <LayerCtx.Provider value={{ reqLogout, userInfo }}>
        <Header />
      </LayerCtx.Provider>
      <div className={style.wrapper}>
        <SideNav />
        {/* main */}
        <div className={style.main}>{children}</div>
      </div>
    </div>
  )
}


